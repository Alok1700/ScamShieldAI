"""
Production Training Pipeline for ScamShield AI URL Fraud & Threat Classifier.

Trained on the 11,424-record cybersecurity URL dataset.
Evaluates accuracy, precision, recall, F1, ROC-AUC, and inference latency.
Saves model artifact and metrics.
"""

import os
import json
import time
from datetime import datetime, timezone
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report
)

FEATURE_COLS = [
    'url_length', 'has_ip_address', 'dot_count', 'https_flag', 'url_entropy',
    'token_count', 'subdomain_count', 'query_param_count', 'tld_length',
    'path_length', 'has_hyphen_in_domain', 'number_of_digits', 'tld_popularity',
    'suspicious_file_extension', 'domain_name_length', 'percentage_numeric_chars'
]

def train_and_save_url_model(data_path: str = None, models_dir: str = None):
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if data_path is None:
        data_path = os.path.join(base_dir, "data", "url_features.csv")
    if models_dir is None:
        models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    print(f"[URL Model Training] Loading dataset from: {data_path}")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}")

    df = pd.read_csv(data_path)
    total_samples = len(df)
    print(f"[URL Model Training] Total records: {total_samples}")

    X = df[FEATURE_COLS].copy()
    # Target: 1 for Malicious (CSV ClassLabel == 0), 0 for Benign (CSV ClassLabel == 1)
    y = (df['ClassLabel'] == 0).astype(int)

    malicious_count = int(y.sum())
    benign_count = int((y == 0).sum())
    print(f"[URL Model Training] Class distribution -> Malicious: {malicious_count} ({malicious_count/total_samples*100:.1f}%), Benign: {benign_count} ({benign_count/total_samples*100:.1f}%)")

    # Stratified Train/Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=1, stratify=y
    )
    print(f"[URL Model Training] Train set: {len(X_train)} | Test set: {len(X_test)}")

    # Base Random Forest
    base_rf = RandomForestClassifier(
        n_estimators=150,
        max_depth=16,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=1,
        n_jobs=-1
    )

    # Probability Calibration
    calibrated_clf = CalibratedClassifierCV(
        estimator=base_rf,
        method='sigmoid',
        cv=3
    )

    print("[URL Model Training] Training Random Forest with Probability Calibration...")
    train_start = time.time()
    calibrated_clf.fit(X_train, y_train)
    training_duration = time.time() - train_start
    print(f"[URL Model Training] Training complete in {training_duration:.2f} seconds.")

    # Fit base_rf separately on full train to extract global feature importances
    base_rf.fit(X_train, y_train)
    feature_importances = {
        feat: float(round(imp, 5))
        for feat, imp in sorted(zip(FEATURE_COLS, base_rf.feature_importances_), key=lambda x: x[1], reverse=True)
    }

    # Evaluate on held-out test set
    eval_start = time.time()
    y_pred = calibrated_clf.predict(X_test)
    y_prob = calibrated_clf.predict_proba(X_test)[:, 1]
    eval_duration = time.time() - eval_start
    latency_per_sample_ms = (eval_duration / len(X_test)) * 1000

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred))
    rec = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    auc = float(roc_auc_score(y_test, y_prob))
    cm = confusion_matrix(y_test, y_pred).tolist()

    print("\n" + "=" * 60)
    print("           SCAMSHIELD AI - URL MODEL TEST RESULTS            ")
    print("=" * 60)
    print(f"  Accuracy:         {acc * 100:.2f}%")
    print(f"  Precision:        {prec * 100:.2f}%")
    print(f"  Recall:           {rec * 100:.2f}%")
    print(f"  F1 Score:         {f1 * 100:.2f}%")
    print(f"  ROC-AUC:          {auc:.4f}")
    print(f"  Infer Latency:    {latency_per_sample_ms:.4f} ms / sample")
    print(f"  Confusion Matrix: [TN: {cm[0][0]}, FP: {cm[0][1]}; FN: {cm[1][0]}, TP: {cm[1][1]}]")
    print("=" * 60 + "\n")

    # Serialize Model Artifact
    model_save_path = os.path.join(models_dir, "url_classifier.joblib")
    joblib.dump(calibrated_clf, model_save_path, compress=3)
    print(f"[URL Model Training] Model saved to {model_save_path}")

    # Save Metrics & Metadata
    metrics_payload = {
        "model_name": "ScamShield URL Threat Classifier (Calibrated Random Forest)",
        "version": "1.0.0",
        "dataset_name": "URL Features Threat Dataset (11,424 samples)",
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "dataset_size": total_samples,
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "features": FEATURE_COLS,
        "feature_importances": feature_importances,
        "metrics": {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(auc, 4),
            "confusion_matrix": {
                "true_negative": cm[0][0],
                "false_positive": cm[0][1],
                "false_negative": cm[1][0],
                "true_positive": cm[1][1]
            },
            "latency_ms_per_sample": round(latency_per_sample_ms, 4),
            "training_time_sec": round(training_duration, 2)
        },
        "thresholds": {
            "high_risk": 0.75,
            "elevated_risk": 0.50,
            "caution_risk": 0.30
        },
        "limitations": [
            "Evaluates lexical and structural signals offline; does not perform active HTTP/network execution.",
            "Newly minted benign domains may trigger low-confidence caution if unusual TLDs are used.",
            "Must be combined with threat intelligence and LLM explainability for full context."
        ]
    }

    metrics_save_path = os.path.join(models_dir, "url_metrics.json")
    with open(metrics_save_path, "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=2)
    print(f"[URL Model Training] Metrics saved to {metrics_save_path}")

    return calibrated_clf, metrics_payload

if __name__ == "__main__":
    train_and_save_url_model()
