"""
Training script for ScamShield AI Text Phishing & Scam Classifier.
Trains a TF-IDF + Calibrated Logistic Regression model with documented metrics.
"""

import os
import json
import time
import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedKFold, cross_validate, train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    precision_score, recall_score, f1_score, roc_auc_score,
    confusion_matrix, classification_report
)
import joblib

from data_loader import load_data

def preprocess_text(text: str) -> str:
    """Normalize text while retaining critical fraud indicator markers."""
    t = str(text).lower()
    # Normalize rupees and amounts
    t = t.replace("₹", " inr ").replace("rs.", " inr ").replace("rs ", " inr ")
    return t

def train_and_evaluate():
    print("=== ScamShield AI: Training Phishing & Scam Classifier ===")
    df = load_data()
    print(f"Dataset Size: {len(df)} samples")
    print(f"Scam (1): {sum(df['label'] == 1)} | Legitimate (0): {sum(df['label'] == 0)}")

    X = [preprocess_text(t) for t in df['text']]
    y = df['label'].values

    # Train / Test split with fixed random state for reproducibility
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    print(f"Train size: {len(X_train)} | Test size: {len(X_test)}")

    # TF-IDF Feature Extractor
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        min_df=1,
        max_features=2500,
        sublinear_tf=True,
        token_pattern=r"(?u)\b\w+\b|https?://[^\s]+|(?:\+?\d{1,3}[-.\s]?)?\d{10}"
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # Train Logistic Regression model with calibrated probability outputs
    clf = LogisticRegression(
        C=2.0,
        class_weight="balanced",
        max_iter=1000,
        random_state=42
    )

    start_train = time.time()
    clf.fit(X_train_vec, y_train)
    train_duration_sec = time.time() - start_train

    # Measure inference latency on test set
    start_infer = time.time()
    y_pred = clf.predict(X_test_vec)
    y_prob = clf.predict_proba(X_test_vec)[:, 1]
    inference_latency_ms = ((time.time() - start_infer) / len(X_test)) * 1000

    # Calculate metrics
    precision = float(precision_score(y_test, y_pred, zero_division=0))
    recall = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    roc_auc = float(roc_auc_score(y_test, y_prob))
    tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()
    fpr = float(fp / (fp + tn)) if (fp + tn) > 0 else 0.0
    fnr = float(fn / (fn + tp)) if (fn + tp) > 0 else 0.0

    print("\n--- Evaluation on Held-Out Test Set ---")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1 Score:  {f1:.4f}")
    print(f"ROC-AUC:   {roc_auc:.4f}")
    print(f"False Positive Rate: {fpr:.4f}")
    print(f"False Negative Rate: {fnr:.4f}")
    print(f"Avg Inference Latency: {inference_latency_ms:.2f} ms/sample")
    print(f"Confusion Matrix: TP={tp}, FP={fp}, TN={tn}, FN={fn}")

    # Top indicative tokens for explainability inspection
    feature_names = np.array(vectorizer.get_feature_names_out())
    coefs = clf.coef_[0]
    top_scam_indices = np.argsort(coefs)[-15:][::-1]
    top_benign_indices = np.argsort(coefs)[:15]

    top_scam_features = [
        {"feature": str(feature_names[i]), "weight": float(round(coefs[i], 4))}
        for i in top_scam_indices
    ]
    top_benign_features = [
        {"feature": str(feature_names[i]), "weight": float(round(coefs[i], 4))}
        for i in top_benign_indices
    ]

    # Save artifacts
    output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
    os.makedirs(output_dir, exist_ok=True)

    model_path = os.path.join(output_dir, "scam_classifier.joblib")
    vectorizer_path = os.path.join(output_dir, "vectorizer.joblib")
    metrics_path = os.path.join(output_dir, "metrics.json")

    joblib.dump(clf, model_path)
    joblib.dump(vectorizer, vectorizer_path)

    metrics_data = {
        "model_name": "ScamShield-TFIDF-LogReg-v1",
        "version": "1.0.0",
        "trained_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "dataset_size": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "metrics": {
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(roc_auc, 4),
            "false_positive_rate": round(fpr, 4),
            "false_negative_rate": round(fnr, 4),
            "avg_latency_ms": round(inference_latency_ms, 2),
            "confusion_matrix": {
                "true_positives": int(tp),
                "false_positives": int(fp),
                "true_negatives": int(tn),
                "false_negatives": int(fn)
            }
        },
        "top_scam_features": top_scam_features,
        "top_benign_features": top_benign_features,
        "limitations": [
            "Trained on curated English and Hindi mobile scam and transactional notification datasets.",
            "Heuristic confidence calibration reflects vocabulary patterns and should be combined with deterministic security rules.",
            "Novel zero-day brand domains or non-Latin character sets require rule-based lexical URL checks."
        ]
    }

    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_data, f, indent=2)

    print(f"\nModel artifacts saved successfully:")
    print(f"  - Model: {model_path}")
    print(f"  - Vectorizer: {vectorizer_path}")
    print(f"  - Metrics: {metrics_path}")

    return metrics_data

if __name__ == "__main__":
    train_and_evaluate()
