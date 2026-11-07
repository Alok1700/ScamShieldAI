import React from 'react';
import { HelpCircle, X, ShieldAlert, Cpu, Globe, Database, ArrowRight, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { useScanStore } from '../store/scanStore';

export default function WhyThisScoreModal({ isOpen, onClose, report }) {
  const { language } = useScanStore();
  if (!isOpen || !report) return null;

  const isHi = language === 'hi';

  const {
    riskScore = 0,
    riskLevel = 'low',
    scoringBreakdown = {},
    confidence = null,
    mlInsights = null,
    observedEvidence = [],
    urlReports = [],
    primaryThreat = ''
  } = report;

  const ruleContribution = scoringBreakdown.ruleContribution ?? 0;
  const mlContribution = scoringBreakdown.mlContribution ?? 0;
  const urlContribution = scoringBreakdown.urlContribution ?? 0;
  const qrContribution = scoringBreakdown.qrContribution ?? 0;
  const mitigations = scoringBreakdown.mitigationsApplied ?? 0;
  const missingEvidence = scoringBreakdown.missingEvidence || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card-bg border border-cyan-accent/40 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
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
          <div className="w-12 h-12 rounded-2xl bg-cyan-accent/15 border border-cyan-accent/40 flex items-center justify-center text-cyan-accent shrink-0 mt-0.5">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-accent font-bold px-2 py-0.5 rounded bg-cyan-accent/10 border border-cyan-accent/20">
              {isHi ? 'जोखिम स्कोर व्याख्या' : 'Explainable Scoring Architecture'}
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-text-primary mt-1">
              {isHi ? 'यह स्कोर कैसे निर्धारित किया गया? (Why This Score?)' : 'Why This Score? — Transparent Risk Synthesis'}
            </h2>
          </div>
        </div>

        {/* Primary Score vs Calibrated ML Probability Distinction */}
        <div className="p-4 rounded-xl bg-secondary-bg/70 border border-card-border space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-card-border/60">
            <div>
              <span className="text-[10px] font-mono uppercase text-text-secondary">
                {isHi ? 'एप्लिकेशन-स्तरीय जोखिम स्कोर' : 'Application Risk Assessment'}
              </span>
              <div className="text-2xl font-display font-black text-text-primary">
                {riskScore} <span className="text-sm font-normal text-text-secondary">/ 100 ({riskLevel.toUpperCase()})</span>
              </div>
            </div>

            {confidence !== null && (
              <div className="sm:text-right">
                <span className="text-[10px] font-mono uppercase text-cyan-accent">
                  {isHi ? 'ML मॉडल सांख्यिकीय संभावना' : 'Calibrated Model Output'}
                </span>
                <div className="text-2xl font-mono font-bold text-cyan-accent">
                  {Math.round(confidence * 100)}%
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            <strong className="text-text-primary">Important Scientific Distinction: </strong>
            The <strong>Risk Score ({riskScore}/100)</strong> represents our multi-layer defensive security assessment combining verifiable evidence rules, threat intel, and ML weights. The <strong>Model Probability ({confidence !== null ? Math.round(confidence * 100) + '%' : 'N/A'})</strong> is the raw statistical inference output of the trained scikit-learn classifier. They are calculated separately to avoid misleading users.
          </p>
        </div>

        {/* Additive Evidence Fusion Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-text-secondary font-semibold">
            {isHi ? 'स्कोर का घटक विभाजन (Scoring Breakdown)' : 'Bounded Evidence Fusion Breakdown'}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className="p-3 rounded-xl bg-secondary-bg/50 border border-card-border space-y-1">
              <span className="text-[10px] text-text-secondary block">Rules & Signals</span>
              <span className="text-lg font-bold text-text-primary">+{ruleContribution} pts</span>
              <span className="text-[10px] text-cyan-accent block">Max 60 pts bounded</span>
            </div>
            <div className="p-3 rounded-xl bg-secondary-bg/50 border border-card-border space-y-1">
              <span className="text-[10px] text-text-secondary block">SMS ML Model</span>
              <span className="text-lg font-bold text-text-primary">+{mlContribution} pts</span>
              <span className="text-[10px] text-cyan-accent block">5,572 Dataset</span>
            </div>
            <div className="p-3 rounded-xl bg-secondary-bg/50 border border-card-border space-y-1">
              <span className="text-[10px] text-text-secondary block">URL Threat ML</span>
              <span className="text-lg font-bold text-text-primary">+{urlContribution} pts</span>
              <span className="text-[10px] text-cyan-accent block">11,424 Dataset</span>
            </div>
            <div className="p-3 rounded-xl bg-secondary-bg/50 border border-card-border space-y-1">
              <span className="text-[10px] text-text-secondary block">Mitigating Factors</span>
              <span className="text-lg font-bold text-success">-{mitigations} pts</span>
              <span className="text-[10px] text-success block">Legitimate cues</span>
            </div>
          </div>
        </div>

        {/* Aggregation Methodology */}
        <div className="p-3.5 rounded-xl bg-secondary-bg/40 border border-card-border/60 text-xs space-y-1.5">
          <span className="text-[10px] font-mono text-cyan-accent uppercase font-bold tracking-wider">
            Anti-Double-Counting Methodology
          </span>
          <p className="text-text-secondary leading-relaxed">
            ScamShield AI employs a <strong>bounded multi-attribute utility fusion with diminishing returns</strong>. The most critical threat vector contributes primary weight, while secondary overlapping signals are discounted by an exponential factor. This prevents 4 minor text keywords from artificially inflating a score to 100 in the absence of verified malicious infrastructure.
          </p>
        </div>

        {/* Missing Evidence / What Could Not Be Verified */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-text-secondary uppercase font-semibold tracking-wider">
            What Was NOT Found or Could Not Be Verified (Missing Evidence):
          </span>
          {missingEvidence.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-text-secondary font-mono">
              {missingEvidence.map((me, mIdx) => (
                <li key={mIdx} className="flex items-center gap-2 p-2 rounded-lg bg-secondary-bg/30 border border-card-border/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-accent shrink-0"></span>
                  <span>{me}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-text-secondary">
              Direct evidence matches across multiple threat vectors were confirmed.
            </p>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-all shadow-cyber"
          >
            {isHi ? 'बंद करें' : 'Close Breakdown'}
          </button>
        </div>
      </div>
    </div>
  );
}
