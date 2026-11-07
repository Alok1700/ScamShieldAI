import React, { useState } from 'react';
import { ArrowDown, CheckCircle, AlertTriangle, HelpCircle, ShieldCheck, ChevronDown, Sparkles, ExternalLink, Copy, Check, Search } from 'lucide-react';
import { useScanStore } from '../store/scanStore';
import { t } from '../utils/i18n';
import toast from 'react-hot-toast';

const STAGE_TRANSLATIONS = {
  hi: {
    '1. Impersonation': '1. बैंक / संस्था की फर्जी पहचान (Impersonation)',
    '2. Psychological Manipulation': '2. तात्कालिक दबाव व मनोवैज्ञानिक हेरफेर (Manipulation)',
    '3. Redirection': '3. दुर्भावनापूर्ण लिंक व रीडायरेक्शन (Redirection)',
    '4. Credential or Payment Request': '4. क्रेडेंशियल, OTP या UPI पिन की मांग (Solicitation)',
    '5. Potential Financial Harm': '5. संभावित वित्तीय नुकसान व खाता समझौता (Potential Harm)'
  }
};

export default function ScamChainGraph({ chain = [], onSelectEvidence = null, selectedEvidence = null }) {
  const { language } = useScanStore();
  const [showAllStages, setShowAllStages] = useState(false);
  const [copiedItemIdx, setCopiedItemIdx] = useState(null);

  if (!chain || chain.length === 0) return null;

  const isHi = language === 'hi';

  const handleCopyEvidence = (e, text, idx) => {
    e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedItemIdx(idx);
    toast.success(isHi ? 'लिंक / साक्ष्य कॉपी हो गया' : 'Observed evidence copied to clipboard');
    setTimeout(() => setCopiedItemIdx(null), 2000);
  };

  const hasObservedOrPotential = chain.some(c => c.status === 'observed' || c.status === 'potential_outcome');

  // Intelligent empty state if no clear scam sequence is found
  if (!hasObservedOrPotential) {
    return (
      <div className="bg-card-bg border border-card-border rounded-2xl p-5 sm:p-6 shadow-cyber space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/15 border border-success/30 flex items-center justify-center text-success shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-text-primary tracking-wide uppercase font-mono">
                {isHi ? 'कोई स्पष्ट धोखाधड़ी क्रम नहीं मिला (No Scam Sequence)' : 'No Clear Scam Sequence Identified'}
              </h3>
              <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                {isHi
                  ? 'सबमिट की गई सामग्री में किसी संगठित साइबर हमले के चरणों का पुनर्निर्माण करने के लिए पर्याप्त साक्ष्य नहीं मिले हैं।'
                  : 'The submitted content does not contain enough evidence to reconstruct a full cyber attack sequence.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAllStages(!showAllStages)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary-bg hover:bg-card-border border border-card-border text-xs font-mono text-cyan-accent font-medium transition-all shrink-0 self-start sm:self-center"
          >
            <span>{showAllStages ? (isHi ? 'चरण छुपाएं' : 'Hide Stages') : (isHi ? '5 चरणों का विश्लेषण देखें' : 'Inspect 5 Kill-Chain Stages')}</span>
            <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${showAllStages ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showAllStages && (
          <div className="pt-3 border-t border-card-border/60 space-y-2 animate-fade-in">
            {chain.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-secondary-bg/30 border border-card-border/30 text-text-secondary flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-text-secondary/50" />
                  <span className="font-semibold text-text-primary font-mono">{item.stage}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card-bg border border-card-border uppercase">
                  {isHi ? 'साक्ष्य अनुपस्थित' : 'Not Observed'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card-bg border border-card-border rounded-2xl p-5 sm:p-6 shadow-cyber space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-card-border/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-accent animate-pulse"></span>
            <h3 className="text-sm sm:text-base font-semibold text-text-primary tracking-wide uppercase font-mono">
              {isHi ? 'स्कैम जर्नी पुनर्निर्माण (Scam Journey Kill-Chain)' : 'Scam Journey & Attack Kill-Chain Reconstruction'}
            </h3>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            {isHi
              ? 'प्रारंभिक प्रतिरूपण से लेकर संभावित वित्तीय नुकसान तक के 5 चरणों का तकनीकी विश्लेषण (क्लिक करके इनपुट में साक्ष्य देखें)'
              : 'Multi-stage timeline from initial lure to potential financial impact. Click an observed stage to highlight matching text.'}
          </p>
        </div>
        <span className="text-[11px] font-mono text-cyan-accent/80 bg-cyan-accent/10 px-2.5 py-1 rounded-full border border-cyan-accent/20 font-semibold self-start sm:self-auto">
          Cyber Kill-Chain Model
        </span>
      </div>

      <div className="space-y-2.5">
        {chain.map((item, idx) => {
          const isObserved = item.status === 'observed';
          const isPotential = item.status === 'potential_outcome';
          const isNotDetected = item.status === 'not_detected';

          // Safely extract string to prevent TypeError if selectedEvidence is an object
          const selectedText = typeof selectedEvidence === 'string'
            ? selectedEvidence
            : (selectedEvidence?.text || '');
          const isSelected = selectedText && item.evidence && (
            selectedText.toLowerCase().includes(item.evidence.toLowerCase()) ||
            item.evidence.toLowerCase().includes(selectedText.toLowerCase())
          );

          const localizedStage = STAGE_TRANSLATIONS[language]?.[item.stage] || item.stage;
          const isUrl = typeof item.evidence === 'string' && (/^https?:\/\//i.test(item.evidence) || item.evidence.includes('.'));

          return (
            <React.Fragment key={idx}>
              <div
                onClick={() => {
                  if (isObserved && item.evidence && onSelectEvidence) {
                    onSelectEvidence(item.evidenceSpan || item.evidence);
                  }
                }}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isObserved
                    ? `bg-danger/10 border-danger/30 text-text-primary ${onSelectEvidence ? 'cursor-pointer hover:border-danger hover:bg-danger/15' : ''} ${isSelected ? 'ring-2 ring-danger bg-danger/20 shadow-md' : ''}`
                    : isPotential
                    ? 'bg-warning/10 border-warning/30 text-text-primary'
                    : 'bg-secondary-bg/25 border-card-border/30 text-text-secondary opacity-60'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5 shrink-0">
                    {isObserved && <CheckCircle className="w-4 h-4 text-danger" />}
                    {isPotential && <AlertTriangle className="w-4 h-4 text-warning" />}
                    {isNotDetected && <HelpCircle className="w-4 h-4 text-text-secondary/50" />}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="font-semibold text-xs sm:text-sm font-mono tracking-tight flex items-center gap-2 flex-wrap">
                      <span>{localizedStage}</span>
                      {isObserved && item.evidence && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-cyan-accent text-white font-bold animate-pulse'
                            : 'text-cyan-accent bg-cyan-accent/10 border border-cyan-accent/20'
                        }`}>
                          <Search className="w-3 h-3" />
                          <span>{isSelected ? (isHi ? 'इनपुट में हाइलाइट किया गया' : 'Inspecting in Text') : (isHi ? 'इनपुट में देखने के लिए क्लिक करें' : 'Click to inspect in text')}</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-text-secondary leading-relaxed break-words font-mono">
                      {item.detail}
                    </div>

                    {/* Interactive Action Pill Buttons for Observed Items */}
                    {isObserved && item.evidence && (
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectEvidence) {
                              onSelectEvidence(item.evidenceSpan || item.evidence);
                            }
                          }}
                          className="px-2 py-1 rounded bg-secondary-bg hover:bg-card-border border border-card-border text-[11px] font-mono text-cyan-accent hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Search className="w-3 h-3" />
                          <span>{isHi ? 'इनपुट में हाइलाइट करें' : 'Inspect in Text'}</span>
                        </button>

                        {isUrl && (
                          <button
                            type="button"
                            onClick={(e) => handleCopyEvidence(e, item.evidence, idx)}
                            className="px-2 py-1 rounded bg-secondary-bg hover:bg-card-border border border-card-border text-[11px] font-mono text-text-secondary hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                            title="Copy observed URL safely to clipboard"
                          >
                            {copiedItemIdx === idx ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedItemIdx === idx ? (isHi ? 'कॉपी हो गया' : 'Copied!') : (isHi ? 'लिंक सुरक्षित कॉपी करें' : 'Copy Link Safely')}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 self-start sm:self-center">
                  {isObserved && (
                    <span className="px-2.5 py-1 text-[10px] font-mono font-bold rounded-full bg-danger/20 text-danger border border-danger/40 uppercase tracking-wider">
                      {isHi ? 'प्रत्यक्ष साक्ष्य (OBSERVED)' : 'OBSERVED'}
                    </span>
                  )}
                  {isPotential && (
                    <span className="px-2.5 py-1 text-[10px] font-mono font-bold rounded-full bg-warning/20 text-warning border border-warning/40 uppercase tracking-wider">
                      {isHi ? 'संभावित परिणाम (POTENTIAL)' : 'POTENTIAL OUTCOME'}
                    </span>
                  )}
                  {isNotDetected && (
                    <span className="px-2.5 py-1 text-[10px] font-mono rounded-full bg-card-bg text-text-secondary/70 border border-card-border uppercase text-[10px]">
                      {isHi ? 'अनुपस्थित' : 'NOT OBSERVED'}
                    </span>
                  )}
                </div>
              </div>

              {idx < chain.length - 1 && (
                <div className="flex justify-center my-0.5">
                  <ArrowDown className="w-3.5 h-3.5 text-card-border/80" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
