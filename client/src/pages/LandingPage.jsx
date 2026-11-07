import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ShieldAlert, Cpu, QrCode, FileText, Globe, CheckCircle, ArrowRight, Lock, Eye, AlertTriangle, Sparkles } from 'lucide-react';
import { useScanStore } from '../store/scanStore';
import { t } from '../utils/i18n';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setActiveTab, language } = useScanStore();

  const handleDemoPreset = (tab, text) => {
    setActiveTab(tab);
    navigate('/scanner', { state: { presetText: text, presetTab: tab } });
  };

  const demoScenariosData = {
    en: [
      {
        title: 'Banking KYC Phishing',
        category: 'High Risk Phish',
        type: 'message',
        snippet: 'Dear customer, your SBI account is temporarily suspended. Submit OTP and PAN immediately at https://sbi-kyc-security.example',
        badge: 'Red Flag: High Risk'
      },
      {
        title: 'Electricity Cutoff SMS',
        category: 'Utility Scam',
        type: 'message',
        snippet: 'Electricity power disconnection alert tonight at 9:30 PM due to unpaid bill. Call officer at 9876543210 immediately.',
        badge: 'Red Flag: Impersonation'
      },
      {
        title: 'UPI "PIN to Receive" Trap',
        category: 'UPI Fraud',
        type: 'message',
        snippet: 'You won Rs 5,000 PhonePe cashback. Scan QR code and enter UPI PIN to claim money directly to bank.',
        badge: 'Red Flag: UPI Trap'
      },
      {
        title: 'Authentic Bank Alert',
        category: 'Legitimate Notice',
        type: 'message',
        snippet: 'INR 5,000.00 credited to your A/C XX1234 on 05-Nov-2026 by NEFT. Available balance is INR 28,450.50. - SBI',
        badge: 'Safe: Low Indicators'
      }
    ],
    hi: [
      {
        title: 'बैंक KYC फ़िशिंग जाल',
        category: 'उच्च जोखिम फ़िशिंग',
        type: 'message',
        snippet: 'प्रिय ग्राहक, आपका SBI खाता अस्थायी रूप से निलंबित कर दिया गया है। तुरंत https://sbi-kyc-security.example पर जाकर OTP और पैन दर्ज करें।',
        badge: 'चेतावनी: उच्च जोखिम'
      },
      {
        title: 'बिजली कनेक्शन काटने का SMS',
        category: 'उपयोगिता धोखाधड़ी',
        type: 'message',
        snippet: 'बिल का भुगतान न होने के कारण आज रात 9:30 बजे आपकी बिजली काट दी जाएगी। तुरंत हमारे बिजली अधिकारी से 9876543210 पर संपर्क करें।',
        badge: 'चेतावनी: फर्जी पहचान'
      },
      {
        title: 'UPI "पिन से पैसे पाएं" का जाल',
        category: 'UPI धोखाधड़ी',
        type: 'message',
        snippet: 'आपने 5,000 रुपये का PhonePe कैशबैक जीता है। पैसे सीधे बैंक में पाने के लिए यह QR कोड स्कैन करें और अपना UPI पिन डालें।',
        badge: 'चेतावनी: UPI रिवर्स जाल'
      },
      {
        title: 'प्रामाणिक बैंक सूचना',
        category: 'सुरक्षित संदेश',
        type: 'message',
        snippet: 'INR 5,000.00 आपके खाते XX1234 में NEFT द्वारा 05-Nov-2026 को जमा किए गए। उपलब्ध शेष राशि INR 28,450.50 है। - SBI',
        badge: 'सुरक्षित: न्यूनतम जोखिम'
      }
    ]
  };

  const demoScenarios = demoScenariosData[language] || demoScenariosData.en;

  const featuresData = {
    en: [
      {
        icon: FileText,
        title: 'AI Message & Phishing Scanner',
        desc: 'Evaluates messages from WhatsApp, SMS, Telegram, and Email for urgency, threats, and credential theft in English and Hindi.'
      },
      {
        icon: Globe,
        title: 'Lexical URL & Domain Inspector',
        desc: 'Detects brand impersonation, Punycode IDNs, IP hosts, and deceptive lookalikes without ever visiting or triggering untrusted servers.'
      },
      {
        icon: Eye,
        title: 'Screenshot OCR Extraction',
        desc: 'Upload screenshots of suspicious chats or notifications. Extracts text and links in-memory without permanently storing raw images.'
      },
      {
        icon: QrCode,
        title: 'QR Code & UPI Protocol Analyzer',
        desc: 'Decodes QR destinations and parses UPI pay requests. Warns users that entering a UPI PIN debits money, never receives refunds.'
      },
      {
        icon: Cpu,
        title: 'Explainable Scam Kill-Chain',
        desc: 'Maps the attack timeline from Impersonation to Urgency and Credential demands, clearly separating observed facts from potential outcomes.'
      },
      {
        icon: Sparkles,
        title: 'Triple Machine Learning Engines',
        desc: 'Combines calibrated SMS threat models (98.9%), lexical URL classifiers (99.9%), and QR payload models (99.7%) for fast, zero-day threat detection.'
      }
    ],
    hi: [
      {
        icon: FileText,
        title: 'एआई संदेश व फ़िशिंग स्कैनर',
        desc: 'व्हाट्सएप, एसएमएस, टेलीग्राम और ईमेल संदेशों में तात्कालिकता, धमकी और डेटा चोरी के प्रयासों का हिंदी और अंग्रेजी में मूल्यांकन करता है।'
      },
      {
        icon: Globe,
        title: 'वेबसाइट लिंक व डोमेन विश्लेषक',
        desc: 'बिना किसी असुरक्षित लिंक को खोले ब्रांड स्पूफिंग, प्यूनिकोड, आईपी होस्ट और फर्जी लुकअलाइक डोमेन की संरचनात्मक पहचान करता है।'
      },
      {
        icon: Eye,
        title: 'स्क्रीनशॉट OCR निष्कर्षण',
        desc: 'संदिग्ध चैट या नोटिफिकेशन के स्क्रीनशॉट अपलोड करें। किसी भी छवि को स्थायी रूप से सेव किए बिना सुरक्षित मेमोरी में टेक्स्ट निकालता है।'
      },
      {
        icon: QrCode,
        title: 'QR कोड व UPI प्रोटोकॉल विश्लेषक',
        desc: 'QR कोड के पेलोड और UPI पेमेंट अनुरोधों को डिकोड करता है। चेतावनी देता है कि UPI पिन दर्ज करने से केवल पैसे कटते हैं, मिलते नहीं।'
      },
      {
        icon: Cpu,
        title: 'धोखाधड़ी किल-चेन पुनर्निर्माण',
        desc: 'हमले की प्रगति को फर्जी पहचान से लेकर धमकी और डेटा मांग तक मैप करता है, जिसमें प्रत्यक्ष साक्ष्य और संभावित खतरे स्पष्ट होते हैं।'
      },
      {
        icon: Sparkles,
        title: 'त्रि-स्तरीय मशीन लर्निंग सुरक्षा इंजन',
        desc: 'कैलिब्रेटेड एसएमएस मॉडल (98.9%), यूआरएल क्लासिफ़ायर (99.9%) और QR पेलोड थ्रेट मॉडल (99.7%) के साथ शून्य-दिन के खतरों की तुरंत पहचान करता है।'
      }
    ]
  };

  const features = featuresData[language] || featuresData.en;

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-accent/15 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        {/* Badges */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card-bg border border-card-border mb-6 text-xs text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-cyan-accent animate-ping"></span>
          <span className="text-text-primary font-medium">{t('landing.heroBadge', language)}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-text-primary tracking-tight max-w-4xl mx-auto leading-tight">
          {t('landing.heroHeadline1', language)} <br />
          <span className="bg-gradient-to-r from-cyan-accent via-primary-light to-primary bg-clip-text text-transparent">
            {t('landing.heroHeadline2', language)}
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          {t('landing.heroSub', language)}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/scanner"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-cyan-accent hover:from-primary-hover hover:to-cyan-accent/90 text-white font-semibold text-base shadow-cyber transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>{t('landing.heroCta', language)}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/awareness"
            className="px-6 py-3.5 rounded-xl bg-card-bg hover:bg-secondary-bg border border-card-border text-text-primary font-medium text-base transition-all hover:border-primary/50 flex items-center gap-2"
          >
            <span>{t('landing.heroExplore', language)}</span>
          </Link>
        </div>

        {/* Privacy Note */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-success" />
            {t('landing.privacy1', language)}
          </span>
          <span>•</span>
          <span>{t('landing.privacy2', language)}</span>
          <span>•</span>
          <span>{t('landing.privacy3', language)}</span>
        </div>
      </section>

      {/* Interactive Demo Presets Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-accent font-semibold">
            {t('landing.demoEyebrow', language)}
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-text-primary mt-1">
            {t('landing.demoTitle', language)}
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            {t('landing.demoSub', language)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {demoScenarios.map((demo, idx) => (
            <div
              key={idx}
              onClick={() => handleDemoPreset(demo.type, demo.snippet)}
              className="p-5 rounded-xl bg-card-bg border border-card-border hover:border-primary/60 cursor-pointer glow-card transition-all flex flex-col justify-between h-full"
            >
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-cyan-accent">{demo.category}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    demo.title.includes('Authentic') || demo.title.includes('प्रामाणिक')
                      ? 'bg-success/20 text-success border border-success/30'
                      : 'bg-danger/20 text-danger border border-danger/30'
                  }`}>
                    {demo.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-text-primary mb-2">{demo.title}</h3>
                <div className="flex-1">
                  <p className="text-xs text-text-secondary italic bg-secondary-bg/50 p-2.5 rounded-lg border border-card-border/40 font-mono break-words leading-relaxed max-h-36 overflow-y-auto">
                    "{demo.snippet}"
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-card-border/60 flex items-center justify-between text-xs text-primary-light font-medium">
                <span>{t('landing.runLive', language)}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Six Primary Capabilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-primary-light font-semibold">
            {t('landing.featuresEyebrow', language)}
          </span>
          <h2 className="text-3xl font-display font-bold text-text-primary mt-1">
            {t('landing.featuresTitle', language)}
          </h2>
          <p className="text-sm text-text-secondary max-w-xl mx-auto mt-2">
            {t('landing.featuresSub', language)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-card-bg border border-card-border hover:border-cyan-accent/40 transition-all glow-card">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-cyan-accent mb-4">
                <feat.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-text-primary mb-2">{feat.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-secondary-bg/80 border border-card-border relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase text-cyan-accent font-semibold">
              {t('landing.archEyebrow', language)}
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-text-primary mt-1">
              {t('landing.archTitle', language)}
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              {t('landing.archSub', language)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-card-bg border border-card-border text-center">
              <span className="text-xs font-mono text-cyan-accent font-bold">STAGE 1</span>
              <h4 className="font-semibold text-text-primary text-sm mt-1">{t('landing.stage1Title', language)}</h4>
              <p className="text-xs text-text-secondary mt-1">{t('landing.stage1Desc', language)}</p>
            </div>
            <div className="p-4 rounded-xl bg-card-bg border border-card-border text-center">
              <span className="text-xs font-mono text-cyan-accent font-bold">STAGE 2</span>
              <h4 className="font-semibold text-text-primary text-sm mt-1">{t('landing.stage2Title', language)}</h4>
              <p className="text-xs text-text-secondary mt-1">{t('landing.stage2Desc', language)}</p>
            </div>
            <div className="p-4 rounded-xl bg-card-bg border border-card-border text-center">
              <span className="text-xs font-mono text-cyan-accent font-bold">STAGE 3</span>
              <h4 className="font-semibold text-text-primary text-sm mt-1">{t('landing.stage3Title', language)}</h4>
              <p className="text-xs text-text-secondary mt-1">{t('landing.stage3Desc', language)}</p>
            </div>
            <div className="p-4 rounded-xl bg-card-bg border border-card-border text-center">
              <span className="text-xs font-mono text-cyan-accent font-bold">STAGE 4</span>
              <h4 className="font-semibold text-text-primary text-sm mt-1">{t('landing.stage4Title', language)}</h4>
              <p className="text-xs text-text-secondary mt-1">{t('landing.stage4Desc', language)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
            {t('landing.faqTitle', language)}
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            {t('landing.faqSub', language)}
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-card-bg border border-card-border">
            <h4 className="font-semibold text-sm text-text-primary">{t('landing.faq1Q', language)}</h4>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
              {t('landing.faq1A', language)}
            </p>
          </div>
          <div className="p-5 rounded-xl bg-card-bg border border-card-border">
            <h4 className="font-semibold text-sm text-text-primary">{t('landing.faq2Q', language)}</h4>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
              {t('landing.faq2A', language)}
            </p>
          </div>
          <div className="p-5 rounded-xl bg-card-bg border border-card-border">
            <h4 className="font-semibold text-sm text-text-primary">{t('landing.faq3Q', language)}</h4>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
              {t('landing.faq3A', language)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
