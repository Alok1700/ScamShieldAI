import React from 'react';
import { CheckCircle2, Loader2, Circle, AlertCircle, FileText, Link2, ShieldCheck, Cpu, Database, Sparkles, MinusCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useScanStore } from '../store/scanStore';
import { t } from '../utils/i18n';

export default function ThreatIntelligencePanel({ pipelineStages = {}, isScanning = false }) {
  const { language } = useScanStore();

  const isHi = language === 'hi';

  // If backend provided structured execution stages with real statuses, use them directly
  const backendStages = Array.isArray(pipelineStages.stages) ? pipelineStages.stages : null;

  const defaultStageConfigs = [
    {
      key: 'content_extraction',
      boolKey: 'contentExtracted',
      label: isHi ? 'सामग्री निष्कर्षण व सामान्यीकरण' : 'Content Normalization & Extraction',
      defaultDesc: isHi ? 'टेक्स्ट, इमेज या QR पेलोड को पार्स और सामान्यीकृत किया गया' : 'Text, image OCR or QR payload normalized in volatile memory',
      icon: FileText
    },
    {
      key: 'url_analysis',
      boolKey: 'urlsIdentified',
      label: isHi ? 'URL निष्कर्षण व लेक्सिकल विश्लेषण' : 'URL Extraction & Lexical Inspection',
      defaultDesc: isHi ? 'लिंक, प्यूनिकोड, आईपी एड्रेस और एन्ट्रापी की जांच' : 'Lexical domain analysis, Shannon entropy & Punycode checks',
      icon: Link2
    },
    {
      key: 'heuristic_rules',
      boolKey: 'rulesApplied',
      label: isHi ? 'नियम-आधारित सुरक्षा नियम' : 'Deterministic Security Rules',
      defaultDesc: isHi ? 'आपातकालीन दबाव, बैंक प्रतिरूपण, OTP व UPI पिन नियम' : 'High-precision regex heuristics matching known fraud vectors',
      icon: ShieldCheck
    },
    {
      key: 'ml_inference',
      boolKey: 'mlClassifierRun',
      label: isHi ? 'मशीन लर्निंग क्लासिफायर' : 'Machine Learning Classifiers',
      defaultDesc: isHi ? '5,572 SMS, 11,424 URL और 10,000 QR डेटासेट आधारित ML' : 'Trained scikit-learn models evaluating statistical n-grams',
      icon: Cpu
    },
    {
      key: 'threat_intel',
      boolKey: 'threatIntelChecked',
      label: isHi ? 'थ्रेट इंटेलिजेंस व प्रतिष्ठा' : 'Threat Intelligence & Reputation',
      defaultDesc: isHi ? 'दुर्भावनापूर्ण होस्ट, संदेहास्पद एक्सटेंशन व बॉटनेट जांच' : 'Zero-outbound lexical threat list & domain reputation inspection',
      icon: Database
    },
    {
      key: 'ai_explanation',
      boolKey: 'explanationGenerated',
      label: isHi ? 'AI व्याख्या व समाधान संश्लेषण' : 'AI Explainability & Synthesis',
      defaultDesc: isHi ? 'Gemini 1.5 और स्थानीय सुरक्षा नियमों द्वारा संरचित रिपोर्ट' : 'Clear incident mitigation steps synthesized with zero hallucinations',
      icon: Sparkles
    }
  ];

  return (
    <div className="bg-card-bg border border-card-border rounded-2xl p-5 sm:p-6 shadow-cyber space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-card-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-accent animate-ping"></div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-text-primary tracking-wide uppercase font-mono">
              {isHi ? '6-स्तरीय डिटेक्शन पाइपलाइन स्थिति' : '6-Stage Multi-Layer Detection Pipeline'}
            </h3>
            <span className="text-[11px] font-mono text-text-secondary">
              {isHi ? 'वास्तविक बैकएंड निष्पादन स्थिति (पारदर्शी सत्यापन)' : 'Real backend-driven execution statuses (honest reporting)'}
            </span>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-primary/15 text-cyan-accent border border-primary/30 font-semibold self-start sm:self-auto">
          {isScanning ? (isHi ? 'विश्लेषण जारी...' : 'Analyzing Pipeline...') : (isHi ? 'निष्पादन पूर्ण' : 'Execution Recorded')}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {defaultStageConfigs.map((cfg, idx) => {
          let stageStatus = 'pending';
          let stageDesc = cfg.defaultDesc;

          if (backendStages) {
            const match = backendStages.find(s => s.id === cfg.key) || backendStages[idx];
            if (match) {
              stageStatus = match.status;
              if (match.detail) stageDesc = match.detail;
            }
          } else {
            const isDone = pipelineStages[cfg.boolKey] === true;
            if (isDone) stageStatus = 'completed';
            else if (isScanning) stageStatus = idx === 0 ? 'running' : 'pending';
            else stageStatus = 'skipped';
          }

          // Styles according to status
          let cardBg = 'bg-secondary-bg/30 border-card-border/40 text-text-secondary opacity-70';
          let StatusIcon = Circle;
          let statusLabel = 'Pending';
          let statusBadgeClass = 'bg-card-bg text-text-secondary border-card-border';

          if (stageStatus === 'completed') {
            cardBg = 'bg-success/10 border-success/30 text-text-primary';
            StatusIcon = CheckCircle2;
            statusLabel = 'Completed';
            statusBadgeClass = 'bg-success/20 text-success border-success/40';
          } else if (stageStatus === 'skipped') {
            cardBg = 'bg-secondary-bg/25 border-card-border/40 text-text-secondary/70';
            StatusIcon = MinusCircle;
            statusLabel = 'Skipped';
            statusBadgeClass = 'bg-secondary-bg text-text-secondary/80 border-card-border';
          } else if (stageStatus === 'unavailable') {
            cardBg = 'bg-warning/10 border-warning/30 text-text-primary';
            StatusIcon = AlertTriangle;
            statusLabel = 'Unavailable';
            statusBadgeClass = 'bg-warning/20 text-warning border-warning/40';
          } else if (stageStatus === 'running') {
            cardBg = 'bg-primary/20 border-primary/50 text-cyan-accent animate-pulse';
            StatusIcon = Loader2;
            statusLabel = 'Running';
            statusBadgeClass = 'bg-cyan-accent/20 text-cyan-accent border-cyan-accent/40';
          } else if (stageStatus === 'failed') {
            cardBg = 'bg-danger/10 border-danger/30 text-danger';
            StatusIcon = XCircle;
            statusLabel = 'Failed';
            statusBadgeClass = 'bg-danger/20 text-danger border-danger/40';
          }

          return (
            <div
              key={cfg.key}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2 ${cardBg}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 font-medium text-xs">
                  <cfg.icon className="w-4 h-4 shrink-0 text-cyan-accent" />
                  <span className="font-semibold text-text-primary">{cfg.label}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${statusBadgeClass}`}>
                    {statusLabel}
                  </span>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-text-secondary font-mono">
                {stageDesc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
