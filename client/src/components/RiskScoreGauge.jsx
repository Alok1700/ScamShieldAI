import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, HelpCircle, AlertOctagon, HelpCircle as QuestionIcon } from 'lucide-react';
import { useScanStore } from '../store/scanStore';

export default function RiskScoreGauge({ score = 0, level = 'low', confidence = null, onOpenWhyThisScore = null }) {
  const { language } = useScanStore();
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));

  // Gauge geometry
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let colorClass = '#22C55E'; // green
  let badgeBg = 'bg-success/15 border-success/30 text-success';
  let Icon = ShieldCheck;

  const levelLabels = {
    critical: {
      en: 'Critical Risk Threat',
      hi: 'अत्यंत गंभीर जोखिम (Critical)'
    },
    high: {
      en: 'High Risk Phishing / Fraud',
      hi: 'उच्च जोखिम (धोखाधड़ी / फ़िशिंग)'
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

  if (level === 'critical') {
    colorClass = '#DC2626';
    badgeBg = 'bg-danger/20 border-danger/50 text-danger animate-pulse';
    Icon = AlertOctagon;
  } else if (level === 'high') {
    colorClass = '#EF4444';
    badgeBg = 'bg-danger/15 border-danger/30 text-danger';
    Icon = ShieldAlert;
  } else if (level === 'elevated') {
    colorClass = '#F97316';
    badgeBg = 'bg-elevated/15 border-elevated/30 text-elevated';
    Icon = AlertTriangle;
  } else if (level === 'caution') {
    colorClass = '#F59E0B';
    badgeBg = 'bg-warning/15 border-warning/30 text-warning';
    Icon = AlertTriangle;
  } else if (level === 'inconclusive') {
    colorClass = '#94A3B8';
    badgeBg = 'bg-card-bg border-card-border text-text-secondary';
    Icon = HelpCircle;
  }

  const levelText = levelLabels[level]?.[language] || levelLabels[level]?.en || 'Risk Evaluated';

  return (
    <div className="flex flex-col items-center justify-between p-6 bg-card-bg border border-card-border rounded-2xl shadow-cyber text-center h-full">
      <div className="w-full space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">
          {language === 'hi' ? 'सुरक्षा जोखिम मूल्यांकन' : 'Security Risk Gauge'}
        </span>

        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          {/* SVG Circular Meter */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#1e293b"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Active Progress */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={colorClass}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Score Display */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-display font-black text-text-primary tracking-tight">
              {clampedScore}
            </span>
            <span className="text-[11px] font-mono text-text-secondary uppercase tracking-wider">
              / 100 {language === 'hi' ? 'स्कोर' : 'Risk'}
            </span>
          </div>
        </div>

        {/* Risk Level Badge */}
        <div className={`mt-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center justify-center gap-1.5 ${badgeBg}`}>
          <Icon className="w-4 h-4" />
          <span>{levelText}</span>
        </div>
      </div>

      {/* Model Output & Why This Score Link */}
      <div className="w-full pt-4 border-t border-card-border/60 space-y-2 text-xs">
        {confidence !== null && (
          <div className="flex items-center justify-between text-[11px] font-mono text-text-secondary bg-secondary-bg/50 px-3 py-1.5 rounded-lg border border-card-border/50">
            <span>Model Probability:</span>
            <strong className="text-cyan-accent">{Math.round(confidence * 100)}%</strong>
          </div>
        )}

        {onOpenWhyThisScore && (
          <button
            onClick={onOpenWhyThisScore}
            className="w-full py-1.5 px-3 rounded-lg bg-secondary-bg hover:bg-card-border border border-card-border text-[11px] font-mono text-cyan-accent hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <QuestionIcon className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'यह स्कोर कैसे आया? (Why This Score?)' : 'Why This Score? (Scoring Breakdown)'}</span>
          </button>
        )}

        <p className="text-[10px] text-text-secondary/80 leading-relaxed italic">
          {level === 'low'
            ? 'Low risk detected. Automated systems cannot guarantee absolute safety; always exercise prudent verification.'
            : 'Multi-layer security assessment synthesized from deterministic rules, lexical features & calibrated ML models.'}
        </p>
      </div>
    </div>
  );
}
