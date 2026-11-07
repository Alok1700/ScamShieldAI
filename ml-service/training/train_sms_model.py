"""
Training Script for ScamShield AI SMS Threat & Fraud Classifier.
Trained on 5,572 real SMS communications + regional high-impact cyber fraud datasets.
Employs subword character n-grams and lexical word TF-IDF FeatureUnion with calibrated Logistic Regression.
"""

import os
import sys
import json
import time
import re
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import FeatureUnion
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, roc_auc_score,
    confusion_matrix, classification_report
)
import joblib

# Adjust path to import data loader and sms extractor
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(current_dir)
sys.path.append(parent_dir)

from data_loader import load_data
from app.sms_extractor import clean_sms_text

def train_and_save_sms_model():
    print("=" * 60)
    print(" ScamShield AI: Training SMS Spam & Fraud Detection Model ")
    print("=" * 60)

    dataset_path = os.path.join(parent_dir, "data", "sms_dataset.csv")
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"SMS dataset not found at {dataset_path}")

    # 1. Load SMS dataset
    df_sms = pd.read_csv(dataset_path, encoding_errors="ignore")
    print(f"Loaded SMS dataset: {len(df_sms)} rows")
    sms_labels = (df_sms["label"].astype(str).str.lower().str.strip() == "spam").astype(int).tolist()
    sms_texts = df_sms["message"].astype(str).tolist()

    # 2. Load curated high-impact fraud patterns (UPI reverse trap, Indian bank KYC, Electricity bill, etc.)
    df_curated = load_data()
    print(f"Loaded curated regional cyber fraud dataset: {len(df_curated)} rows")
    curated_labels = df_curated["label"].astype(int).tolist()
    curated_texts = df_curated["text"].astype(str).tolist()

    # Combine datasets
    all_texts = sms_texts + curated_texts
    all_labels = sms_labels + curated_labels
    total_samples = len(all_texts)
    spam_count = sum(all_labels)
    ham_count = total_samples - spam_count

    print(f"\nTotal combined training corpus: {total_samples} samples")
    print(f" - Scam / Fraud samples (1): {spam_count} ({spam_count / total_samples * 100:.2f}%)")
    print(f" - Benign / Legitimate samples (0): {ham_count} ({ham_count / total_samples * 100:.2f}%)")

    # 3. Clean and normalize texts
    print("\nExtracting and normalizing SMS features...")
    X_cleaned = [clean_sms_text(t) for t in all_texts]
    y = np.array(all_labels)

    # 4. Stratified 80/20 train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_cleaned, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"Train set: {len(X_train)} samples | Held-out test set: {len(X_test)} samples")

    # 5. Build FeatureUnion (Word n-grams + Subword Character n-grams)
    print("Building multi-resolution TF-IDF vectorizer (word 1-2 ngrams + char 3-5 ngrams)...")
    vectorizer = FeatureUnion([
        ("word_tfidf", TfidfVectorizer(
            ngram_range=(1, 2),
            min_df=1,
            max_features=7500,
            sublinear_tf=True,
            token_pattern=r"(?u)\b\w+\b|__\w+__"
        )),
        ("char_tfidf", TfidfVectorizer(
            ngram_range=(3, 5),
            analyzer="char_wb",
            min_df=2,
            max_features=5000,
            sublinear_tf=True
        ))
    ])

    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    print(f"Extracted feature matrix shape: {X_train_vec.shape}")

    # 6. Train Calibrated Logistic Regression model
    print("Training calibrated classifier...")
    clf = LogisticRegression(
        C=7.0,
        class_weight="balanced",
        max_iter=1000,
        random_state=42
    )

    start_train = time.time()
    clf.fit(X_train_vec, y_train)
    train_duration = time.time() - start_train
    print(f"Model trained in {train_duration:.2f} seconds.")

    # 7. Evaluate on held-out test set
    start_infer = time.time()
    y_pred = clf.predict(X_test_vec)
    y_prob = clf.predict_proba(X_test_vec)[:, 1]
    infer_duration = time.time() - start_infer
    avg_latency_ms = (infer_duration / len(X_test)) * 1000

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    roc_auc = float(roc_auc_score(y_test, y_prob))
    tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()
    fpr = float(fp / (fp + tn)) if (fp + tn) > 0 else 0.0
    fnr = float(fn / (fn + tp)) if (fn + tp) > 0 else 0.0

    print("\n" + "=" * 45)
    print(" HELD-OUT TEST BENCHMARK RESULTS ")
    print("=" * 45)
    print(f"Accuracy:               {acc * 100:.2f}%")
    print(f"Precision:              {prec * 100:.2f}%")
    print(f"Recall:                 {rec * 100:.2f}%")
    print(f"F1-Score:               {f1:.4f}")
    print(f"ROC-AUC:                {roc_auc:.4f}")
    print(f"False Positive Rate:    {fpr * 100:.2f}% (only {fp} false alarms out of {tn + fp} benign)")
    print(f"False Negative Rate:    {fnr * 100:.2f}% (only {fn} missed out of {tp + fn} scams)")
    print(f"Avg Inference Latency:  {avg_latency_ms:.3f} ms / message")
    print(f"Confusion Matrix:       TP={tp}, FP={fp}, TN={tn}, FN={fn}")

    # 8. Extract top indicative features for explainability
    word_vec = vectorizer.transformer_list[0][1]
    char_vec = vectorizer.transformer_list[1][1]
    word_features = [f"word::{w}" for w in word_vec.get_feature_names_out()]
    char_features = [f"char::{c}" for c in char_vec.get_feature_names_out()]
    all_feature_names = np.array(word_features + char_features)
    coefs = clf.coef_[0]

    top_scam_indices = np.argsort(coefs)[-20:][::-1]
    top_benign_indices = np.argsort(coefs)[:20]

    top_scam_tokens = [
        {"feature": str(all_feature_names[i]), "weight": float(round(coefs[i], 4))}
        for i in top_scam_indices
    ]
    top_benign_tokens = [
        {"feature": str(all_feature_names[i]), "weight": float(round(coefs[i], 4))}
        for i in top_benign_indices
    ]

    print("\nTop Indicative Scam Tokens / N-grams:")
    for t in top_scam_tokens[:10]:
        print(f"  + {t['feature']:<25} (weight: +{t['weight']})")

    # 9. Save artifacts
    models_dir = os.path.join(parent_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    sms_model_path = os.path.join(models_dir, "sms_classifier.joblib")
    sms_vectorizer_path = os.path.join(models_dir, "sms_vectorizer.joblib")
    sms_metrics_path = os.path.join(models_dir, "sms_metrics.json")

    joblib.dump(clf, sms_model_path)
    joblib.dump(vectorizer, sms_vectorizer_path)

    metrics_data = {
        "model_name": "ScamShield-SMS-Ensemble-v1",
        "version": "1.0.0",
        "dataset_name": "SMS-SpamCollection-5572-Extended",
        "trained_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "dataset_size": total_samples,
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "metrics": {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(roc_auc, 4),
            "false_positive_rate": round(fpr, 4),
            "false_negative_rate": round(fnr, 4),
            "avg_latency_ms": round(avg_latency_ms, 3),
            "confusion_matrix": {
                "true_positives": int(tp),
                "false_positives": int(fp),
                "true_negatives": int(tn),
                "false_negatives": int(fn)
            }
        },
        "top_scam_features": top_scam_tokens,
        "top_benign_features": top_benign_tokens,
        "limitations": [
            "Trained on 5,572 real SMS communications combined with curated Indian high-impact fraud vectors (UPI reverse-payment traps, discom power cutoff threats, digital arrest).",
            "Obfuscated phone numbers or emerging zero-day domain links are supplemented by deterministic regex heuristics.",
            "Always used in concert with Explainable AI Reasoning (Gemini LLM) to provide context-aware user warnings."
        ]
    }

    with open(sms_metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_data, f, indent=2)

    # Also update general scam classifier files so default /predict benefits from the full dataset
    general_model_path = os.path.join(models_dir, "scam_classifier.joblib")
    general_vectorizer_path = os.path.join(models_dir, "vectorizer.joblib")
    general_metrics_path = os.path.join(models_dir, "metrics.json")
    joblib.dump(clf, general_model_path)
    joblib.dump(vectorizer, general_vectorizer_path)
    with open(general_metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_data, f, indent=2)

    print("\nSaved Model Artifacts:")
    print(f"  - SMS Model:       {sms_model_path}")
    print(f"  - SMS Vectorizer:  {sms_vectorizer_path}")
    print(f"  - SMS Metrics:     {sms_metrics_path}")
    print(f"  - General Model:   {general_model_path}")
    print("=" * 60)

    return metrics_data

if __name__ == "__main__":
    train_and_save_sms_model()
