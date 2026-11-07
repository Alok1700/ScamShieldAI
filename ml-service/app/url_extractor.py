"""
URL Feature Extractor for ScamShield AI.

Extracts lexical, structural, and entropy features from raw URL strings
matching the schema of the 11,424-record cybersecurity URL dataset.
Completely safe: does zero network I/O, DNS resolution, or HTTP requests.
"""

import math
import re
from urllib.parse import urlparse
from collections import Counter
from typing import Dict, Any, List

POPULAR_TLDS = {
    'com', 'org', 'net', 'edu', 'gov', 'mil', 'in', 'co.in', 'io', 'de', 'uk', 
    'fr', 'es', 'it', 'nl', 'ca', 'au', 'jp', 'cn', 'ch', 'se', 'no', 'br', 'app', 'dev'
}

SUSPICIOUS_EXTENSIONS = (
    '.exe', '.cmd', '.vbs', '.bat', '.bin', '.arm', '.arm5', '.arm6', '.arm7', 
    '.sh', '.apk', '.msi', '.scr', '.elf', '.ps1', '.py', '.pl', '.cgi', '/bin', '/i',
    '.jar', '.tar', '.gz', '.zip', '.rar', '.iso', '.dmg', '.dll', '.hta', '.au3',
    '.mpsl', '.spc', '.x86_64', '.m', '.lnk'
)

def extract_url_features(raw_url: str) -> Dict[str, Any]:
    """
    Extracts the 16 standard features used by the ML URL Classifier:
    1. url_length
    2. has_ip_address
    3. dot_count
    4. https_flag
    5. url_entropy
    6. token_count
    7. subdomain_count
    8. query_param_count
    9. tld_length
    10. path_length
    11. has_hyphen_in_domain
    12. number_of_digits
    13. tld_popularity
    14. suspicious_file_extension
    15. domain_name_length
    16. percentage_numeric_chars
    """
    url = (raw_url or '').strip()
    if not url:
        return {col: 0 for col in [
            'url_length', 'has_ip_address', 'dot_count', 'https_flag', 'url_entropy',
            'token_count', 'subdomain_count', 'query_param_count', 'tld_length',
            'path_length', 'has_hyphen_in_domain', 'number_of_digits', 'tld_popularity',
            'suspicious_file_extension', 'domain_name_length', 'percentage_numeric_chars'
        ]}

    # Ensure schema for urlparse without altering original string length metrics
    if not url.startswith(('http://', 'https://')):
        parse_target = 'http://' + url
    else:
        parse_target = url

    try:
        parsed = urlparse(parse_target)
    except Exception:
        parsed = urlparse('http://invalid.invalid')

    hostname = (parsed.hostname or '').lower()
    path = parsed.path or ''
    query = parsed.query or ''
    url_length = len(url)

    # 1. IP address check (IPv4 or IPv6 or bracketed)
    ip_pattern = r'^(?:\d{1,3}\.){3}\d{1,3}$'
    has_ip_address = 1 if (re.match(ip_pattern, hostname) or hostname.startswith('[') or (hostname.isdigit() and len(hostname) > 4)) else 0

    # 2. Dot count in full URL
    dot_count = url.count('.')

    # 3. HTTPS flag
    https_flag = 1 if url.lower().startswith('https://') else 0

    # 4. Shannon Entropy
    counts = Counter(url)
    url_entropy = -sum((c / url_length) * math.log2(c / url_length) for c in counts.values()) if url_length > 0 else 0.0

    # 5. Token count (delimited by punctuation)
    tokens = [t for t in re.split(r'[/.:?&=_-]+', url) if t]
    token_count = len(tokens)

    # 6. Subdomain count
    host_parts = hostname.split('.')
    if has_ip_address:
        subdomain_count = max(0, len(host_parts) - 2)
    else:
        subdomain_count = max(0, len(host_parts) - 2) if len(host_parts) > 2 else (1 if len(host_parts) == 2 else 0)

    # 7. Query param count
    if query:
        query_param_count = max(1, len([p for p in query.split('&') if p]))
    else:
        query_param_count = 1

    # 8. TLD length & TLD popularity
    if has_ip_address:
        port = str(parsed.port) if parsed.port else ''
        tld_length = len(port) if port else 3
        tld_popularity = 0
    else:
        tld = host_parts[-1] if host_parts else ''
        tld_length = len(tld)
        tld_popularity = 1 if tld.lower() in POPULAR_TLDS else 0

    # 9. Path length (excluding leading slash)
    path_length = len(path.lstrip('/'))

    # 10. Hyphen in domain
    has_hyphen_in_domain = 1 if '-' in hostname else 0

    # 11. Number of digits
    number_of_digits = sum(c.isdigit() for c in url)

    # 12. Suspicious file extension
    lower_path = path.lower()
    suspicious_file_extension = 1 if any(lower_path.endswith(ext) or (ext in lower_path) for ext in SUSPICIOUS_EXTENSIONS) else 0

    # 13. Domain name length
    if has_ip_address:
        domain_name_length = len(host_parts[0]) if host_parts else 0
    elif len(host_parts) >= 2:
        domain_name_length = len(host_parts[-2])
    else:
        domain_name_length = len(hostname)

    # 14. Percentage numeric chars
    percentage_numeric_chars = (number_of_digits / url_length) * 100.0 if url_length > 0 else 0.0

    return {
        'url_length': int(url_length),
        'has_ip_address': int(has_ip_address),
        'dot_count': int(dot_count),
        'https_flag': int(https_flag),
        'url_entropy': float(round(url_entropy, 4)),
        'token_count': int(token_count),
        'subdomain_count': int(subdomain_count),
        'query_param_count': int(query_param_count),
        'tld_length': int(tld_length),
        'path_length': int(path_length),
        'has_hyphen_in_domain': int(has_hyphen_in_domain),
        'number_of_digits': int(number_of_digits),
        'tld_popularity': int(tld_popularity),
        'suspicious_file_extension': int(suspicious_file_extension),
        'domain_name_length': int(domain_name_length),
        'percentage_numeric_chars': float(round(percentage_numeric_chars, 4))
    }

def analyze_feature_anomalies(features: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Identifies notable risk anomalies from extracted features to explain the ML score.
    """
    anomalies = []

    if features.get('has_ip_address') == 1:
        anomalies.append({
            'feature': 'has_ip_address',
            'value': 1,
            'importance': 0.35,
            'description': 'Direct IP address hostname bypassing legitimate DNS registration and reputation tracking.'
        })

    if features.get('suspicious_file_extension') == 1:
        anomalies.append({
            'feature': 'suspicious_file_extension',
            'value': 1,
            'importance': 0.30,
            'description': 'URL points to executable payload or script (.exe, .arm, .bin, .apk, .vbs).'
        })

    if features.get('percentage_numeric_chars', 0) > 30.0:
        anomalies.append({
            'feature': 'percentage_numeric_chars',
            'value': f"{features['percentage_numeric_chars']:.1f}%",
            'importance': 0.25,
            'description': f"Excessive numeric character density ({features['percentage_numeric_chars']:.1f}%), typical of automated attack infrastructure."
        })

    if features.get('path_length', 0) > 40:
        anomalies.append({
            'feature': 'path_length',
            'value': features['path_length'],
            'importance': 0.20,
            'description': f"Abnormally deep path length ({features['path_length']} chars), often used to evade lexical path filters."
        })

    if features.get('https_flag') == 0:
        anomalies.append({
            'feature': 'https_flag',
            'value': 0,
            'importance': 0.15,
            'description': 'Missing HTTPS transport encryption (unsecured plaintext HTTP).'
        })

    if features.get('url_entropy', 0) > 4.2:
        anomalies.append({
            'feature': 'url_entropy',
            'value': features['url_entropy'],
            'importance': 0.18,
            'description': f"High Shannon entropy ({features['url_entropy']:.2f} bits/char), indicating random string generation or obfuscation."
        })

    if features.get('tld_popularity') == 0 and features.get('has_ip_address') == 0:
        anomalies.append({
            'feature': 'tld_popularity',
            'value': 0,
            'importance': 0.12,
            'description': 'Non-standard or low-reputation top-level domain.'
        })

    if features.get('has_hyphen_in_domain') == 1:
        anomalies.append({
            'feature': 'has_hyphen_in_domain',
            'value': 1,
            'importance': 0.10,
            'description': 'Hyphenated domain structure, often used for deceptive brand typosquatting.'
        })

    anomalies.sort(key=lambda x: x['importance'], reverse=True)
    return anomalies
