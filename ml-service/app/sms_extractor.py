"""
SMS Preprocessing, Normalization and Feature Signal Extraction for ScamShield AI.
Extracts SMS-specific threat indicators: premium rate numbers, shortcodes, currency lures, and urgency markers.
"""

import re
from typing import Dict, Any, List

# Regex patterns for SMS features
URL_REGEX = re.compile(r"https?://\S+|www\.\S+", re.IGNORECASE)
PREMIUM_PHONE_REGEX = re.compile(r"\b(?:090\d{8}|087\d{8}|0845\d{7}|0800\d{6,7})\b", re.IGNORECASE)
CURRENCY_FULL_REGEX = re.compile(
    r"(?:[£$€₹]|(?:rs\.?|inr))\s*[\d,]+(?:\.\d+)?|[\d,]+(?:\.\d+)?\s*(?:pounds|p/day|ppm|p/min)",
    re.IGNORECASE
)

# Legitimate card/account endings, transaction IDs, OTPs, or references to protect from false shortcode tagging
ACCOUNT_ENDING_REGEX = re.compile(r"\b(?:ending|a/c|card|acc|ref|no|pin|otp)\s*(?:[xX*]*\s*)?\d{4,6}\b", re.IGNORECASE)

# Shortcodes are 5-6 digit standalone routing numbers (commonly prefixed 5-9 or following to/txt/send)
GENUINE_SHORTCODE_REGEX = re.compile(r"\b([5-9]\d{4}|8\d{4}|6\d{4}|7\d{4})\b")

PHONE_REGEX = re.compile(r"(?:\+?\d{1,3}[-.\s]?)?\b\d{10,11}\b")

# Action / urgency keywords typical in SMS fraud
URGENCY_KEYWORDS = [
    "valid 12 hours", "within 24 hours", "immediately", "turant", "urgent",
    "expires today", "last chance", "limited time", "final notice", "action required"
]

LURE_KEYWORDS_REGEX = re.compile(
    r"\b(?:won|win|winner|prize|reward|claim|cashback|lucky|processing fee|tax|lottery|congratulations|badhai ho)\b",
    re.IGNORECASE
)

def clean_sms_text(text: str) -> str:
    """
    Normalizes SMS text while retaining critical fraud indicator markers as special tokens.
    """
    if not text:
        return ""
    t = str(text)
    
    # Replace URLs with placeholder
    t = URL_REGEX.sub(" __URL__ ", t)
    
    # Replace UK/International premium rate telephone numbers
    t = PREMIUM_PHONE_REGEX.sub(" __PREMIUM_PHONE__ ", t)
    
    # Normalize currency and payment amounts
    t = CURRENCY_FULL_REGEX.sub(" __CURRENCY__ ", t)
    
    # Temporarily protect account/card numbers
    masked_accs = []
    def mask_acc(match):
        masked_accs.append(match.group(0))
        return f" __ACC_MASK_{len(masked_accs)-1}__ "
    t = ACCOUNT_ENDING_REGEX.sub(mask_acc, t)
    
    # Replace genuine SMS shortcodes (5-6 digits)
    t = GENUINE_SHORTCODE_REGEX.sub(" __SHORTCODE__ ", t)
    
    # Restore protected account endings
    for idx, orig in enumerate(masked_accs):
        t = t.replace(f"__ACC_MASK_{idx}__", orig)
    
    # Normalize general 10-11 digit telephone numbers
    t = PHONE_REGEX.sub(" __PHONE__ ", t)
    
    # Normalize Indian currency wording
    t = t.lower()
    t = t.replace("₹", " inr ").replace("rs.", " inr ").replace("rs ", " inr ")
    
    return t.strip()

def extract_sms_signals(raw_text: str) -> List[Dict[str, Any]]:
    """
    Extracts deterministic SMS cyber intelligence signals directly from raw SMS text.
    """
    signals = []
    text = str(raw_text or "")
    
    # 1. Premium rate callback phone numbers
    premium_matches = PREMIUM_PHONE_REGEX.findall(text)
    for p in set(premium_matches):
        signals.append({
            "type": "sms_premium_rate_number",
            "evidence": p,
            "description": f"Identified premium-rate callback phone number '{p}' known for high-cost per-minute billing scams.",
            "severity": "high"
        })
        
    # 2. Genuine SMS Shortcodes (excluding account endings)
    text_without_accs = ACCOUNT_ENDING_REGEX.sub(" ", text)
    shortcode_matches = GENUINE_SHORTCODE_REGEX.findall(text_without_accs)
    for sc in set(shortcode_matches):
        signals.append({
            "type": "sms_shortcode",
            "evidence": sc,
            "description": f"Message directs recipient to send a premium text or keyword to shortcode '{sc}'.",
            "severity": "medium"
        })
            
    # 3. Currency / Monetary lure - only when paired with reward, prize, or claim keywords
    if LURE_KEYWORDS_REGEX.search(text):
        currency_matches = CURRENCY_FULL_REGEX.findall(text)
        for c in set(currency_matches):
            signals.append({
                "type": "sms_monetary_lure",
                "evidence": c,
                "description": f"Prominently advertises financial reward, lottery claim, or unexpected charge ('{c}').",
                "severity": "medium"
            })
        
    # 4. Artificial Urgency / Deadline
    lower_t = text.lower()
    for uk in URGENCY_KEYWORDS:
        if uk in lower_t:
            signals.append({
                "type": "sms_urgency_trigger",
                "evidence": uk,
                "description": f"Applies psychological time pressure ('{uk}') to force quick unreflective compliance.",
                "severity": "high"
            })
            break
            
    return signals

COMMON_STOPWORDS = {
    "to", "your", "you", "have", "we", "the", "a", "an", "is", "for", "in", "on", 
    "of", "it", "at", "by", "from", "with", "as", "this", "that", "be", "or", 
    "are", "low", "so", "if", "not", "but", "all", "any", "can", "our", "my", 
    "me", "us", "he", "she", "they", "them", "was", "were", "been", "has", 
    "had", "do", "does", "did", "and", "will", "would", "shall", "should",
    "there", "here", "what", "which", "who", "when", "where", "why", "how",
    "you have", "have a", "to your", "in your", "for your", "with your"
}

def format_indicative_token(raw_name: str) -> str:
    """
    Formats internal model feature names into human-readable tokens for explainability.
    Filters out common stopwords, pronouns, and meaningless subwords.
    """
    if raw_name.startswith("word::"):
        w = raw_name[6:].strip().lower()
        if w in COMMON_STOPWORDS:
            return ""
        if len(w) <= 2 and w not in {"uk", "rs", "kb", "mb", "gb", "4u"}:
            return ""
        if w == "__premium_phone__":
            return "Premium Rate Phone Marker"
        if w == "__currency__":
            return "Monetary / Currency Marker"
        if w == "__shortcode__":
            return "SMS Shortcode Marker"
        if w == "__url__":
            return "Embedded Web Link Marker"
        if w == "__phone__":
            return "Callback Phone Number Marker"
        return w
    elif raw_name.startswith("char::"):
        c = raw_name[6:].strip().lower()
        if c.startswith("__") or c.endswith("__"):
            return ""
        # Filter short trivial character sequences or common stopwords
        if len(c) < 3 or c in COMMON_STOPWORDS:
            return ""
        # Filter if c is just whitespace + stopword
        clean_c = c.strip()
        if clean_c in COMMON_STOPWORDS or len(clean_c) < 3:
            return ""
        return clean_c
    return raw_name
