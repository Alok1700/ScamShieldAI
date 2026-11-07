import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft, 
  Download, 
  ThumbsUp, 
  ThumbsDown, 
  ExternalLink, 
  PhoneCall, 
  Copy, 
  Check, 
  Sparkles, 
  QrCode, 
  Globe, 
  Cpu, 
  Zap, 
  Activity, 
  HelpCircle, 
  AlertOctagon, 
  Layers, 
  Eye, 
  Code2, 
  CheckCircle2, 
  X,
  FileText
} from 'lucide-react';
import { useScanStore } from '../store/scanStore';
import { scanService } from '../services/api';
import RiskScoreGauge from '../components/RiskScoreGauge';
import ScamChainGraph from '../components/ScamChainGraph';
import EvidenceSection from '../components/EvidenceSection';
import TechnicalViewInspector from '../components/TechnicalViewInspector';
import RecoveryGuidanceModal from '../components/RecoveryGuidanceModal';
import WhyThisScoreModal from '../components/WhyThisScoreModal';
import ModelEvaluationModal from '../components/ModelEvaluationModal';
import { t } from '../utils/i18n';
import { getLocalizedReport } from '../utils/reportLocalizer';
import toast from 'react-hot-toast';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { currentReport, language, setLanguage } = useScanStore();
  
  // UI States
  const [viewMode, setViewMode] = useState('simple'); // 'simple' | 'technical'
  const [isScammedModalOpen, setIsScammedModalOpen] = useState(false);
  const [isWhyScoreModalOpen, setIsWhyScoreModalOpen] = useState(false);
  const [isModelEvalModalOpen, setIsModelEvalModalOpen] = useState(false);
  const [activeHighlightSpan, setActiveHighlightSpan] = useState(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [highlightFlash, setHighlightFlash] = useState(false);
  const submittedContentRef = useRef(null);

  if (!currentReport) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-card-bg border border-card-border flex items-center justify-center mx-auto text-text-secondary">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary">{t('results.noReport', language)}</h2>
        <p className="text-sm text-text-secondary">
          {t('results.noReportDesc', language)}
        </p>
        <Link
          to="/scanner"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-cyber"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('results.goToScanner', language)}</span>
        </Link>
      </div>
    );
  }

  // Get dynamically localized report based on active language
  const report = getLocalizedReport(currentReport, language);

  const {
    scanId,
    scanType,
    riskScore,
    riskLevel,
    confidence,
    detectedSignals = [],
    observedEvidence = [],
    statisticalSignals = [],
    potentialOutcomes = [],
    scoringBreakdown = {},
    scamChain = [],
    urlReports = [],
    upiDetails,
    mlInsights,
    qrInsights,
    pipelineStages = {},
    processingTimeMs,
    displayThreat,
    displayRiskLevel,
    displaySummary,
    displayWhatIsSuspicious,
    displayWhyDangerous,
    displayRecommendedAction,
    displayRecommendations,
    displaySubmittedContent,
    displayAiSolution
  } = report;

  const handleCopySubmittedContent = () => {
    if (!displaySubmittedContent) return;
    navigator.clipboard.writeText(displaySubmittedContent);
    setCopiedContent(true);
    toast.success(language === 'hi' ? 'सबमिट की गई सामग्री कॉपी हो गई' : 'Submitted content copied to clipboard');
    setTimeout(() => setCopiedContent(false), 2000);
  };

  const handleCopySummary = () => {
    const reportText = `[ScamShield AI 1.0 Security Report]\nScan ID: ${scanId}\nThreat: ${displayThreat}\nRisk Assessment: ${riskScore}/100 (${displayRiskLevel})\nSummary: ${displaySummary}\nRecommendations:\n${displayRecommendations.map(r => '- ' + r).join('\n')}\nNational Helpline: 1930 | cybercrime.gov.in`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    toast.success(language === 'hi' ? 'रिपोर्ट सारांश कॉपी हो गया' : 'Report summary copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const exportData = {
      scanId,
      timestamp: currentReport.createdAt || new Date().toISOString(),
      scanType,
      riskAssessment: {
        riskScore,
        riskLevel: displayRiskLevel,
        primaryThreat: displayThreat,
        confidence: confidence !== null ? `${Math.round(confidence * 100)}%` : null,
        scoringBreakdown: report.scoringBreakdown || {}
      },
      summary: displaySummary,
      evidenceSummary: {
        observedEvidence: (report.observedEvidence || []).map(e => ({
          type: e.type,
          severity: e.severity,
          evidence: e.evidence,
          explanation: e.explanation
        })),
        statisticalSignals: (report.statisticalSignals || []).map(s => ({
          feature: s.feature,
          weight: s.weight,
          direction: s.direction
        })),
        potentialOutcomes: (report.potentialOutcomes || []).map(p => ({
          title: p.title,
          outcome: p.outcome
        }))
      },
      scamKillChain: (report.scamChain || []).map(c => ({
        stage: c.stage,
        status: c.status,
        detail: c.detail
      })),
      safetyRecommendations: displayRecommendations,
      pipelineStatuses: report.pipelineStages?.stages || report.pipelineStages,
      aiPlaybook: displayAiSolution || null,
      reportingNotice: {
        nationalHelpline: '1930',
        officialPortal: 'https://cybercrime.gov.in/'
      },
      versions: {
        app: 'ScamShield AI 1.0',
        modelVersion: '1.0.0',
        ruleEngineVersion: '1.0.0'
      }
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `scamshield-report-${scanId.slice(0, 8)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success(language === 'hi' ? 'JSON रिपोर्ट डाउनलोड हो गई' : 'JSON report downloaded');
  };

  const submitFeedback = async (type) => {
    try {
      await scanService.submitFeedback(scanId, type, `User flagged as ${type}`);
      setFeedbackSent(true);
      toast.success(language === 'hi' ? 'प्रतिक्रिया दर्ज की गई' : 'Feedback recorded to improve detection models');
    } catch {
      toast.error('Could not submit feedback');
    }
  };

  // Interactive evidence inspector helper: highlights and smoothly scrolls to submitted input
  const handleSelectEvidenceSpan = (spanOrText) => {
    setActiveHighlightSpan(spanOrText);
    setHighlightFlash(true);
    setTimeout(() => setHighlightFlash(false), 2500);

    if (submittedContentRef.current) {
      submittedContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const preview = typeof spanOrText === 'string' ? spanOrText : (spanOrText?.text || '');
    if (preview) {
      toast(`Inspecting highlighted evidence: "${preview.slice(0, 35)}${preview.length > 35 ? '...' : ''}"`, {
        icon: '🔍',
        id: 'inspect-evidence-toast',
        duration: 2500
      });
    }
  };

  // Text highlighting helper for submitted content
  const renderHighlightedContent = (fullText, spanOrText) => {
    if (!fullText) return null;
    if (!spanOrText) return `"${fullText}"`;

    const rawTarget = typeof spanOrText === 'string' ? spanOrText : spanOrText?.text;
    if (!rawTarget) return `"${fullText}"`;

    const target = rawTarget.trim();
    const lowerFull = fullText.toLowerCase();
    const lowerTarget = target.toLowerCase();

    // 1. Direct substring match
    let idx = lowerFull.indexOf(lowerTarget);

    // 2. URL without trailing slash or protocol
    if (idx === -1 && (lowerTarget.startsWith('http://') || lowerTarget.startsWith('https://'))) {
      const strippedTarget = lowerTarget.replace(/^https?:\/\//, '').replace(/\/+$/, '');
      if (strippedTarget.length > 3) {
        idx = lowerFull.indexOf(strippedTarget);
        if (idx !== -1) {
          const before = fullText.slice(0, idx);
          const match = fullText.slice(idx, idx + strippedTarget.length);
          const after = fullText.slice(idx + strippedTarget.length);
          return (
            <span>
              "{before}
              <mark className="bg-cyan-accent/40 text-white font-bold px-1.5 py-0.5 rounded border border-cyan-accent shadow-sm animate-pulse">
                {match}
              </mark>
              {after}"
            </span>
          );
        }
      }
    }

    // 3. Fallback: if entire content is the URL or matches target
    if (idx === -1 && (fullText.trim().toLowerCase() === lowerTarget || lowerTarget.includes(fullText.trim().toLowerCase()) || fullText.trim().toLowerCase().includes(lowerTarget))) {
      return (
        <span>
          "
          <mark className="bg-cyan-accent/40 text-white font-bold px-1.5 py-0.5 rounded border border-cyan-accent shadow-sm animate-pulse">
            {fullText}
          </mark>
          "
        </span>
      );
    }

    if (idx === -1) return `"${fullText}"`;

    const before = fullText.slice(0, idx);
    const match = fullText.slice(idx, idx + target.length);
    const after = fullText.slice(idx + target.length);

    return (
      <span>
        "{before}
        <mark className="bg-cyan-accent/40 text-white font-bold px-1.5 py-0.5 rounded border border-cyan-accent shadow-sm animate-pulse">
          {match}
        </mark>
        {after}"
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-card-border">
        {/* Back Link & Brand Heading */}
        <div className="space-y-1">
          <button
            onClick={() => navigate('/scanner')}
            className="flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-cyan-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('results.scanAnother', language)}</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-display font-black text-text-primary flex items-center gap-2">
            <span>ScamShield AI</span>
            <span className="text-cyan-accent">— Security Analysis</span>
          </h1>
        </div>

        {/* Controls: Simple/Technical View, Language & Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Simple vs Technical View Selector */}
          <div className="flex items-center p-1 rounded-xl bg-card-bg border border-card-border text-xs font-mono">
            <button
              onClick={() => setViewMode('simple')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold ${
                viewMode === 'simple'
                  ? 'bg-gradient-to-r from-primary to-cyan-accent text-white shadow-cyber'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('results.simpleView', language)}</span>
            </button>
            <button
              onClick={() => setViewMode('technical')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold ${
                viewMode === 'technical'
                  ? 'bg-gradient-to-r from-primary to-cyan-accent text-white shadow-cyber'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{t('results.technicalView', language)}</span>
            </button>
          </div>

          {/* Quick Language Switcher Pills */}
          <div className="flex items-center gap-1 bg-card-bg border border-card-border rounded-xl p-1 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-cyan-accent ml-1.5 mr-0.5" />
            {[
              { code: 'en', label: 'EN' },
              { code: 'hi', label: 'हिन्दी' }
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                  language === l.code
                    ? 'bg-cyan-accent/20 text-cyan-accent border border-cyan-accent/40 font-bold'
                    : 'text-text-secondary hover:text-white'
                }`}
                title={`Switch language to ${l.label}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* "I've Already Been Scammed" Emergency Button */}
          <button
            onClick={() => setIsScammedModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-danger/20 hover:bg-danger/30 text-danger border border-danger/40 text-xs font-bold font-mono transition-all cursor-pointer shadow-sm animate-pulse"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{t('results.scammedHelpBtn', language)}</span>
          </button>

          {/* Utility Actions */}
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card-bg border border-card-border hover:bg-secondary-bg text-text-secondary hover:text-text-primary text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? t('results.copied', language) : t('results.copySummary', language)}</span>
          </button>
          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card-bg border border-card-border hover:bg-secondary-bg text-text-secondary hover:text-text-primary text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('results.downloadJson', language)}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1 — User's Submitted Content Section with Interactive Highlighting */}
      {displaySubmittedContent && (
        <div 
          ref={submittedContentRef}
          className={`p-5 rounded-2xl bg-card-bg border transition-all shadow-cyber space-y-3 ${
            highlightFlash
              ? 'border-cyan-accent ring-4 ring-cyan-accent/30 bg-cyan-accent/5'
              : 'border-card-border hover:border-cyan-accent/40'
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-accent"></span>
              <h3 className="text-sm font-semibold text-text-primary tracking-wide uppercase font-mono">
                {t('results.submittedContentTitle', language)}
              </h3>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-primary/20 text-cyan-accent border border-primary/30 font-bold">
                {scanType.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {activeHighlightSpan && (
                <button
                  onClick={() => setActiveHighlightSpan(null)}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-secondary-bg hover:bg-card-border text-[10px] font-mono text-cyan-accent"
                >
                  <X className="w-3 h-3" />
                  <span>Clear Highlight</span>
                </button>
              )}
              <button
                onClick={handleCopySubmittedContent}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary-bg hover:bg-card-border border border-card-border text-[11px] font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                {copiedContent ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedContent ? t('results.contentCopied', language) : t('results.copyContent', language)}</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-text-secondary">
            {t('results.submittedContentDesc', language)}
          </p>

          <div className="bg-secondary-bg/70 border border-card-border/60 rounded-xl p-4 font-mono text-xs sm:text-sm text-text-primary leading-relaxed break-words max-h-48 overflow-y-auto selection:bg-cyan-accent/30 selection:text-white">
            {renderHighlightedContent(displaySubmittedContent, activeHighlightSpan)}
          </div>
        </div>
      )}

      {/* SECTION 1 — Primary Overview Grid: Risk Score Gauge & Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Score Meter */}
        <div className="lg:col-span-1">
          <RiskScoreGauge 
            score={riskScore} 
            level={riskLevel} 
            confidence={confidence}
            onOpenWhyThisScore={() => setIsWhyScoreModalOpen(true)}
          />
        </div>

        {/* Threat Summary & 3 Core Questions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-card-bg border border-card-border shadow-cyber space-y-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-accent font-semibold">
                  {t('results.scanAssessment', language)} • {scanType.toUpperCase()}
                </span>
                <span className="text-[11px] font-mono text-text-secondary">
                  {t('results.latency', language)}: {processingTimeMs} ms • {t('results.id', language)}: {scanId.slice(0, 8)}
                </span>
              </div>

              <h2 className="text-2xl font-display font-bold text-text-primary capitalize">
                {displayThreat}
              </h2>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed bg-secondary-bg/60 p-3.5 rounded-xl border border-card-border/60">
                {displaySummary}
              </p>
            </div>

            {/* 3 Core Questions Answered in High-Legibility Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-secondary-bg/40 border border-card-border/40 space-y-1.5 flex flex-col">
                <span className="text-[10px] font-mono text-cyan-accent uppercase font-semibold tracking-wider">
                  {t('results.suspiciousSignals', language)}
                </span>
                {displayWhatIsSuspicious.includes('; ') ? (
                  <ul className="space-y-1.5 text-xs text-text-primary leading-relaxed break-words">
                    {displayWhatIsSuspicious.split('; ').slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-cyan-accent shrink-0 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-text-primary leading-relaxed break-words">
                    {displayWhatIsSuspicious}
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-secondary-bg/40 border border-card-border/40 space-y-1.5 flex flex-col">
                <span className="text-[10px] font-mono text-danger uppercase font-semibold tracking-wider">
                  {t('results.potentialRisk', language)}
                </span>
                <p className="text-xs text-text-primary leading-relaxed break-words">
                  {displayWhyDangerous}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-secondary-bg/40 border border-card-border/40 space-y-1.5 flex flex-col">
                <span className="text-[10px] font-mono text-success uppercase font-semibold tracking-wider">
                  {t('results.recommendedAction', language)}
                </span>
                <p className="text-xs text-text-primary leading-relaxed break-words">
                  {displayRecommendedAction}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TECHNICAL VIEW: Renders full machine learning inspection panel */}
      {viewMode === 'technical' && (
        <TechnicalViewInspector 
          report={report} 
          onOpenModelEvaluations={() => setIsModelEvalModalOpen(true)}
        />
      )}

      {/* SIMPLE VIEW: Consumer-friendly, clear, actionable */}
      {viewMode === 'simple' && (
        <>
          {/* SECTION 2 — AI-Powered Incident Solution & Action Plan */}
          {displayAiSolution && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-card-bg via-card-bg to-primary/10 border border-primary/40 shadow-cyber space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-card-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-cyan-accent shrink-0">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-display font-bold text-text-primary">
                      {displayAiSolution.title || t('results.aiSolutionTitle', language)}
                    </h3>
                    <span className="text-[10px] font-mono text-cyan-accent uppercase tracking-wider font-semibold">
                      {t('results.aiSolutionBadge', language)} • Gemini 1.5 & Calibrated Security Models
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsScammedModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-danger/15 hover:bg-danger/25 text-danger border border-danger/30 text-xs font-mono font-bold transition-all self-start sm:self-auto cursor-pointer"
                >
                  I've Already Been Scammed &rarr;
                </button>
              </div>

              {/* Immediate Verdict Callout */}
              {displayAiSolution.immediateVerdict && (
                <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-xs sm:text-sm text-text-primary font-medium flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-danger block uppercase text-[10px] font-mono tracking-wider">
                      {t('results.aiVerdictLabel', language)}
                    </span>
                    <p className="mt-0.5">{displayAiSolution.immediateVerdict}</p>
                  </div>
                </div>
              )}

              {/* Step-by-Step Action Plan */}
              {displayAiSolution.steps && displayAiSolution.steps.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {displayAiSolution.steps.map((st, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-4 rounded-xl bg-secondary-bg/60 border border-card-border/80 space-y-1.5 hover:border-cyan-accent/40 transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-cyan-accent/15 border border-cyan-accent/30 text-cyan-accent flex items-center justify-center text-xs font-bold font-mono">
                            {st.step || sIdx + 1}
                          </span>
                          <h4 className="text-xs sm:text-sm font-semibold text-text-primary">
                            {st.title}
                          </h4>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed pl-8">
                          {st.action}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 3 — Categorized Evidence Cards (Replacing old evidence table) */}
          <EvidenceSection
            observedEvidence={observedEvidence}
            statisticalSignals={statisticalSignals}
            potentialOutcomes={potentialOutcomes}
            onSelectEvidenceSpan={handleSelectEvidenceSpan}
            activeHighlightSpan={activeHighlightSpan}
          />

          {/* SECTION 4 — Scam Journey Reconstruction (5-Stage Kill Chain with interactive linking) */}
          <ScamChainGraph
            chain={scamChain}
            onSelectEvidence={handleSelectEvidenceSpan}
            selectedEvidence={activeHighlightSpan}
          />
        </>
      )}

      {/* UPI / QR Details (if QR scanned) */}
      {upiDetails && (
        <div className="p-5 rounded-2xl bg-warning/10 border border-warning/30 space-y-3">
          <div className="flex items-center gap-2 text-warning font-semibold text-sm">
            <QrCode className="w-5 h-5" />
            <span>{t('results.upiTitle', language)}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-card-bg border border-card-border">
              <span className="text-[10px] text-text-secondary">{t('results.payeeVpa', language)}</span>
              <p className="font-semibold text-text-primary mt-0.5 break-all">{upiDetails.payeeVpa}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-card-bg border border-card-border">
              <span className="text-[10px] text-text-secondary">{t('results.payeeName', language)}</span>
              <p className="font-semibold text-text-primary mt-0.5">{upiDetails.payeeName || t('results.unspecified', language)}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-card-bg border border-card-border">
              <span className="text-[10px] text-text-secondary">{t('results.specifiedAmount', language)}</span>
              <p className="font-semibold text-text-primary mt-0.5">{upiDetails.amount ? `₹ ${upiDetails.amount}` : t('results.userDetermined', language)}</p>
            </div>
          </div>
          <p className="text-xs text-warning leading-relaxed font-mono">
            {t('results.upiCritical', language)}
          </p>
        </div>
      )}

      {/* Actionable Recommendations & Indian Cybercrime Portal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card-bg border border-card-border shadow-cyber space-y-3">
          <h3 className="text-sm font-semibold text-text-primary uppercase font-mono">
            {t('results.recommendationsTitle', language)}
          </h3>
          <ul className="space-y-2 text-xs text-text-secondary leading-relaxed">
            {displayRecommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-cyan-accent shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-danger/10 border border-danger/30 shadow-cyber space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-danger uppercase font-mono flex items-center gap-2">
              <PhoneCall className="w-4 h-4" />
              {t('results.emergencyTitle', language)}
            </h3>
            <a
              href="tel:1930"
              className="px-2.5 py-1 rounded bg-danger text-white text-[11px] font-bold font-mono hover:bg-danger/90 transition-colors"
            >
              {t('results.dial1930', language)}
            </a>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {t('results.emergencyDesc', language)}
          </p>
          <a
            href="https://cybercrime.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-cyan-accent hover:underline font-medium"
          >
            <span>{t('results.firLink', language)}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Privacy Information & Feedback Section */}
      <div className="p-5 rounded-2xl bg-secondary-bg/60 border border-card-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
        <div className="space-y-1">
          <p className="font-medium text-text-primary flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-accent" />
            <span>Privacy-First Scanning — No Raw Scan Storage</span>
          </p>
          <p className="text-[11px]">
            Input text, screenshots, and decoded QR payloads are processed in volatile memory. We do not permanently store unconsented personal records.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span>{t('results.wasAccurate', language)}</span>
          <button
            onClick={() => submitFeedback('accurate')}
            disabled={feedbackSent}
            className="p-1.5 rounded-lg bg-card-bg hover:bg-success/20 hover:text-success border border-card-border transition-colors disabled:opacity-50"
            title="Accurate assessment"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => submitFeedback('false_positive')}
            disabled={feedbackSent}
            className="p-1.5 rounded-lg bg-card-bg hover:bg-danger/20 hover:text-danger border border-card-border transition-colors disabled:opacity-50"
            title="False positive (It was legitimate)"
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Modals */}
      <RecoveryGuidanceModal 
        isOpen={isScammedModalOpen} 
        onClose={() => setIsScammedModalOpen(false)} 
      />

      <WhyThisScoreModal 
        isOpen={isWhyScoreModalOpen} 
        onClose={() => setIsWhyScoreModalOpen(false)} 
        report={report} 
      />

      <ModelEvaluationModal 
        isOpen={isModelEvalModalOpen} 
        onClose={() => setIsModelEvalModalOpen(false)} 
      />
    </div>
  );
}
