"""
Evaluation script to benchmark the saved model on specific test cases.
Demonstrates low false-positive rate on legitimate banking and delivery alerts.
"""

import os
import json
import joblib
import numpy as np

def evaluate_benchmarks():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, "..", "models", "scam_classifier.joblib")
    vectorizer_path = os.path.join(current_dir, "..", "models", "vectorizer.joblib")

    if not os.path.exists(model_path) or not os.path.exists(vectorizer_path):
        print("Model or vectorizer not found. Please run train.py first.")
        return

    clf = joblib.load(model_path)
    vectorizer = joblib.load(vectorizer_path)

    test_cases = [
        # Phishing / Scams
        ("Dear customer, your SBI account is temporarily suspended. Submit OTP and PAN information immediately at https://sbi-kyc-security.example", 1, "SBI Suspended Phish"),
        ("Your electricity power will be disconnected tonight at 9:30 PM. Call 9876543210 immediately.", 1, "Electricity Cutoff Scam"),
        ("Work from home part-time, earn 5000 daily on Telegram liking videos", 1, "Telegram Job Scam"),
        ("You have won Rs 25 Lakh in KBC lottery. Pay Rs 5000 fee to WhatsApp 8765432109", 1, "Lottery Scam"),
        ("Enter your UPI PIN to receive Rs 1000 cashback in PhonePe", 1, "UPI PIN Trap"),

        # Legitimate messages
        ("Dear Customer, INR 5,000.00 credited to your A/C XX1234 on 05-Nov-2026 by NEFT. Available balance is INR 28,450.50. - State Bank of India", 0, "SBI Legit Credit Alert"),
        ("847291 is your OTP for login to ICICI Bank NetBanking. Valid for 5 mins. Do NOT share with anyone.", 0, "Legit ICICI Login OTP"),
        ("Your Amazon order #402-9847128-1928374 is out for delivery. Track in app.", 0, "Legit Amazon Delivery"),
        ("Hi Rahul, let's meet tomorrow at the college library at 4 PM to work on our presentation.", 0, "Personal Chat"),
        ("Your monthly electricity bill is Rs 850. Pay by 15-Nov on official portal mahadiscom.in", 0, "Legit Electricity Bill")
    ]

    print("\n=== Running Benchmark Evaluation ===")
    correct = 0
    results = []

    for text, expected, desc in test_cases:
        vec = vectorizer.transform([text.lower()])
        prob = clf.predict_proba(vec)[0][1]
        pred = int(prob >= 0.5)

        is_match = (pred == expected)
        if is_match:
            correct += 1

        status = "PASS" if is_match else "FAIL"
        results.append({
            "description": desc,
            "expected": expected,
            "predicted": pred,
            "scam_probability": round(float(prob), 4),
            "status": status
        })

        print(f"[{status}] {desc:<26} | P(Scam): {prob*100:5.1f}% | Pred: {pred} | Expected: {expected}")

    accuracy = (correct / len(test_cases)) * 100
    print(f"\nBenchmark Accuracy: {accuracy:.1f}% ({correct}/{len(test_cases)})")

    return results

if __name__ == "__main__":
    evaluate_benchmarks()
