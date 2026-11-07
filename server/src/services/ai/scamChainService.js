/**
 * Scam Kill-Chain Reconstruction Engine for ScamShield AI.
 * 
 * Reconstructs the 5-stage cyber fraud attack kill chain:
 * 1. Impersonation (Brand / Authority / Recruiter / Discom / Courier)
 * 2. Urgency & Psychological Pressure (Fear, Artificial Deadlines, Monetary Bait)
 * 3. Attack Vector & Redirection (Link, Telephony Callback, Shortcode, UPI QR, Malware APK)
 * 4. Exploitation & Solicitation (Credentials, OTP, Reverse-Payment PIN, Processing Fee, APK Sideloading)
 * 5. Impact & Compromise (Potential Financial Loss, Account Takeover, Device Takeover)
 * 
 * Strictly distinguishes OBSERVED evidence from POTENTIAL OUTCOMES.
 */

function buildScamChain(signals = [], urls = [], upiDetails = null) {
  const safeSignals = Array.isArray(signals) ? signals : [];
  const safeUrls = Array.isArray(urls) ? urls : [];
  const signalTypes = new Set(safeSignals.map(s => s.type));

  // ==========================================
  // STAGE 1: IMPERSONATION (Brand / Authority)
  // ==========================================
  let stage1 = {
    id: 'stage_1_impersonation',
    stage: '1. Impersonation',
    status: 'not_detected',
    evidence: null,
    evidenceSpan: null,
    detail: 'No overt brand or authority impersonation identified in the submitted content.'
  };

  const impersonationSig = safeSignals.find(s => 
    s.type === 'brand_impersonation' || 
    s.type === 'utility_disconnection_threat' || 
    s.type === 'digital_arrest_coercion' ||
    s.type === 'delivery_redirection_trap' ||
    s.type === 'telegram_task_job_scam' ||
    s.type === 'punycode_domain'
  );

  if (impersonationSig) {
    stage1 = {
      id: 'stage_1_impersonation',
      stage: '1. Impersonation',
      status: 'observed',
      evidence: impersonationSig.evidence,
      evidenceSpan: impersonationSig.span || null,
      detail: `Observed: "${impersonationSig.evidence}" (${impersonationSig.explanation || impersonationSig.description || 'Simulates trusted organization'})`
    };
  }

  // ==========================================
  // STAGE 2: PSYCHOLOGICAL MANIPULATION (Urgency / Fear / Greed)
  // ==========================================
  let stage2 = {
    id: 'stage_2_psychological_manipulation',
    stage: '2. Psychological Manipulation',
    status: 'not_detected',
    evidence: null,
    evidenceSpan: null,
    detail: 'No artificial panic, fear triggers, or coercive deadlines detected.'
  };

  const urgencySig = safeSignals.find(s => 
    s.type === 'urgency_account_suspension' || 
    s.type === 'utility_disconnection_threat' ||
    s.type === 'digital_arrest_coercion' ||
    s.type === 'sms_urgency_trigger'
  );

  const lureSig = safeSignals.find(s => 
    s.type === 'lottery_kbc_reward' || 
    s.type === 'sms_monetary_lure'
  );

  if (urgencySig) {
    stage2 = {
      id: 'stage_2_psychological_manipulation',
      stage: '2. Psychological Manipulation',
      status: 'observed',
      evidence: urgencySig.evidence,
      evidenceSpan: urgencySig.span || null,
      detail: `Observed: "${urgencySig.evidence}" pressures recipient to act hastily without independent verification.`
    };
  } else if (lureSig) {
    stage2 = {
      id: 'stage_2_psychological_manipulation',
      stage: '2. Psychological Manipulation',
      status: 'observed',
      evidence: lureSig.evidence,
      evidenceSpan: lureSig.span || null,
      detail: `Observed: Financial lure ("${lureSig.evidence}") creates artificial excitement to bypass critical scrutiny.`
    };
  }

  // ==========================================
  // STAGE 3: REDIRECTION (Vector / Link / QR / Callback)
  // ==========================================
  let stage3 = {
    id: 'stage_3_redirection',
    stage: '3. Redirection',
    status: 'not_detected',
    evidence: null,
    evidenceSpan: null,
    detail: 'No embedded deceptive links, telephony callback vectors, or QR codes detected.'
  };

  const premiumPhoneSig = safeSignals.find(s => s.type === 'sms_premium_rate_number');
  const shortcodeSig = safeSignals.find(s => s.type === 'sms_shortcode');
  const apkSig = safeSignals.find(s => s.type === 'apk_malware_lure');
  const mlUrlSig = safeSignals.find(s => s.type === 'ml_url_threat_detected');

  if (safeUrls.length > 0) {
    const urlDesc = mlUrlSig ? ' [Classified as Malicious Endpoint by Threat ML Model]' : '';
    stage3 = {
      id: 'stage_3_redirection',
      stage: '3. Redirection',
      status: 'observed',
      evidence: safeUrls[0],
      evidenceSpan: { text: safeUrls[0] },
      detail: `Observed Link: ${safeUrls[0]}${urlDesc}`
    };
  } else if (upiDetails && upiDetails.payeeVpa) {
    stage3 = {
      id: 'stage_3_redirection',
      stage: '3. Redirection',
      status: 'observed',
      evidence: upiDetails.payeeVpa,
      evidenceSpan: { text: upiDetails.payeeVpa },
      detail: `Observed UPI QR payload directing payment to: ${upiDetails.payeeVpa} (${upiDetails.payeeName || 'Unverified Payee'})`
    };
  } else if (premiumPhoneSig) {
    stage3 = {
      id: 'stage_3_redirection',
      stage: '3. Redirection',
      status: 'observed',
      evidence: premiumPhoneSig.evidence,
      evidenceSpan: premiumPhoneSig.span || null,
      detail: `Observed Telephony Vector: Premium-rate callback number "${premiumPhoneSig.evidence}" (incurs expensive per-minute toll tariffs).`
    };
  } else if (shortcodeSig) {
    stage3 = {
      id: 'stage_3_redirection',
      stage: '3. Redirection',
      status: 'observed',
      evidence: shortcodeSig.evidence,
      evidenceSpan: shortcodeSig.span || null,
      detail: `Observed SMS Routing Vector: Directs user to message shortcode "${shortcodeSig.evidence}" (initiates unrequested recurring billing).`
    };
  } else if (apkSig) {
    stage3 = {
      id: 'stage_3_redirection',
      stage: '3. Redirection',
      status: 'observed',
      evidence: apkSig.evidence,
      evidenceSpan: apkSig.span || null,
      detail: `Observed Sideloading Vector: Coerces recipient to download external application/APK ("${apkSig.evidence}").`
    };
  }

  // ==========================================
  // STAGE 4: CREDENTIAL OR PAYMENT REQUEST
  // ==========================================
  let stage4 = {
    id: 'stage_4_credential_payment_request',
    stage: '4. Credential or Payment Request',
    status: 'not_detected',
    evidence: null,
    evidenceSpan: null,
    detail: 'No direct credential, OTP, or payment demands observed in the content.'
  };

  const credSig = safeSignals.find(s => 
    s.type === 'otp_harvesting' || 
    s.type === 'kyc_pan_credential_demand' || 
    s.type === 'upi_pin_receive_trap' ||
    s.type === 'credential_harvesting_path' ||
    s.type === 'lottery_kbc_reward' ||
    s.type === 'sms_monetary_lure' ||
    s.type === 'apk_malware_lure' ||
    s.type === 'delivery_redirection_trap'
  );

  if (credSig) {
    stage4 = {
      id: 'stage_4_credential_payment_request',
      stage: '4. Credential or Payment Request',
      status: 'observed',
      evidence: credSig.evidence,
      evidenceSpan: credSig.span || null,
      detail: `Observed: "${credSig.evidence}" (${credSig.explanation || credSig.description || 'Demands sensitive financial or identity credentials'})`
    };
  } else if (stage3.status === 'observed') {
    stage4 = {
      id: 'stage_4_credential_payment_request',
      stage: '4. Credential or Payment Request',
      status: 'potential_outcome',
      evidence: null,
      evidenceSpan: null,
      detail: 'Potential Outcome: Destination endpoint or callback channel is structured to harvest sensitive passwords, PINs, or identity records.'
    };
  }

  // ==========================================
  // STAGE 5: POTENTIAL FINANCIAL HARM
  // ==========================================
  let stage5 = {
    id: 'stage_5_potential_financial_harm',
    stage: '5. Potential Financial Harm',
    status: 'not_detected',
    evidence: null,
    evidenceSpan: null,
    detail: 'No immediate loss vector identified based on available signals.'
  };

  const hasObservedExploit = stage4.status === 'observed' || stage3.status === 'observed';

  if (hasObservedExploit) {
    if (signalTypes.has('upi_pin_receive_trap') || signalTypes.has('upi_payment_payload')) {
      stage5 = {
        id: 'stage_5_potential_financial_harm',
        stage: '5. Potential Financial Harm',
        status: 'potential_outcome',
        detail: 'High Risk Potential Outcome: Direct unauthorized debits from bank account via user-entered UPI PIN.'
      };
    } else if (signalTypes.has('lottery_kbc_reward') || signalTypes.has('sms_monetary_lure')) {
      stage5 = {
        id: 'stage_5_potential_financial_harm',
        stage: '5. Potential Financial Harm',
        status: 'potential_outcome',
        detail: 'High Risk Potential Outcome: Upfront processing fee theft, advance-fee extortion, or unrecoverable money transfers.'
      };
    } else if (signalTypes.has('sms_premium_rate_number')) {
      stage5 = {
        id: 'stage_5_potential_financial_harm',
        stage: '5. Potential Financial Harm',
        status: 'potential_outcome',
        detail: 'High Risk Potential Outcome: Exorbitant per-minute charges billed directly to telephone account, plus secondary phone social engineering.'
      };
    } else if (signalTypes.has('otp_harvesting') || signalTypes.has('kyc_pan_credential_demand')) {
      stage5 = {
        id: 'stage_5_potential_financial_harm',
        stage: '5. Potential Financial Harm',
        status: 'potential_outcome',
        detail: 'High Risk Potential Outcome: Complete netbanking takeover, unauthorized fund transfers, identity theft, or illicit loan applications.'
      };
    } else if (signalTypes.has('apk_malware_lure')) {
      stage5 = {
        id: 'stage_5_potential_financial_harm',
        stage: '5. Potential Financial Harm',
        status: 'potential_outcome',
        detail: 'High Risk Potential Outcome: Full mobile device telemetry compromise, SMS/OTP interception, and remote keylogging.'
      };
    } else if (signalTypes.has('digital_arrest_coercion')) {
      stage5 = {
        id: 'stage_5_potential_financial_harm',
        stage: '5. Potential Financial Harm',
        status: 'potential_outcome',
        detail: 'Critical Risk Potential Outcome: Psychological extortion and coerced multi-lakh wire transfers into fraudulent "safe custody" accounts.'
      };
    } else {
      stage5 = {
        id: 'stage_5_potential_financial_harm',
        stage: '5. Potential Financial Harm',
        status: 'potential_outcome',
        detail: 'Potential Outcome: Credential compromise, malware infection, or unauthorized data exfiltration upon visiting the unverified target.'
      };
    }
  }

  return [stage1, stage2, stage3, stage4, stage5];
}

module.exports = {
  buildScamChain
};
