import React from 'react';
import { PhoneCall, AlertOctagon, ExternalLink, FileText, X, Lock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useScanStore } from '../store/scanStore';
import { t } from '../utils/i18n';

export default function RecoveryGuidanceModal({ isOpen, onClose }) {
  const { language } = useScanStore();
  if (!isOpen) return null;

  const isHi = language === 'hi';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card-bg border border-danger/40 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-secondary-bg hover:bg-card-border text-text-secondary hover:text-white transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 pr-10">
          <div className="w-12 h-12 rounded-2xl bg-danger/20 border border-danger/40 flex items-center justify-center text-danger shrink-0 mt-0.5">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-danger font-bold px-2 py-0.5 rounded bg-danger/10 border border-danger/20">
              {isHi ? 'आपातकालीन साइबर रिकवरी' : 'Emergency Incident Recovery Plan'}
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-text-primary mt-1">
              {isHi ? 'यदि आपके साथ धोखाधड़ी हुई है तो तुरंत ये कदम उठाएं' : "I've Already Been Scammed — Immediate Action Plan"}
            </h2>
          </div>
        </div>

        {/* 2-Hour Golden Window Alert */}
        <div className="p-4 rounded-xl bg-danger/15 border border-danger/40 space-y-2">
          <div className="flex items-center gap-2 text-danger font-bold text-sm">
            <PhoneCall className="w-4 h-4" />
            <span>{isHi ? 'पहला कदम: तुरंत 1930 डायल करें (गोल्डन ऑवर)' : 'Step 1: Immediately Call 1930 (Golden Window)'}</span>
          </div>
          <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
            {isHi
              ? 'वित्तीय धोखाधड़ी के शुरुआती 2 घंटों के भीतर राष्ट्रीय साइबर हेल्पलाइन 1930 पर कॉल करें। भारतीय साइबर अपराध समन्वय केंद्र (I4C) लाभार्थी बैंक खातों को ब्लॉक करके आपके पैसे को फ्रीज करवा सकता है।'
              : 'Call the National Cyber Financial Fraud Helpline 1930 immediately within the first 2 hours. The Indian Cybercrime Coordination Centre (I4C) coordinates with banks to freeze funds in transit before fraudsters withdraw them.'}
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-3">
            <a
              href="tel:1930"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-danger hover:bg-danger/90 text-white text-xs font-bold font-mono transition-all shadow-cyber"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{isHi ? '1930 पर अभी कॉल करें' : 'DIAL 1930 NOW'}</span>
            </a>
            <a
              href="https://cybercrime.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary-bg hover:bg-card-border border border-card-border text-cyan-accent text-xs font-medium transition-all"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Action Steps */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-text-secondary font-semibold">
            {isHi ? 'चरणबद्ध रिकवरी प्रक्रिया' : 'Step-by-Step Incident Response'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Step A */}
            <div className="p-3.5 rounded-xl bg-secondary-bg/60 border border-card-border space-y-1.5">
              <div className="flex items-center gap-2 text-text-primary font-semibold">
                <Lock className="w-4 h-4 text-cyan-accent" />
                <span>{isHi ? '1. बैंक खाते व कार्ड फ्रीज करें' : '1. Freeze Bank Accounts & Cards'}</span>
              </div>
              <p className="text-text-secondary leading-relaxed">
                {isHi
                  ? 'अपने आधिकारिक बैंक ऐप से तुरंत कार्ड और नेटबैंकिंग को ब्लॉक करें। केवल अपने भौतिक डेबit कार्ड के पीछे छपे आधिकारिक नंबर पर ही कॉल करें।'
                  : 'Block debit/credit cards and netbanking via your official banking app immediately. Call only the verified phone number printed on the back of your physical card.'}
              </p>
            </div>

            {/* Step B */}
            <div className="p-3.5 rounded-xl bg-secondary-bg/60 border border-card-border space-y-1.5">
              <div className="flex items-center gap-2 text-text-primary font-semibold">
                <FileText className="w-4 h-4 text-cyan-accent" />
                <span>{isHi ? '2. साक्ष्य व ट्रांजेक्शन ID सुरक्षित रखें' : '2. Preserve Transaction UTR & Evidence'}</span>
              </div>
              <p className="text-text-secondary leading-relaxed">
                {isHi
                  ? 'धोखाधड़ी वाले SMS, व्हाट्सएप चैट, पेमेंट स्क्रीनशॉट और बैंक UTR/रेफरेंस नंबर को सुरक्षित रखें। किसी भी चैट को डिलीट न करें।'
                  : 'Save all SMS alerts, payment UTR / transaction IDs, chat screenshots, and phone call timestamps. Do not delete message logs.'}
              </p>
            </div>

            {/* Step C */}
            <div className="p-3.5 rounded-xl bg-secondary-bg/60 border border-card-border space-y-1.5">
              <div className="flex items-center gap-2 text-text-primary font-semibold">
                <ShieldCheck className="w-4 h-4 text-cyan-accent" />
                <span>{isHi ? '3. सभी क्रेडेंशियल रीसेट करें' : '3. Change Compromised Credentials'}</span>
              </div>
              <p className="text-text-secondary leading-relaxed">
                {isHi
                  ? 'यदि आपने कोई पासवर्ड या पिन डाला था, तो एक सुरक्षित डिवाइस से तुरंत अपने ईमेल, बैंक और UPI पिन बदलें।'
                  : 'Change your UPI PIN, banking passwords, and email credentials from a secure secondary device if details were disclosed.'}
              </p>
            </div>

            {/* Step D - Anti-Recovery Warning */}
            <div className="p-3.5 rounded-xl bg-warning/10 border border-warning/30 space-y-1.5">
              <div className="flex items-center gap-2 text-warning font-semibold">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span>{isHi ? '4. "मनी रिकवरी" एजेंटों से सावधान' : '4. Beware of "Money Recovery" Scammers'}</span>
              </div>
              <p className="text-text-secondary leading-relaxed">
                {isHi
                  ? 'टेलीग्राम, इंस्टाग्राम या ईमेल पर पैसे वापस दिलाने का दावा करने वाले किसी भी फर्जी वकील या एजेंट को कभी अग्रिम शुल्क न दें।'
                  : 'Never pay fees to online "fund recovery agents" on social media or Telegram. Genuine law enforcement and banks never charge fees to investigate fraud.'}
              </p>
            </div>
          </div>
        </div>

        {/* Realistic Advisory */}
        <div className="p-3.5 rounded-xl bg-secondary-bg/40 border border-card-border/60 text-xs text-text-secondary leading-relaxed">
          <p>
            <strong className="text-text-primary">{isHi ? 'महत्वपूर्ण सूचना: ' : 'Honest Advisory: '}</strong>
            {isHi
              ? 'ScamShield AI एक सुरक्षा विश्लेषण उपकरण है और स्वचालित रिफंड का वादा नहीं करता है। वित्तीय वसूली पूरी तरह से बैंक और कानून प्रवर्तन एजेंसियों द्वारा समय पर की गई कार्रवाई पर निर्भर करती है।'
              : 'ScamShield AI provides defensive cyber analysis and does not guarantee automatic refunds. Successful recovery depends on swift reporting to 1930 and bank beneficiary account freezing.'}
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-all shadow-cyber"
          >
            {isHi ? 'समझ गया, धन्यवाद' : 'I Understand'}
          </button>
        </div>
      </div>
    </div>
  );
}
