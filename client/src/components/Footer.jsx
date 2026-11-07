import React from 'react';
import { Shield, ExternalLink, PhoneCall, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScanStore } from '../store/scanStore';
import { t } from '../utils/i18n';

export default function Footer() {
  const { language } = useScanStore();

  const vectorsData = {
    en: [
      '• Bank KYC & PAN Phishing',
      '• UPI Reverse Payment Fraud',
      '• Electricity Cutoff SMS',
      '• Telegram Video Task Scams',
      '• Fake Courier Redirection',
      '• Malicious Sideloaded APKs'
    ],
    hi: [
      '• बैंक KYC व पैन फ़िशिंग',
      '• UPI रिवर्स पेमेंट धोखाधड़ी',
      '• बिजली बिल काटने का SMS',
      '• टेलीग्राम यूट्यूब टास्क घोटाला',
      '• फर्जी कूरियर पार्सल जाल',
      '• दुर्भावनापूर्ण एंड्रॉइड APK'
    ]
  };

  const vectors = vectorsData[language] || vectorsData.en;

  return (
    <footer className="mt-20 border-t border-card-border bg-secondary-bg/60">
      {/* India Cyber Emergency Banner */}
      <div className="bg-gradient-to-r from-danger/20 via-primary/20 to-cyan-accent/20 border-b border-card-border py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-text-primary">
            <span className="p-1 rounded-md bg-danger text-white">
              <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            </span>
            <span className="font-semibold text-danger">{t('footer.helplineTitle', language)}</span>
            <span>{t('footer.helplineDesc', language)}</span>
          </div>
          <a
            href="https://cybercrime.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-cyan-accent hover:underline font-medium"
          >
            <span>{t('footer.officialPortal', language)}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-cyan-accent">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-lg text-text-primary">ScamShield<span className="text-cyan-accent">.AI</span></span>
            </div>
            <p className="text-text-secondary text-sm max-w-md mb-4 leading-relaxed">
              {t('footer.tagline', language)}
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2 py-1 rounded bg-card-bg border border-card-border text-cyan-accent">
                {language === 'hi' ? 'एआई-संचालित साइबर सुरक्षा' : 'AI-Powered Cybersecurity'}
              </span>
              <span className="px-2 py-1 rounded bg-card-bg border border-card-border text-primary-light">
                {language === 'hi' ? 'वास्तविक समय खतरा पहचान' : 'Real-Time Threat Detection'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-text-primary text-sm mb-3">{t('footer.platform', language)}</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/scanner" className="hover:text-cyan-accent transition-colors">{t('footer.scannerLink', language)}</Link></li>
              <li><Link to="/awareness" className="hover:text-cyan-accent transition-colors">{t('footer.awarenessLink', language)}</Link></li>
              <li><Link to="/about" className="hover:text-cyan-accent transition-colors">{t('footer.aboutLink', language)}</Link></li>
            </ul>
          </div>

          {/* Supported Scams */}
          <div>
            <h4 className="font-semibold text-text-primary text-sm mb-3">{t('footer.vectors', language)}</h4>
            <ul className="space-y-1.5 text-xs text-text-secondary font-mono">
              {vectors.map((vec, idx) => (
                <li key={idx}>{vec}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Responsible AI Disclaimer */}
        <div className="border-t border-card-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <div className="flex items-start gap-2 max-w-3xl">
            <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <p>
              <strong>{t('footer.disclaimerTitle', language)}</strong> {t('footer.disclaimer', language)}
            </p>
          </div>
          <div className="text-right shrink-0">
            &copy; {new Date().getFullYear()} {t('footer.rights', language)}
          </div>
        </div>
      </div>
    </footer>
  );
}
