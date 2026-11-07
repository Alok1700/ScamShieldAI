import React from 'react';
import { Shield, Lock, Cpu, Eye, ExternalLink, CheckCircle, QrCode } from 'lucide-react';
import { useScanStore } from '../store/scanStore';
import { t } from '../utils/i18n';

export default function AboutPage() {
  const { language } = useScanStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-wider text-cyan-accent font-semibold">
          {t('about.badge', language)}
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-text-primary mt-1">
          {t('about.title', language)}
        </h1>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          {t('about.subtitle', language)}
        </p>
      </div>

      {/* Mission & Problem Statement */}
      <div className="p-6 sm:p-8 rounded-2xl bg-card-bg border border-card-border shadow-cyber space-y-4">
        <h2 className="text-xl font-bold text-text-primary">
          {t('about.missionTitle', language)}
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          {t('about.missionP1', language)}
        </p>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          {t('about.missionP2', language)}
        </p>
      </div>

      {/* Privacy-by-Design Architecture */}
      <div className="p-6 sm:p-8 rounded-2xl bg-secondary-bg/80 border border-card-border space-y-4">
        <div className="flex items-center gap-2.5">
          <Lock className="w-5 h-5 text-success" />
          <h2 className="text-xl font-bold text-text-primary">
            {t('about.privacyTitle', language)}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-secondary leading-relaxed pt-2">
          <div className="p-4 rounded-xl bg-card-bg border border-card-border space-y-1.5">
            <h4 className="font-semibold text-text-primary">{t('about.priv1Title', language)}</h4>
            <p>{t('about.priv1Desc', language)}</p>
          </div>
          <div className="p-4 rounded-xl bg-card-bg border border-card-border space-y-1.5">
            <h4 className="font-semibold text-text-primary">{t('about.priv2Title', language)}</h4>
            <p>{t('about.priv2Desc', language)}</p>
          </div>
          <div className="p-4 rounded-xl bg-card-bg border border-card-border space-y-1.5">
            <h4 className="font-semibold text-text-primary">{t('about.priv3Title', language)}</h4>
            <p>{t('about.priv3Desc', language)}</p>
          </div>
          <div className="p-4 rounded-xl bg-card-bg border border-card-border space-y-1.5">
            <h4 className="font-semibold text-text-primary">{t('about.priv4Title', language)}</h4>
            <p>{t('about.priv4Desc', language)}</p>
          </div>
        </div>
      </div>

      {/* Technical Stack */}
      <div className="p-6 sm:p-8 rounded-2xl bg-card-bg border border-card-border shadow-cyber space-y-4">
        <h2 className="text-xl font-bold text-text-primary">
          {t('about.techStackTitle', language)}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-secondary-bg border border-card-border">
            <span className="text-text-secondary block text-[10px]">FRONTEND</span>
            <strong className="text-text-primary">React 19 + Vite</strong>
            <p className="text-[10px] text-cyan-accent mt-0.5">Tailwind CSS + Zustand</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary-bg border border-card-border">
            <span className="text-text-secondary block text-[10px]">BACKEND API</span>
            <strong className="text-text-primary">Node.js + Express</strong>
            <p className="text-[10px] text-cyan-accent mt-0.5">Helmet + Zod + Pino</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary-bg border border-card-border">
            <span className="text-text-secondary block text-[10px]">EXPLAINABLE AI</span>
            <strong className="text-text-primary">Gemini 1.5 Flash</strong>
            <p className="text-[10px] text-cyan-accent mt-0.5">Multi-Perspective Reasoning</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary-bg border border-card-border">
            <span className="text-text-secondary block text-[10px]">VISION / DECODING</span>
            <strong className="text-text-primary">Tesseract.js + jsQR</strong>
            <p className="text-[10px] text-cyan-accent mt-0.5">In-Memory Buffers</p>
          </div>
        </div>

        {/* Dedicated ML Model Benchmarks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-secondary-bg/60 border border-card-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-cyan-accent font-semibold text-xs flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                {t('about.smsModelTitle', language)}
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent text-[10px] font-mono">
                5,572 Records
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1">
              <div>Accuracy: <strong className="text-success block">98.9%</strong></div>
              <div>Precision: <strong className="text-success block">98.0%</strong></div>
              <div>ROC-AUC: <strong className="text-success block">99.6%</strong></div>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed pt-1">
              {t('about.smsModelDesc', language)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-secondary-bg/60 border border-card-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-cyan-accent font-semibold text-xs flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                {t('about.urlModelTitle', language)}
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent text-[10px] font-mono">
                11,424 Records
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1">
              <div>Precision: <strong className="text-success block">99.8%</strong></div>
              <div>Recall: <strong className="text-success block">99.9%</strong></div>
              <div>Latency: <strong className="text-cyan-accent block">0.22ms</strong></div>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed pt-1">
              {t('about.urlModelDesc', language)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-secondary-bg/60 border border-card-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-cyan-accent font-semibold text-xs flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" />
                {t('about.qrModelTitle', language)}
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent text-[10px] font-mono">
                10,000 Records
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1">
              <div>Accuracy: <strong className="text-success block">99.7%</strong></div>
              <div>Precision: <strong className="text-success block">99.5%</strong></div>
              <div>ROC-AUC: <strong className="text-success block">99.99%</strong></div>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed pt-1">
              {t('about.qrModelDesc', language)}
            </p>
          </div>
        </div>
      </div>

      {/* Reporting & Legal Compliance */}
      <div className="p-5 rounded-xl bg-card-bg border border-card-border flex items-center justify-between flex-wrap gap-4 text-xs text-text-secondary">
        <div>
          <span className="font-semibold text-text-primary block">Official Indian Cybercrime Coordination Centre (I4C)</span>
          <span>National Reporting Portal: <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer" className="text-cyan-accent underline">cybercrime.gov.in</a> • National Helpline: <strong className="text-danger">1930</strong></span>
        </div>
        <div className="text-right font-mono text-[11px]">
          Open Source Security Initiative
        </div>
      </div>
    </div>
  );
}
