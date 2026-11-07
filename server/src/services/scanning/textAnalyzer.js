/**
 * Deterministic Cybersecurity Text Rule Engine for ScamShield AI.
 * 
 * Accurately detects:
 * - Urgency, fear & psychological pressure
 * - Authority & brand impersonation (Indian discoms, banks, courts, police, courier)
 * - Credential, OTP, Aadhaar, PAN harvesting
 * - UPI Reverse-Payment / Cashback traps (Enter PIN to receive)
 * - Telegram part-time task / fake job offers
 * - Malware / APK download coercion
 * - Lottery / KBC lucky draw lures
 * 
 * Quotes direct verifiable evidence snippets from the input without hallucinating.
 */

const URL_EXTRACT_REGEX = /((?:https?:\/\/|www\.)[^\s<>"'{}|\\^`]+)/gi;

const RULE_DEFINITIONS = [
  // --- URGENCY & THREATS ---
  {
    id: 'urgency_account_suspension',
    category: 'urgency',
    severity: 'high',
    patterns: [
      /\b(?:account|access|netbanking|card|sim)\s+(?:will be|is|has been)?\s*(?:temporarily\s+)?(?:suspended|blocked|terminated|deactivated|closed|frozen)\b/i,
      /\b(?:within|in)\s+(?:10|15|20|30|45)?\s*(?:minutes?|mins?|hours?|24\s*hours?)\b/i,
      /\b(?:turant|urgent|immediately|without delay|action required)\b/i,
      /\b(?:account\s+block\s+ho\s+gaya|band\s+ho\s+jayega)\b/i
    ],
    matchAll: false,
    explanation: 'The message imposes artificial urgency or threatens imminent account suspension to induce panicked compliance.'
  },
  {
    id: 'utility_disconnection_threat',
    category: 'authority_impersonation',
    severity: 'high',
    patterns: [
      /\b(?:electricity|power|bijli)\s+(?:bill|power|connection|supply)?\s*(?:will be|aaj raat)?\s*(?:disconnected|cut off|band)\b/i,
      /\b(?:electricity officer|discom|bijli office|power office)\b/i
    ],
    matchAll: false,
    explanation: 'Impersonates an electricity discom threatening power disconnection tonight over alleged unpaid utility dues.'
  },
  {
    id: 'digital_arrest_coercion',
    category: 'authority_impersonation',
    severity: 'critical',
    patterns: [
      /\b(?:digital arrest|cbi|police department|cyber crime branch|interpol|court warrant|supreme court|trai legal)\b/i,
      /\b(?:skype call|video call investigation|arrest warrant|fir registered)\b/i
    ],
    matchAll: false,
    explanation: 'Simulates law enforcement threatening "digital arrest" or warrants — an illicit extortion tactic nonexistent in Indian law.'
  },

  // --- CREDENTIAL & OTP HARVESTING ---
  {
    id: 'otp_harvesting',
    category: 'credential_harvesting',
    severity: 'high',
    patterns: [
      /\b(?:submit|share|enter|send|provide|verify)\s+(?:your\s+)?(?:6-digit\s+)?(?:otp|one time password|verification code)\b/i,
      /\b(?:share\s+otp|otp\s+share\s+karein|apna\s+otp)\b/i
    ],
    matchAll: false,
    explanation: 'Directly solicits a One-Time Password (OTP), which legitimate banks and service providers explicitly never request.'
  },
  {
    id: 'kyc_pan_credential_demand',
    category: 'credential_harvesting',
    severity: 'high',
    patterns: [
      /\b(?:update|submit|verify|complete)\s+(?:your\s+)?(?:kyc|pan|aadhaar|pan information|debit card details)\b/i,
      /\b(?:kyc\s+update\s+karein|aadhaar\s+pan\s+update)\b/i
    ],
    matchAll: false,
    explanation: 'Demands personal identity records (PAN, Aadhaar, KYC) under the pretext of mandatory regulatory compliance.'
  },

  // --- UPI & PAYMENT REVERSE TRAPS ---
  {
    id: 'upi_pin_receive_trap',
    category: 'upi_scam',
    severity: 'high',
    patterns: [
      /\b(?:enter|put|type)\s+(?:your\s+)?(?:upi\s*pin|mpin)\s+(?:to\s+)?(?:receive|claim|credit|get)\b/i,
      /\b(?:upi pin dalein|pin daal kar paise payein|claim karne ke liye upi pin)\b/i,
      /\b(?:scan\s+qr\s+(?:code\s+)?(?:to|and)\s+(?:receive|claim)\s+(?:money|cashback|refund))\b/i
    ],
    matchAll: false,
    explanation: 'CRITICAL UPI MISCONCEPTION: Entering a UPI PIN ALWAYS authorizes a debit from your account. You NEVER need to enter a PIN to receive funds.'
  },

  // --- FINANCIAL LURES & FAKE JOBS ---
  {
    id: 'lottery_kbc_reward',
    category: 'reward_scam',
    severity: 'high',
    patterns: [
      /\b(?:congratulations|badhai ho|lucky draw|kbc|kaun banega crorepati|won\s+(?:rs\.?|inr|\$)?\s*\d+)\b/i,
      /\b(?:processing fee|registration fee|transfer fee|lottery tax)\b/i
    ],
    matchAll: false,
    explanation: 'Promises exorbitant lottery or promotional rewards while asking for upfront processing or transfer fees.'
  },
  {
    id: 'telegram_task_job_scam',
    category: 'job_scam',
    severity: 'high',
    patterns: [
      /\b(?:part-time job|work from home|ghar baithe kamayein)\b/i,
      /\b(?:like youtube videos|review on google maps|telegram channel|daily payout|earn\s+(?:rs\.?|inr)?\s*\d+\s*(?:daily|per day))\b/i
    ],
    matchAll: false,
    explanation: 'Promotes deceptive "work-from-home" tasks (liking YouTube videos, reviewing Maps) that channel victims into Telegram investment traps.'
  },

  // --- MALWARE / APK DISTRIBUTION ---
  {
    id: 'apk_malware_lure',
    category: 'malware_distribution',
    severity: 'high',
    patterns: [
      /\b(?:\.apk|download apk|install apk|install this app|quicksupport|anydesk|teamviewer)\b/i
    ],
    matchAll: false,
    explanation: 'Directs recipients to download sideloaded Android APKs or remote desktop software that can compromise device telemetry.'
  },

  // --- COURIER / DELIVERY REDELIVERY PHISHING ---
  {
    id: 'delivery_redirection_trap',
    category: 'delivery_phishing',
    severity: 'medium',
    patterns: [
      /\b(?:package|parcel|courier|shipment)\s+(?:could not be delivered|pending|failed delivery|address incomplete)\b/i,
      /\b(?:update address|pay\s+(?:unpaid\s+)?(?:fee|rs\s*\d+)|customs clearance)\b/i
    ],
    matchAll: false,
    explanation: 'Fake delivery notification claiming an undelivered parcel to extract card details or re-delivery fees.'
  }
];

/**
 * Extracts URLs from a given text safely.
 */
function extractUrls(text) {
  if (!text) return [];
  const matches = text.match(URL_EXTRACT_REGEX) || [];
  // Deduplicate and trim trailing punctuation like periods or commas
  const clean = matches.map(u => u.replace(/[.,;!?)]+$/, ''));
  return Array.from(new Set(clean));
}

/**
 * Analyzes text for cyber threat indicators, extracting verifiable evidence snippets.
 */
function analyzeText(rawText) {
  const text = (rawText || '').trim();
  const detectedSignals = [];
  const extractedUrls = extractUrls(text);

  if (!text) {
    return {
      textLength: 0,
      detectedSignals: [],
      extractedUrls: [],
      rulesTriggered: 0,
      textRiskScore: 0
    };
  }

  // Iterate over deterministic rule definitions
  RULE_DEFINITIONS.forEach(rule => {
    let triggered = false;
    let evidenceMatches = [];
    let primarySpan = null;

    for (const pattern of rule.patterns) {
      const match = text.match(pattern);
      if (match) {
        triggered = true;
        evidenceMatches.push(match[0]);
        if (!primarySpan && typeof match.index === 'number') {
          primarySpan = {
            text: match[0],
            start: match.index,
            end: match.index + match[0].length
          };
        }
      }
    }

    if (triggered) {
      // Find clean snippet context
      const evidenceStr = evidenceMatches.join(' | ');
      detectedSignals.push({
        type: rule.id,
        severity: rule.severity,
        evidence: evidenceStr,
        category: 'observed_evidence',
        span: primarySpan || { text: evidenceMatches[0], start: text.indexOf(evidenceMatches[0]), end: text.indexOf(evidenceMatches[0]) + (evidenceMatches[0]?.length || 0) },
        explanation: rule.explanation,
        source: 'text_rule'
      });
    }
  });

  // Calculate text risk score from rules
  let textRiskScore = 0;
  detectedSignals.forEach(sig => {
    if (sig.severity === 'critical') textRiskScore += 45;
    else if (sig.severity === 'high') textRiskScore += 30;
    else if (sig.severity === 'medium') textRiskScore += 15;
    else if (sig.severity === 'low') textRiskScore += 5;
  });

  // Cap initial rule risk score at 100
  textRiskScore = Math.min(100, textRiskScore);

  return {
    textLength: text.length,
    detectedSignals,
    extractedUrls,
    rulesTriggered: detectedSignals.length,
    textRiskScore
  };
}

module.exports = {
  analyzeText,
  extractUrls,
  RULE_DEFINITIONS
};
