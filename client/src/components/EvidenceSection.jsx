import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Cpu, CheckCircle2, Search, ArrowRight, Sparkles, Filter, Info } from 'lucide-react';
import { useScanStore } from '../store/scanStore';

export default function EvidenceSection({
  observedEvidence = [],
  statisticalSignals = [],
  potentialOutcomes = [],
  onSelectEvidenceSpan = null,
  activeHighlightSpan = null
}) {
  const { language } = useScanStore();
  const [filter, setFilter] = useState('all'); // 'all', 'observed', 'statistical', 'potential'

  const isHi = language === 'hi';

  const totalCount = observedEvidence.length + statisticalSignals.length + potentialOutcomes.length;

  return (
    <div className="bg-card-bg border border-card-border rounded-2xl p-5 sm:p-6 shadow-cyber space-y-4">
      {/* Section Header & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-card-border/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-accent"></span>
            <h3 className="text-sm sm:text-base font-semibold text-text-primary tracking-wide uppercase font-mono">
              {isHi ? 'यह संदेश क्यों संदिग्ध पाया गया? (Why Was This Flagged?)' : 'Why Was This Flagged? — Validated Evidence Cards'}
            </h3>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            {isHi
              ? 'प्रत्यक्ष साक्ष्य, सांख्यिकीय मॉडल सिग्नल और संभावित परिणामों का पारदर्शी वर्गीकरण'
              : 'Categorized evidence separating directly observed text facts from statistical ML signals and potential outcomes.'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto text-xs font-mono">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-cyan-accent/20 text-cyan-accent border border-cyan-accent/40 font-bold'
                : 'text-text-secondary hover:text-text-primary bg-secondary-bg/50 border border-card-border'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilter('observed')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filter === 'observed'
                ? 'bg-danger/20 text-danger border border-danger/40 font-bold'
                : 'text-text-secondary hover:text-text-primary bg-secondary-bg/50 border border-card-border'
            }`}
          >
            Observed ({observedEvidence.length})
          </button>
          <button
            onClick={() => setFilter('statistical')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filter === 'statistical'
                ? 'bg-primary/20 text-cyan-accent border border-primary/40 font-bold'
                : 'text-text-secondary hover:text-text-primary bg-secondary-bg/50 border border-card-border'
            }`}
          >
            ML Signals ({statisticalSignals.length})
          </button>
          <button
            onClick={() => setFilter('potential')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filter === 'potential'
                ? 'bg-warning/20 text-warning border border-warning/40 font-bold'
                : 'text-text-secondary hover:text-text-primary bg-secondary-bg/50 border border-card-border'
            }`}
          >
            Outcomes ({potentialOutcomes.length})
          </button>
        </div>
      </div>

      {/* Honest Empty State for Observed Evidence */}
      {observedEvidence.length === 0 && (filter === 'all' || filter === 'observed') && (
        <div className="p-4 rounded-xl bg-secondary-bg/50 border border-card-border/80 flex items-start gap-3 text-xs leading-relaxed">
          <Info className="w-4 h-4 text-cyan-accent shrink-0 mt-0.5" />
          <div>
            <strong className="text-text-primary block font-mono">
              {isHi ? 'कोई प्रत्यक्ष फ़िशिंग संकेतक नहीं मिला' : 'No Direct Phishing Indicators Observed'}
            </strong>
            <p className="text-text-secondary mt-0.5">
              {isHi
                ? 'दिए गए संदेश में कोई प्रत्यक्ष क्रेडेंशियल, OTP या जबरन भुगतान का अनुरोध नहीं मिला। ML क्लासिफायर ने एक सांख्यिकीय पैटर्न पहचाना है जिसे स्वतंत्र सत्यापन की आवश्यकता है।'
                : 'No overt credential, OTP solicitation, or reverse payment trap was identified in the text. The ML classifier analyzed statistical n-gram patterns, which require independent verification.'}
            </p>
          </div>
        </div>
      )}

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Category A: Directly Observed Security Evidence */}
        {(filter === 'all' || filter === 'observed') &&
          observedEvidence.map((ev, idx) => {
            const activeText = typeof activeHighlightSpan === 'string'
              ? activeHighlightSpan
              : (activeHighlightSpan?.text || '');
            const isHighlighted = activeText && ev.evidence && (
              activeText.toLowerCase().includes(ev.evidence.toLowerCase()) ||
              ev.evidence.toLowerCase().includes(activeText.toLowerCase())
            );

            return (
              <div
                key={`obs-${idx}`}
                onClick={() => {
                  if (ev.evidence && onSelectEvidenceSpan) {
                    onSelectEvidenceSpan(ev.span || ev.evidence);
                  }
                }}
                className={`p-4 rounded-xl bg-secondary-bg/60 border transition-all flex flex-col justify-between space-y-3 cursor-pointer hover:border-danger/60 ${
                  isHighlighted ? 'border-danger ring-2 ring-danger bg-danger/10' : 'border-card-border'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-danger/20 text-danger border border-danger/40">
                      Category A: Directly Observed
                    </span>
                    <span className="text-[10px] font-mono uppercase text-text-secondary">
                      {ev.severity || 'HIGH'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-card-bg/90 border border-card-border font-mono text-xs text-text-primary break-words">
                    "{ev.evidence}"
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {ev.explanation}
                  </p>
                </div>

                <div className="pt-2 border-t border-card-border/50 flex items-center justify-between text-[11px] font-mono text-text-secondary">
                  <span>Source: {ev.source?.replace(/_/g, ' ') || 'Deterministic Security Rule'}</span>
                  <span className="text-cyan-accent flex items-center gap-1 hover:underline">
                    Locate in text <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}

        {/* Category B: Statistical Model Signals */}
        {(filter === 'all' || filter === 'statistical') &&
          statisticalSignals.map((sig, sIdx) => (
            <div
              key={`stat-${sIdx}`}
              className="p-4 rounded-xl bg-secondary-bg/40 border border-card-border flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/20 text-cyan-accent border border-primary/40">
                    Category B: Statistical Signal
                  </span>
                  {sig.signed_weight && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      sig.direction === 'scam' ? 'bg-danger/20 text-danger' : 'bg-success/20 text-success'
                    }`}>
                      Weight: {sig.signed_weight}
                    </span>
                  )}
                </div>

                <div className="p-2 rounded-lg bg-card-bg border border-card-border/70 font-mono text-xs text-cyan-accent font-semibold break-words">
                  {sig.feature || sig.type}
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {sig.explanation || 'Statistical n-gram feature from trained scikit-learn model; by itself not proof of malicious intent.'}
                </p>
              </div>

              <div className="pt-2 border-t border-card-border/50 flex items-center justify-between text-[11px] font-mono text-text-secondary">
                <span>Model: {sig.source || 'ScamShield ML Engine'}</span>
                <span className="text-[10px] text-text-secondary/70 italic">Statistical Pattern</span>
              </div>
            </div>
          ))}

        {/* Category C: Potential Threat Outcomes */}
        {(filter === 'all' || filter === 'potential') &&
          potentialOutcomes.map((pot, pIdx) => (
            <div
              key={`pot-${pIdx}`}
              className="p-4 rounded-xl bg-warning/10 border border-warning/30 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-warning/20 text-warning border border-warning/40">
                    Category C: Potential Outcome
                  </span>
                  <span className="text-[10px] font-mono text-warning font-semibold">
                    Probability: {pot.probability?.toUpperCase() || 'HIGH'}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-semibold text-text-primary">
                  {pot.title}
                </h4>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {pot.outcome}
                </p>
              </div>

              <div className="pt-2 border-t border-warning/20 flex items-center justify-between text-[10px] font-mono text-warning/80">
                <span>Status: Threat Potential (Not Confirmed Fact)</span>
                <span>Precautionary Advisory</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
