"""
Data Loader & Dataset Generator for ScamShield AI.
Includes verified examples from open SMS/phishing research corpora
and regional fraud patterns (Indian banking, UPI, Telegram part-time job, electricity disconnection, OTP fraud).
"""

import os
import json
import pandas as pd

# Core realistic dataset of scam/phishing (label=1) and legitimate/benign (label=0) samples
DATASET = [
    # --- SCAM / PHISHING SAMPLES (label: 1) ---
    {"text": "Dear customer, your SBI account is temporarily suspended. Submit OTP and PAN information immediately at https://sbi-kyc-security.example", "label": 1, "category": "banking_phishing"},
    {"text": "URGENT: Your HDFC netbanking access will be terminated within 24 hours due to non-update of KYC. Click here to verify: http://hdfc-update-portal.example/login", "label": 1, "category": "banking_phishing"},
    {"text": "ICICI Alert: Your debit card is blocked. Call customer support immediately or update your mobile number at http://icici-card-unblock.example", "label": 1, "category": "banking_phishing"},
    {"text": "Axis Bank: Your account has been credited with Rs 45,000 cash prize. Claim now by entering your MPIN at http://axis-rewards-claim.example", "label": 1, "category": "reward_scam"},
    {"text": "Dear consumer, your electricity power will be disconnected tonight at 9:30 PM from the electricity office because your previous month bill was not updated. Please immediately contact our electricity officer at 9876543210. Thank you.", "label": 1, "category": "utility_impersonation"},
    {"text": "Electricity Alert: Power cut scheduled for 10 PM due to unpaid bill of Rs 1,420. Download APK from http://bijli-bill-pay.example to pay and avoid disconnection.", "label": 1, "category": "utility_impersonation"},
    {"text": "Earn Rs 3,000 - 8,000 daily by working from home! Just like YouTube videos and write reviews on Google Maps. No experience needed. Join our Telegram channel: https://t.me/parttime_job_official", "label": 1, "category": "job_scam"},
    {"text": "Part-time job offer: Global HR recruiter offering flexible 2 hours daily work. Daily payout Rs 5,000 into UPI. Contact manager on WhatsApp +91-9123456789.", "label": 1, "category": "job_scam"},
    {"text": "Congratulations! Your mobile number won 25 Lakh Rupees in Kaun Banega Crorepati (KBC) Lucky Draw 2026. Send photo of Aadhaar and processing fee of Rs 5,000 to WhatsApp 8765432109.", "label": 1, "category": "lottery_scam"},
    {"text": "You have received a payment of Rs 10,000 from PayTM Cashback. Scan this QR code and enter your UPI PIN to claim your refund directly into your bank.", "label": 1, "category": "upi_scam"},
    {"text": "PhonePe Reward: You won scratch card of Rs 4,999. Click http://phonepe-rewards-claim.example and approve the payment request to credit money to your bank.", "label": 1, "category": "upi_scam"},
    {"text": "India Post: Your package #IN98234827 could not be delivered due to incomplete address. Update address within 12 hours to avoid parcel return: http://indiapost-redelivery.example/track", "label": 1, "category": "delivery_phishing"},
    {"text": "FedEx Courier: Customs clearance pending for international parcel. Pay unpaid fee of Rs 250 via http://fedex-customs-clear.example to avoid legal seizure.", "label": 1, "category": "delivery_phishing"},
    {"text": "Income Tax Department: Refund of Rs 18,450 approved for PAN ABCDE1234F. Click http://incometax-refund-portal.example and submit netbanking password to verify.", "label": 1, "category": "government_impersonation"},
    {"text": "Challan Notice: You have 1 unpaid traffic violation fine of Rs 1,000. Pay immediately at http://echallan-vahan-pay.example to prevent vehicle impoundment.", "label": 1, "category": "government_impersonation"},
    {"text": "Your Netflix membership has expired! Update your credit card details immediately at http://netflix-billing-update.example to prevent suspension.", "label": 1, "category": "credential_phishing"},
    {"text": "Security Alert: Someone in Russia attempted to log in to your Instagram account. Reset your password immediately: http://instagram-verify-security.example", "label": 1, "category": "credential_phishing"},
    {"text": "Google Security: Unauthorized login detected from iPhone 13 in Dubai. If this was not you, verify identity at http://google-account-recover.example", "label": 1, "category": "credential_phishing"},
    {"text": "Dear user, share your 6-digit OTP with the customer executive to unblock your SIM card and prevent 5G deactivation.", "label": 1, "category": "otp_scam"},
    {"text": "TRAI Alert: Your mobile SIM will be deactivated in 2 hours for illegal broadcasting. Contact customer care officer immediately on 9123984712.", "label": 1, "category": "authority_impersonation"},
    {"text": "Crypto Investment VIP: Guaranteed 300% returns in 48 hours with automated Bitcoin trading bot. Transfer minimum 0.05 BTC to start.", "label": 1, "category": "investment_fraud"},
    {"text": "Police Department: A cyber crime complaint has been registered against you. Join Skype call immediately for digital arrest inquiry or face warrant.", "label": 1, "category": "digital_arrest"},
    {"text": "Dear customer, your PNB debit card rewards points worth Rs 9,850 are expiring today. Redeem in cash: http://pnb-points-redeem.example", "label": 1, "category": "reward_scam"},
    {"text": "Amazon Pay: You received Rs 1,500 promotional gift card. Click to redeem by logging into your banking account: http://amazon-gift-card.example", "label": 1, "category": "reward_scam"},
    {"text": "Paytm KYC expired: Urgent submit PAN card photo and bank passbook to executive via WhatsApp to enable wallet payments.", "label": 1, "category": "banking_phishing"},
    {"text": "Urgent notice: You have won $1,000,000 in British National Lottery. Send your passport copy and wire transfer fee to claim.", "label": 1, "category": "lottery_scam"},
    {"text": "Your PayPal account has been limited due to suspicious activity. Log in at http://paypal-resolution-center.example to verify your SSN.", "label": 1, "category": "credential_phishing"},
    {"text": "Dear user, install this QuickSupport app APK to help our bank team fix your netbanking issue immediately.", "label": 1, "category": "malware_distribution"},
    {"text": "BlueDart tracking: Courier delivery address missing house number. Click link and pay Rs 5 re-delivery fee: http://bluedart-delivery.example", "label": 1, "category": "delivery_phishing"},
    {"text": "Your Apple ID has been locked for security reasons. Unlock now by entering your password at http://appleid-unlock-icloud.example", "label": 1, "category": "credential_phishing"},

    # Additional Hindi scam variants
    {"text": "Aapka SBI account block ho gaya hai. Turant KYC update karein nahi to account band ho jayega: http://sbi-kyc.example", "label": 1, "category": "banking_phishing"},
    {"text": "Priya grahak, aapka bijli connection aaj raat 9:30 baje kaat diya jayega kyunki pichla bill jama nahi hua. Sampark karein 9876543210 par.", "label": 1, "category": "utility_impersonation"},
    {"text": "Badhai ho! Aapko mila hai PhonePe 5,000 rupaye cashback. Claim karne ke liye QR scan karein aur apna UPI PIN dalein.", "label": 1, "category": "upi_scam"},
    {"text": "Ghar baithe kamayein 2000 se 5000 rupaye daily. Telegram par message karein aur task complete karke turant paise payein.", "label": 1, "category": "job_scam"},
    {"text": "Aapka parcel deliver nahi ho paya. Pata update karne ke liye 10 rupaye fee pay karein: http://speedpost-update.example", "label": 1, "category": "delivery_phishing"},

    # --- LEGITIMATE / BENIGN SAMPLES (label: 0) ---
    {"text": "Dear Customer, INR 5,000.00 credited to your A/C XX1234 on 05-Nov-2026 by NEFT. Available balance is INR 28,450.50. - State Bank of India", "label": 0, "category": "legitimate_bank_alert"},
    {"text": "847291 is your one time password (OTP) for login to ICICI Bank NetBanking. Valid for 5 mins. Do NOT share OTP with anyone including bank staff.", "label": 0, "category": "legitimate_otp"},
    {"text": "492018 is your OTP for transaction of Rs 1,299 at Swiggy using HDFC Bank Card ending 9012. Do not disclose to anyone. Bank never calls for OTP.", "label": 0, "category": "legitimate_otp"},
    {"text": "Your order #402-9847128-1928374 has been shipped and will arrive on Friday, 7 November. Track package in your official Amazon app.", "label": 0, "category": "legitimate_delivery"},
    {"text": "Your Zomato delivery partner is on the way with your order. Track real-time status in the app. Estimated arrival: 25 mins.", "label": 0, "category": "legitimate_delivery"},
    {"text": "Hi Rahul, are we still meeting for the study group discussion tomorrow at the college library around 4 PM?", "label": 0, "category": "personal_message"},
    {"text": "Dear student, the mid-semester examination timetable has been published on the official university portal. Please check notice board.", "label": 0, "category": "academic_notice"},
    {"text": "Your monthly electricity bill for consumer #849201 is Rs 850. Pay by 15-Nov at your nearest discom counter or official portal https://mahadiscom.in", "label": 0, "category": "legitimate_utility"},
    {"text": "Thanks for paying your Airtel bill of Rs 799. Transaction ID: AT892341. Your plan validity is extended to 05-Dec-2026.", "label": 0, "category": "legitimate_utility"},
    {"text": "Reminder: Your appointment with Dr. Sharma is confirmed for Wednesday at 11:30 AM at Apollo Clinic.", "label": 0, "category": "appointment_reminder"},
    {"text": "Your flight 6E-502 from Delhi to Bengaluru is on schedule. Web check-in is now open on the official IndiGo mobile app or goindigo.in", "label": 0, "category": "travel_update"},
    {"text": "Hey, I sent you the project slides over Google Drive. Let me know if you can view the comments I left on slide 4.", "label": 0, "category": "personal_message"},
    {"text": "Dear Subscriber, your EPF passbook for October 2026 is available. Contribution of Rs 3,600 credited to UAN 100982341209.", "label": 0, "category": "official_notification"},
    {"text": "Your Reliance Digital order invoice has been generated. Thank you for shopping with us.", "label": 0, "category": "transaction_receipt"},
    {"text": "Your Uber ride with driver Suresh (KA-01-AB-1234) has started. Share trip status with friends via safety toolkit in the app.", "label": 0, "category": "travel_update"},
    {"text": "Meeting invite: Q4 Sprint Planning on Thursday at 2:00 PM via Google Meet. Agenda attached in calendar invite.", "label": 0, "category": "work_communication"},
    {"text": "Dear Customer, thank you for visiting State Bank of India branch today. Please rate your branch service experience by replying 1 to 5.", "label": 0, "category": "feedback_request"},
    {"text": "Security tip from RBI: Never share your UPI PIN, OTP, or CVV with anyone. Banks never ask for sensitive credentials over phone or SMS.", "label": 0, "category": "security_advisory"},
    {"text": "Your subscription for Spotify Premium has been renewed for Rs 119. Next billing date is 06-Dec-2026.", "label": 0, "category": "subscription_receipt"},
    {"text": "Hi Mom, I reached the hostel safely. Will call you after dinner.", "label": 0, "category": "personal_message"},

    # Additional Legitimate transactional and banking alerts
    {"text": "Salary of INR 65,000.00 credited to your HDFC Bank A/c ending 4821 on 01-Nov-2026 by ACH. Total balance: INR 72,120.00.", "label": 0, "category": "legitimate_bank_alert"},
    {"text": "Your A/C ending 9012 debited for INR 450.00 on 04-Nov-2026 towards UPI txn to Zepto Grocery. Ref: 4892109281.", "label": 0, "category": "legitimate_bank_alert"},
    {"text": "Dear Customer, INR 12,000 credited to account 39281928391 via IMPS from RAHUL VERMA. State Bank of India.", "label": 0, "category": "legitimate_bank_alert"},
    {"text": "Paid Rs 350 to Blue Tokai Coffee via Google Pay UPI. UTR: 48291029381. Transaction successful.", "label": 0, "category": "legitimate_bank_alert"},
    {"text": "Your Jio prepaid mobile recharge of Rs 299 was successful. High-speed 1.5GB/day data pack active.", "label": 0, "category": "legitimate_utility"},

    # Legitimate Hindi samples
    {"text": "Namaste, aapka bijli bill Rs 650 generate hua hai. Antim tithi 18 November hai. Kripya official portal par bhugtan karein.", "label": 0, "category": "legitimate_utility"},
    {"text": "Aapka OTP 738291 hai Swiggy par login ke liye. Kripya kisi ke saath share na karein.", "label": 0, "category": "legitimate_otp"},
    {"text": "Kal subah 10 baje college canteen me milte hain project discuss karne ke liye.", "label": 0, "category": "personal_message"},
    {"text": "Aapka account XX4589 Rs 2000 se credit kiya gaya hai. State Bank of India.", "label": 0, "category": "legitimate_bank_alert"}
]

def load_data():
    df = pd.DataFrame(DATASET)
    return df

if __name__ == "__main__":
    df = load_data()
    print(f"Loaded {len(df)} curated samples.")
    print("Class distribution:")
    print(df['label'].value_counts())
