// Dynamic Multilingual Report Localizer for ScamShield AI

export const THREAT_LABELS = {
  bank_fraud_urgency: {
    en: 'Banking Phishing & Urgency Trap',
    hi: 'बैंक फ़िशिंग और आपातकालीन खाता ब्लॉक धोखाधड़ी'
  },
  upi_pin_fraud: {
    en: 'UPI Reverse Payment / PIN Trap',
    hi: 'UPI रिवर्स पेमेंट / पिन धोखाधड़ी'
  },
  electricity_bill_cutoff: {
    en: 'Electricity Bill Disconnection Fraud',
    hi: 'बिजली कनेक्शन काटने की धोखाधड़ी'
  },
  telegram_task_scam: {
    en: 'Telegram Part-Time Task Job Fraud',
    hi: 'टेलीग्राम पार्ट-टाइम जॉब व टास्क धोखाधड़ी'
  },
  lottery_advance_fee: {
    en: 'Lottery / Prize Advance Fee Scam',
    hi: 'लॉटरी / इनाम अग्रिम शुल्क धोखाधड़ी'
  },
  courier_redirection: {
    en: 'Fake Courier Parcel Redirection',
    hi: 'फर्जी कूरियर पार्सल रीडायरेक्शन धोखाधड़ी'
  },
  apk_malware: {
    en: 'Malicious Android APK Distribution',
    hi: 'दुर्भावनापूर्ण एंड्रॉइड APK मैलवेयर वितरण'
  },
  malicious_url_infrastructure: {
    en: 'Deceptive Malicious URL Infrastructure',
    hi: 'धोखाधड़ी वाली फर्जी वेबसाइट लिंक व इन्फ्रास्ट्रक्चर'
  },
  qr_phishing_quishing: {
    en: 'Quishing (QR Phishing) & Botnet Dropper',
    hi: 'क्विशिंग (QR कोड फ़िशिंग) और बॉटनेट मैलवेयर जाल'
  },
  low_risk_legitimate: {
    en: 'Benign Communication (Low Risk)',
    hi: 'सुरक्षित संदेश (न्यूनतम जोखिम)'
  }
};

export const RISK_LEVEL_LABELS = {
  critical: {
    en: 'Critical Risk Threat',
    hi: 'अत्यंत गंभीर जोखिम (खतरा)'
  },
  high: {
    en: 'High Risk (Danger)',
    hi: 'उच्च जोखिम (खतरा)'
  },
  elevated: {
    en: 'Elevated Risk (Caution)',
    hi: 'मध्यम-उच्च जोखिम (सावधानी)'
  },
  caution: {
    en: 'Caution Advised',
    hi: 'सावधानी बरतें'
  },
  inconclusive: {
    en: 'Inconclusive Evidence',
    hi: 'अस्पष्ट साक्ष्य'
  },
  low: {
    en: 'Low Detected Risk',
    hi: 'न्यूनतम जोखिम (सामान्य)'
  }
};

const COMMON_RECOMMENDATIONS = {
  hi: [
    'किसी भी अनजान लिंक पर क्लिक न करें और न ही अपनी व्यक्तिगत या बैंकिंग जानकारी साझा करें।',
    'अपना बैंक OTP, पासवर्ड या UPI पिन किसी के साथ भी कभी साझा न करें।',
    'संदेश भेजने वाले को तुरंत ब्लॉक करें और स्पैम के रूप में रिपोर्ट करें।',
    'वित्तीय धोखाधड़ी की स्थिति में तुरंत राष्ट्रीय साइबर हेल्पलाइन 1930 पर कॉल करें या cybercrime.gov.in पर शिकायत दर्ज करें।'
  ],
  en: [
    'Do not click any embedded links or disclose banking credentials.',
    'Never share your OTP, netbanking passwords, or UPI PIN under any circumstances.',
    'Block the sender and report the communication as spam on your device.',
    'In case of cyber financial fraud in India, immediately call 1930 or lodge an official report at cybercrime.gov.in.'
  ]
};

export const AI_SOLUTIONS = {
  upi_payment_fraud: {
    en: {
      title: 'AI Solution: UPI Fraud Defense & Recovery',
      immediateVerdict: 'Decline collect request immediately. UPI PIN is exclusively used to debit money, never to receive refunds.',
      steps: [
        { step: 1, title: 'Decline Collect Request', action: 'Open PhonePe, Google Pay, or Paytm and decline any pending collect request.' },
        { step: 2, title: 'Block & Report Fraudulent VPA', action: 'Report the sender’s UPI handle/VPA as fraud and block them inside your UPI app.' },
        { step: 3, title: 'Emergency Fund Freeze (Dial 1930)', action: 'If money was debited, call 1930 immediately within the 2-hour Golden Window to freeze beneficiary accounts.' }
      ]
    },
    hi: {
      title: 'एआई समाधान: UPI धोखाधड़ी से बचाव',
      immediateVerdict: 'तुरंत पेमेंट अनुरोध अस्वीकार करें। पैसे प्राप्त करने के लिए कभी UPI पिन नहीं डालना होता।',
      steps: [
        { step: 1, title: 'पेमेंट अनुरोध अस्वीकार करें', action: 'PhonePe, Google Pay या Paytm में जाकर पेंडिंग कलेक्ट रिक्वेस्ट को Decline करें।' },
        { step: 2, title: 'धोखेबाज की UPI आईडी ब्लॉक करें', action: 'अपने UPI ऐप में जाकर उस VPA / नंबर को Fraud के रूप में रिपोर्ट और ब्लॉक करें।' },
        { step: 3, title: 'पैसे कटने पर तुरंत 1930 डायल करें', action: 'यदि पैसे कट गए हैं, तो तुरंत 1930 पर कॉल करें ताकि इंटर-बैंक फंड ट्रांसफर को रोका जा सके।' }
      ]
    }
  },
  utility_disconnection_scam: {
    en: {
      title: 'AI Solution: Utility Disconnection Defense',
      immediateVerdict: 'Do not call the mobile number in the SMS. Do not download AnyDesk or APK files.',
      steps: [
        { step: 1, title: 'Ignore Unverified Mobile Number', action: 'State electricity discoms never issue 10-digit mobile numbers for disconnections.' },
        { step: 2, title: 'Reject Remote Desktop Apps', action: 'Never install AnyDesk or QuickSupport under instructions from callers claiming to be power officials.' },
        { step: 3, title: 'Verify in Official Discom App', action: 'Check bill dues directly on your electricity board’s official portal or monthly paper bill.' }
      ]
    },
    hi: {
      title: 'एआई समाधान: बिजली बिल फर्जीवाड़े से बचाव',
      immediateVerdict: 'संदेश में दिए गए मोबाइल नंबर पर बिल्कुल कॉल न करें और कोई ऐप इंस्टॉल न करें।',
      steps: [
        { step: 1, title: 'दिए गए नंबर पर कॉल न करें', action: 'बिजली कंपनियां कभी भी 10-अंकों के व्यक्तिगत मोबाइल नंबर से बिजली काटने की धमकी नहीं भेजतीं।' },
        { step: 2, title: 'रिमोट डेस्कटॉप ऐप से बचें', action: 'AnyDesk, TeamViewer या QuickSupport कभी इंस्टॉल न करें, ये आपके फोन का नियंत्रण चुरा लेते हैं।' },
        { step: 3, title: 'आधिकारिक ऐप में बिल देखें', action: 'अपने राज्य विद्युत बोर्ड के आधिकारिक पोर्टल या बिजली बिल से ही अपने भुगतान की स्थिति जांचें।' }
      ]
    }
  },
  qr_phishing_quishing: {
    en: {
      title: 'AI Solution: Quishing & Malicious QR Defense',
      immediateVerdict: 'Do not scan this QR code or navigate to its decoded payload.',
      steps: [
        { step: 1, title: 'Purge Downloaded Payloads', action: 'If a file (.apk, .exe, .sh) was downloaded, delete it immediately without opening it.' },
        { step: 2, title: 'Run Device Security Scan', action: 'Run Google Play Protect or a trusted mobile antivirus scan to inspect installed packages.' },
        { step: 3, title: 'Reset Netbanking Passwords', action: 'If you submitted any passwords or card details on the destination page, change them immediately.' }
      ]
    },
    hi: {
      title: 'एआई समाधान: क्विशिंग (QR कोड खतरे) से बचाव',
      immediateVerdict: 'इस QR कोड को स्कैन न करें और न ही इसके लिंक से कोई फाइल डाउनलोड करें।',
      steps: [
        { step: 1, title: 'डाउनलोड की गई फाइल हटाएं', action: 'यदि कोई फाइल (.apk, .exe, .sh) डाउनलोड हुई है, तो उसे खोले बिना तुरंत डिलीट करें।' },
        { step: 2, title: 'डिवाइस एंटीवायरस स्कैन चलाएं', action: 'अपने मोबाइल पर प्ले प्रोटेक्ट (Play Protect) या एंटीवायरस स्कैनर से संपूर्ण स्कैन करें।' },
        { step: 3, title: 'बैंकिंग क्रेडेंशियल रीसेट करें', action: 'यदि आपने किसी फॉर्म में पासवर्ड या कार्ड विवरण भरा था, तो तुरंत पासवर्ड बदलें।' }
      ]
    }
  },
  law_enforcement_impersonation: {
    en: {
      title: 'AI Solution: Digital Arrest Impersonation Defense',
      immediateVerdict: 'Disconnect the call immediately. Indian law enforcement agencies NEVER conduct arrests or court hearings over Skype or WhatsApp video.',
      steps: [
        { step: 1, title: 'Terminate Video/Voice Call', action: 'Hang up immediately on anyone claiming to be CBI, Mumbai Police, ED, or Customs on a video call.' },
        { step: 2, title: 'Do Not Transfer "Verification Funds"', action: 'Law enforcement agencies never ask citizens to deposit funds into secret or clearance accounts.' },
        { step: 3, title: 'Report Coercion to 1930', action: 'Report the blackmail and extortion attempt immediately to National Cyber Crime Helpline 1930.' }
      ]
    },
    hi: {
      title: 'एआई समाधान: डिजिटल अरेस्ट व पुलिस जालसाजी से बचाव',
      immediateVerdict: 'कॉल तुरंत काट दें। भारत में कानूनन कोई भी डिजिटल अरेस्ट (स्काइप/व्हाट्सएप वीडियो पर गिरफ्तारी) नहीं होता।',
      steps: [
        { step: 1, title: 'कॉल काटें और नंबर ब्लॉक करें', action: 'सीबीआई, कस्टम या पुलिस का रूप धारण करने वाले जालसाज का कॉल तुरंत डिस्कनेक्ट करें।' },
        { step: 2, title: 'कोई भी पैसा ट्रांसफर न करें', action: 'सरकारी एजेंसियां जांच के नाम पर कभी किसी गुप्त या व्यक्तिगत खाते में पैसे ट्रांसफर करने को नहीं कहतीं।' },
        { step: 3, title: 'स्थानीय थाने या 1930 पर सूचित करें', action: 'मानसिक दबाव व वसूली की धमकी की शिकायत तत्काल साइबर हेल्पलाइन 1930 पर दर्ज कराएं।' }
      ]
    }
  },
  benign: {
    en: {
      title: 'AI Safety Assessment & Best Practices',
      immediateVerdict: 'Content appears benign; no immediate threat detected.',
      steps: [
        { step: 1, title: 'Maintain Standard Caution', action: 'Legitimate bank alerts are informational only. They never demand OTPs or passwords.' },
        { step: 2, title: 'In-App Verification', action: 'Check transaction balances directly inside your verified banking application.' }
      ]
    },
    hi: {
      title: 'एआई सुरक्षा सलाह (AI Security Guidance)',
      immediateVerdict: 'संदेश सुरक्षित प्रतीत होता है, किसी तात्कालिक कदम की आवश्यकता नहीं है।',
      steps: [
        { step: 1, title: 'सतर्क डिजिटल व्यवहार', action: 'प्रामाणिक बैंक सूचनाएं केवल जानकारी देती हैं, कभी फोन या लिंक पर पासवर्ड या पिन नहीं मांगतीं।' },
        { step: 2, title: 'स्वतंत्र ऐप से पुष्टि', action: 'यदि लेन-देन की पुष्टि करनी हो, तो सीधे अपने आधिकारिक बैंकिंग ऐप में लॉगिन करके बैलेंस जांचें।' }
      ]
    }
  },
  default_phish: {
    en: {
      title: 'AI Solution: Phishing Containment & Response',
      immediateVerdict: 'Do not click the link, do not enter OTPs/passwords, and block the sender immediately.',
      steps: [
        { step: 1, title: 'Isolate & Block Sender', action: 'Mark the message as phishing/spam and block the sender on SMS, WhatsApp, or Email.' },
        { step: 2, title: 'Freeze Cards & Netbanking', action: 'If credentials were submitted, freeze cards and netbanking via your official banking app immediately.' },
        { step: 3, title: 'Contact Official Bank Helpline', action: 'Call the official customer care number printed on the back of your physical bank debit card.' },
        { step: 4, title: 'National Cyber Fraud Helpline 1930', action: 'In case of unauthorized debit, dial 1930 immediately to freeze funds in transit and report on cybercrime.gov.in.' }
      ]
    },
    hi: {
      title: 'एआई समाधान: त्वरित सुरक्षा कार्ययोजना',
      immediateVerdict: 'इस लिंक पर क्लिक न करें, कोई जानकारी न भरें और तुरंत प्रेषक को ब्लॉक करें।',
      steps: [
        { step: 1, title: 'लिंक व प्रेषक को ब्लॉक करें', action: 'संदेश को स्पैम चिह्नित करें और प्रेषक को व्हाट्सएप या एसएमएस पर ब्लॉक करें।' },
        { step: 2, title: 'खाता व कार्ड सुरक्षा (यदि विवरण दर्ज किए हों)', action: 'यदि क्रेडेंशियल दर्ज कर दिए हैं, तो तुरंत अपने बैंक ऐप से कार्ड ब्लॉक करें और पासवर्ड बदलें।' },
        { step: 3, title: 'आधिकारिक बैंक हेल्पलाइन से संपर्क', action: 'केवल अपने डेबिट कार्ड के पीछे छपे फोन नंबर पर कॉल करके घटना की जानकारी दें।' },
        { step: 4, title: 'राष्ट्रीय साइबर हेल्पलाइन 1930', action: 'वित्तीय नुकसान होने पर त्वरित सहायता के लिए 1930 पर कॉल करें और cybercrime.gov.in पर रिपोर्ट दर्ज करें।' }
      ]
    }
  }
};

function resolveAiSolution(report, lang) {
  const backendAiSolution = report.explanation?.aiSolution;
  const isHi = lang === 'hi';

  // If backend provided solution in the target language (contains Devanagari for Hindi, or does not for English)
  if (backendAiSolution && backendAiSolution.title) {
    const hasHindiChars = /[\u0900-\u097F]/.test(backendAiSolution.title);
    if ((isHi && hasHindiChars) || (!isHi && !hasHindiChars)) {
      return backendAiSolution;
    }
  }

  // Fallback to local dictionary based on threat
  const pt = report.primaryThreat;
  const isLow = report.riskLevel === 'low' || pt === 'benign_communication' || pt === 'low_risk_legitimate';
  const targetLang = isHi ? 'hi' : 'en';

  if (isLow) return AI_SOLUTIONS.benign[targetLang];
  if (pt === 'upi_payment_fraud' || pt === 'upi_pin_fraud') return AI_SOLUTIONS.upi_payment_fraud[targetLang];
  if (pt === 'utility_disconnection_scam' || pt === 'utility_disconnection_threat' || pt === 'electricity_bill_cutoff') return AI_SOLUTIONS.utility_disconnection_scam[targetLang];
  if (pt === 'qr_phishing_quishing') return AI_SOLUTIONS.qr_phishing_quishing[targetLang];
  if (pt === 'law_enforcement_impersonation' || pt === 'digital_arrest_coercion') return AI_SOLUTIONS.law_enforcement_impersonation[targetLang];
  return AI_SOLUTIONS.default_phish[targetLang];
}

/**
 * Localizes a scan report dynamically for the chosen language ('en', 'hi').
 */
export function getLocalizedReport(report, lang = 'en') {
  if (!report) return null;

  const submittedContent = report.submittedContent || report.text || report.extractedText || report.qrDetails?.decodedData || report.urlReports?.[0]?.rawUrl || '';
  const aiSolution = resolveAiSolution(report, lang);

  if (lang === 'en') {
    return {
      ...report,
      displaySubmittedContent: submittedContent,
      displayAiSolution: aiSolution,
      displayThreat: THREAT_LABELS[report.primaryThreat]?.en || report.primaryThreat?.replace(/_/g, ' ') || 'Threat Detected',
      displayRiskLevel: RISK_LEVEL_LABELS[report.riskLevel]?.en || report.riskLevel,
      displaySummary: report.explanation?.summary || report.summary,
      displayWhatIsSuspicious: report.explanation?.whatIsSuspicious || 'Detected indicators matching known deception.',
      displayWhyDangerous: report.explanation?.whyDangerous || 'Attempts to induce unauthorized actions or harvest credentials.',
      displayRecommendedAction: report.explanation?.recommendedAction || 'Do not engage; verify directly on official banking portals.',
      displayRecommendations: report.recommendations?.length ? report.recommendations : COMMON_RECOMMENDATIONS.en
    };
  }

  const threatLabel = THREAT_LABELS[report.primaryThreat]?.[lang] || report.primaryThreat?.replace(/_/g, ' ');
  const riskLabel = RISK_LEVEL_LABELS[report.riskLevel]?.[lang] || report.riskLevel;
  const isHighRisk = report.riskScore >= 60 || report.riskLevel === 'high' || report.riskLevel === 'elevated';

  let summary = '';
  let whatIsSuspicious = '';
  let whyDangerous = '';
  let recommendedAction = '';

  if (lang === 'hi') {
    if (isHighRisk) {
      summary = `यह सामग्री अत्यधिक संदिग्ध पाई गई है (${threatLabel})। इसमें ${report.observedEvidence?.length || report.detectedSignals?.length || 0} जोखिम संकेतक पहचाने गए हैं। AI सुरक्षा विश्लेषण द्वारा इसे उच्च जोखिम श्रेणी में वर्गीकृत किया गया है।`;
      whatIsSuspicious = (report.observedEvidence || report.detectedSignals)?.map(s => s.evidence).filter(Boolean).slice(0, 3).join(', ') || 'संदेहास्पद लिंक, आपातकालीन खाता ब्लॉक की धमकी या व्यक्तिगत जानकारी की मांग।';
      whyDangerous = 'धोखेबाज आपकी संवेदनशील बैंकिंग जानकारी (OTP, पासवर्ड, UPI पिन) चुरा सकते हैं या आपके खाते से अनधिकृत निकासी कर सकते हैं।';
      recommendedAction = 'दिए गए लिंक पर बिल्कुल क्लिक न करें और न ही कोई OTP या UPI पिन दर्ज करें। तुरंत प्रेषक को ब्लॉक करें।';
    } else {
      summary = 'सामग्री में कोई स्पष्ट धोखाधड़ी या फ़िशिंग संकेतक नहीं मिले हैं। हालांकि, डिजिटल सुरक्षा के लिए हमेशा सतर्क रहें।';
      whatIsSuspicious = 'कोई स्पष्ट धोखा या फ़िशिंग संकेत नहीं मिला।';
      whyDangerous = 'संदेश सामान्य प्रतीत होता है, फिर भी किसी अज्ञात स्रोत पर संवेदनशील जानकारी साझा न करें।';
      recommendedAction = 'सतर्क रहें और केवल आधिकारिक बैंकिंग ऐप या आधिकारिक वेबसाइट का ही उपयोग करें।';
    }
  }

  // If the backend already provided a matching localized explanation object in this language, prioritize it if it matches
  if (report.explanation && report.explanation.summary && (
    (lang === 'hi' && /[\u0900-\u097F]/.test(report.explanation.summary))
  )) {
    summary = report.explanation.summary;
    if (report.explanation.whatIsSuspicious) whatIsSuspicious = report.explanation.whatIsSuspicious;
    if (report.explanation.whyDangerous) whyDangerous = report.explanation.whyDangerous;
    if (report.explanation.recommendedAction) recommendedAction = report.explanation.recommendedAction;
  }

  return {
    ...report,
    observedEvidence: report.observedEvidence || report.detectedSignals || [],
    statisticalSignals: report.statisticalSignals || [],
    potentialOutcomes: report.potentialOutcomes || [],
    scoringBreakdown: report.scoringBreakdown || {},
    displaySubmittedContent: submittedContent,
    displayAiSolution: aiSolution,
    displayThreat: threatLabel,
    displayRiskLevel: riskLabel,
    displaySummary: summary,
    displayWhatIsSuspicious: whatIsSuspicious,
    displayWhyDangerous: whyDangerous,
    displayRecommendedAction: recommendedAction,
    displayRecommendations: COMMON_RECOMMENDATIONS[lang] || COMMON_RECOMMENDATIONS.en
  };
}
