import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Globe, Image, QrCode, ShieldAlert, Sparkles, AlertCircle, Upload, Check, RefreshCw, X, Cpu } from 'lucide-react';
import { useScanStore } from '../store/scanStore';
import { scanService } from '../services/api';
import ThreatIntelligencePanel from '../components/ThreatIntelligencePanel';
import { t } from '../utils/i18n';
import toast from 'react-hot-toast';

export default function ScannerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    activeTab,
    setActiveTab,
    language,
    consentToSave,
    setConsentToSave,
    isScanning,
    setIsScanning,
    pipelineStatus,
    setPipelineStage,
    resetPipeline,
    setCurrentReport
  } = useScanStore();

  // Inputs
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [manualOcrText, setManualOcrText] = useState('');

  // Handle incoming preset from LandingPage or AwarenessHub
  useEffect(() => {
    if (location.state?.presetText) {
      if (location.state.presetTab) {
        setActiveTab(location.state.presetTab);
      }
      if (location.state.presetTab === 'url') {
        setUrlInput(location.state.presetText);
      } else {
        setTextInput(location.state.presetText);
      }
    }
  }, [location.state, setActiveTab]);

  const samplePresetsData = {
    en: [
      {
        tab: 'message',
        label: 'SBI Bank KYC Phish',
        text: 'Dear customer, your SBI account is temporarily suspended. Submit OTP and PAN information immediately at https://sbi-kyc-security.example'
      },
      {
        tab: 'message',
        label: 'Electricity Power Cut SMS',
        text: 'Dear consumer, your electricity power will be disconnected tonight at 9:30 PM from the electricity office because your previous month bill was not updated. Please immediately contact our electricity officer at 9876543210. Thank you.'
      },
      {
        tab: 'message',
        label: 'Telegram Task Job Scam',
        text: 'Earn Rs 3,000 - 8,000 daily by working from home! Just like YouTube videos and write reviews on Google Maps. No experience needed. Join our Telegram channel: https://t.me/parttime_job_official'
      },
      {
        tab: 'message',
        label: 'UPI Cashback PIN Trap',
        text: 'You have received a payment of Rs 10,000 from PayTM Cashback. Scan this QR code and enter your UPI PIN to claim your refund directly into your bank.'
      },
      {
        tab: 'message',
        label: 'Legitimate Bank Alert (Low Risk)',
        text: 'Dear Customer, INR 5,000.00 credited to your A/C XX1234 on 05-Nov-2026 by NEFT. Available balance is INR 28,450.50. - State Bank of India'
      },
      {
        tab: 'url',
        label: 'HDFC Spoofed Domain',
        text: 'http://hdfc-update-portal.example/login'
      },
      {
        tab: 'url',
        label: 'Botnet Dropper IP (ML Dataset)',
        text: 'http://27.202.109.19:33886/i'
      },
      {
        tab: 'url',
        label: 'Malicious Payload .exe (ML Dataset)',
        text: 'http://playd.healthnlife.pk/prog/66f6fb069f739_sgsfdgsda.exe'
      },
      {
        tab: 'url',
        label: 'QR Malicious Payload (10,000 QR Dataset)',
        text: 'http://malw.esalesin.com/yuop/66cf5fb9ac3ce_xin.exe'
      },
      {
        tab: 'url',
        label: 'QR Mozi Botnet (10,000 QR Dataset)',
        text: 'http://222.141.138.234:56620/Mozi.m'
      },
      {
        tab: 'url',
        label: 'Legitimate Domain (ML Dataset)',
        text: 'https://www.onezoom.org'
      },
      {
        tab: 'url',
        label: 'Punycode Spoofing Link',
        text: 'https://xn--appl-43d.com/login-verify'
      }
    ],
    hi: [
      {
        tab: 'message',
        label: 'SBI बैंक KYC फ़िशिंग जाल',
        text: 'प्रिय ग्राहक, आपका SBI खाता अस्थायी रूप से निलंबित कर दिया गया है। तुरंत https://sbi-kyc-security.example पर जाकर OTP और पैन दर्ज करें।'
      },
      {
        tab: 'message',
        label: 'बिजली कनेक्शन काटने का SMS',
        text: 'प्रिय उपभोक्ता, पिछले महीने का बिल अपडेट न होने के कारण आज रात 9:30 बजे बिजली काट दी जाएगी। तुरंत हमारे बिजली अधिकारी 9876543210 से संपर्क करें। धन्यवाद।'
      },
      {
        tab: 'message',
        label: 'टेलीग्राम पार्ट-टाइम जॉब घोटाला',
        text: 'घर बैठे रोजाना 3,000 - 8,000 रुपये कमाएं! यूट्यूब वीडियो लाइक करें और गूगल मैप्स पर रिव्यू दें। हमारे टेलीग्राम से जुड़ें: https://t.me/parttime_job_official'
      },
      {
        tab: 'message',
        label: 'UPI कैशबैक पिन जाल',
        text: 'आपको PayTM कैशबैक से 10,000 रुपये प्राप्त हुए हैं। पैसे सीधे बैंक में पाने के लिए QR कोड स्कैन करें और अपना UPI पिन डालें।'
      },
      {
        tab: 'message',
        label: 'प्रामाणिक बैंक सूचना (सुरक्षित)',
        text: 'प्रिय ग्राहक, INR 5,000.00 आपके खाते XX1234 में NEFT द्वारा 05-Nov-2026 को जमा किए गए। उपलब्ध शेष राशि INR 28,450.50 है। - भारतीय स्टेट बैंक'
      },
      {
        tab: 'url',
        label: 'HDFC फर्जी स्पूफ डोमेन',
        text: 'http://hdfc-update-portal.example/login'
      },
      {
        tab: 'url',
        label: 'बॉटनेट आईपी (ML डेटासेट)',
        text: 'http://27.202.109.19:33886/i'
      },
      {
        tab: 'url',
        label: 'दुर्भावनापूर्ण .exe पेलोड',
        text: 'http://playd.healthnlife.pk/prog/66f6fb069f739_sgsfdgsda.exe'
      },
      {
        tab: 'url',
        label: 'QR दुर्भावनापूर्ण पेलोड (10,000 QR डेटासेट)',
        text: 'http://malw.esalesin.com/yuop/66cf5fb9ac3ce_xin.exe'
      },
      {
        tab: 'url',
        label: 'QR मोज़ी बॉटनेट्स (10,000 QR डेटासेट)',
        text: 'http://222.141.138.234:56620/Mozi.m'
      },
      {
        tab: 'url',
        label: 'प्रामाणिक सुरक्षित डोमेन',
        text: 'https://www.onezoom.org'
      },
      {
        tab: 'url',
        label: 'प्यूनिकोड लुकअलाइक लिंक',
        text: 'https://xn--appl-43d.com/login-verify'
      }
    ]
  };

  const samplePresets = samplePresetsData[language] || samplePresetsData.en;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t('scanner.errorFileLimit', language));
        return;
      }
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setManualOcrText('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t('scanner.errorFileLimit', language));
        return;
      }
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setManualOcrText('');
    }
  };

  const clearCurrentInput = () => {
    setTextInput('');
    setUrlInput('');
    setSelectedFile(null);
    setFilePreview(null);
    setManualOcrText('');
  };

  const handleRunDemo = async (demo) => {
    setActiveTab('message');
    setTextInput(demo.text);
    setIsScanning(true);
    resetPipeline();
    setPipelineStage('contentExtracted', true);
    try {
      const report = await scanService.scanText(demo.text, false, language);
      if (report?.pipelineStages) {
        Object.entries(report.pipelineStages).forEach(([k, v]) => {
          setPipelineStage(k, v);
        });
      }
      setCurrentReport(report);
      toast.success(language === 'hi' ? 'डेमो विश्लेषण पूर्ण!' : 'Demo analysis completed!');
      navigate('/results');
    } catch (err) {
      toast.error('Demo execution failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsScanning(false);
    }
  };

  const executeScan = async () => {
    setIsScanning(true);
    resetPipeline();

    try {
      let report = null;

      // STAGE 1: Content Extraction
      setPipelineStage('contentExtracted', true);

      if (activeTab === 'message') {
        if (!textInput.trim()) {
          toast.error(t('scanner.errorNoText', language));
          setIsScanning(false);
          return;
        }
        report = await scanService.scanText(textInput, consentToSave, language);
      } else if (activeTab === 'url') {
        if (!urlInput.trim()) {
          toast.error(t('scanner.errorNoUrl', language));
          setIsScanning(false);
          return;
        }
        report = await scanService.scanUrl(urlInput, consentToSave, language);
      } else if (activeTab === 'screenshot') {
        if (!selectedFile && !manualOcrText.trim()) {
          toast.error(t('scanner.errorNoFile', language));
          setIsScanning(false);
          return;
        }
        const formData = new FormData();
        if (selectedFile) formData.append('image', selectedFile);
        if (manualOcrText) formData.append('manualText', manualOcrText);
        formData.append('consentToSave', consentToSave);
        formData.append('language', language);

        report = await scanService.scanImage(formData);
      } else if (activeTab === 'qr') {
        if (!selectedFile) {
          toast.error(t('scanner.errorNoQr', language));
          setIsScanning(false);
          return;
        }
        const formData = new FormData();
        formData.append('qrImage', selectedFile);
        formData.append('consentToSave', consentToSave);
        formData.append('language', language);

        report = await scanService.scanQr(formData);
      }

      // Update remaining pipeline stages from backend response
      if (report?.pipelineStages) {
        Object.entries(report.pipelineStages).forEach(([k, v]) => {
          setPipelineStage(k, v);
        });
      }

      setCurrentReport(report);
      toast.success(language === 'hi' ? 'विश्लेषण सफलतापूर्वक पूर्ण हुआ' : 'Analysis completed successfully');
      navigate('/results');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Scan failed';
      toast.error(msg);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-text-primary tracking-tight">
          {t('scanner.title', language)}
        </h1>
        <p className="mt-2 text-sm text-text-secondary max-w-xl mx-auto">
          {t('scanner.subtitle', language)}
        </p>
      </div>

      {/* Explore ScamShield AI Demo (Hackathon Judge Mode) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-card-bg via-primary/10 to-card-bg border border-cyan-accent/30 shadow-cyber space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-accent animate-pulse" />
            <h3 className="text-xs sm:text-sm font-bold font-mono text-text-primary uppercase tracking-wider">
              {language === 'hi' ? 'ScamShield AI डेमो एक्सप्लोर करें (हैकथॉन जज मोड)' : 'Explore ScamShield AI Demo (Hackathon Judge Mode)'}
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-accent bg-cyan-accent/10 px-2.5 py-0.5 rounded-full border border-cyan-accent/20">
            Real In-Memory Pipeline Execution
          </span>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          {language === 'hi'
            ? 'बिना किसी लॉगिन के वास्तविक ML मॉडल अनुमान और किल-चेन विश्लेषण का परीक्षण करने के लिए नीचे दिए गए 3 मुख्य डेमो परिदृश्यों पर 1-क्लिक करें:'
            : 'Execute real scikit-learn ML inference, regex heuristics, and scam kill-chain reconstruction across 3 realistic synthetic test scenarios in 1-click:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <button
            onClick={() => handleRunDemo({
              text: 'Your electricity connection will be disconnected tonight. Clear your pending bill immediately using https://power-bill-verify.example.',
              label: 'Demo 1: Fake Electricity Disconnection'
            })}
            disabled={isScanning}
            className="p-3.5 rounded-xl bg-card-bg/90 hover:bg-secondary-bg border border-danger/30 hover:border-danger/60 transition-all text-left space-y-1 group cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold text-danger">
              <span>Demo 1: Electricity Scam</span>
              <span className="text-[10px] opacity-70 group-hover:opacity-100">&rarr;</span>
            </div>
            <p className="text-[11px] text-text-secondary line-clamp-2">
              "Your electricity connection will be disconnected tonight..."
            </p>
          </button>

          <button
            onClick={() => handleRunDemo({
              text: 'Congratulations! You have won ₹2,000 cashback. Scan the QR code and enter your UPI PIN to receive your reward.',
              label: 'Demo 2: UPI Cashback Trap'
            })}
            disabled={isScanning}
            className="p-3.5 rounded-xl bg-card-bg/90 hover:bg-secondary-bg border border-warning/30 hover:border-warning/60 transition-all text-left space-y-1 group cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold text-warning">
              <span>Demo 2: UPI PIN Trap</span>
              <span className="text-[10px] opacity-70 group-hover:opacity-100">&rarr;</span>
            </div>
            <p className="text-[11px] text-text-secondary line-clamp-2">
              "Congratulations! You won ₹2,000 cashback. Enter UPI PIN to claim..."
            </p>
          </button>

          <button
            onClick={() => handleRunDemo({
              text: 'INR 25,000 credited to your bank account via NEFT. Reference: DEMO12345.',
              label: 'Demo 3: Legitimate Bank Notification'
            })}
            disabled={isScanning}
            className="p-3.5 rounded-xl bg-card-bg/90 hover:bg-secondary-bg border border-success/30 hover:border-success/60 transition-all text-left space-y-1 group cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold text-success">
              <span>Demo 3: Legitimate Bank Notice</span>
              <span className="text-[10px] opacity-70 group-hover:opacity-100">&rarr;</span>
            </div>
            <p className="text-[11px] text-text-secondary line-clamp-2">
              "INR 25,000 credited to bank account via NEFT. Reference: DEMO12345."
            </p>
          </button>
        </div>
      </div>

      {/* Primary Scanner Tabs */}
      <div className="flex border-b border-card-border overflow-x-auto gap-2">
        {[
          { id: 'message', label: t('scanner.tabMessage', language), icon: FileText },
          { id: 'url', label: t('scanner.tabUrl', language), icon: Globe },
          { id: 'screenshot', label: t('scanner.tabScreenshot', language), icon: Image },
          { id: 'qr', label: t('scanner.tabQr', language), icon: QrCode }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                clearCurrentInput();
              }}
              className={`px-4 py-3 text-sm font-medium transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'border-cyan-accent text-cyan-accent bg-card-bg/60 rounded-t-lg'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-card-bg/30'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Scanner Input Card */}
      <div className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-cyber space-y-6">
        {/* Tab 1: Message Scanner */}
        {activeTab === 'message' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>{t('scanner.pasteLabel', language)}</span>
              <span className="font-mono">{textInput.length} / 10,000 {t('scanner.chars', language)}</span>
            </div>
            <textarea
              rows={6}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t('scanner.pastePlaceholder', language)}
              className="w-full bg-secondary-bg/80 border border-card-border rounded-xl p-4 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-cyan-accent font-sans leading-relaxed resize-y"
            />
          </div>
        )}

        {/* Tab 2: URL Scanner */}
        {activeTab === 'url' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>{t('scanner.urlLabel', language)}</span>
              <span className="font-mono text-cyan-accent">{t('scanner.zeroOutbound', language)}</span>
            </div>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={t('scanner.urlPlaceholder', language)}
                className="w-full bg-secondary-bg/80 border border-card-border rounded-xl pl-12 pr-4 py-3.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-cyan-accent font-mono"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Screenshot Scanner */}
        {activeTab === 'screenshot' && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-card-border hover:border-cyan-accent/50 rounded-2xl p-8 text-center transition-all bg-secondary-bg/40 cursor-pointer"
            >
              <input
                type="file"
                id="screenshot-upload"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="screenshot-upload" className="cursor-pointer space-y-2 block">
                <div className="w-12 h-12 rounded-xl bg-primary/20 text-cyan-accent flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-text-primary">
                  {selectedFile ? selectedFile.name : t('scanner.uploadPrompt', language)}
                </p>
                <p className="text-xs text-text-secondary">
                  {t('scanner.uploadHint', language)}
                </p>
              </label>
            </div>

            {filePreview && (
              <div className="p-4 rounded-xl bg-secondary-bg/60 border border-card-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={filePreview} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-card-border" />
                  <div>
                    <span className="text-xs font-semibold text-text-primary">{selectedFile?.name}</span>
                    <p className="text-[11px] text-text-secondary font-mono">{(selectedFile?.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedFile(null); setFilePreview(null); }}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-card-bg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Optional Manual Text Override */}
            <div className="space-y-1">
              <label className="text-xs text-text-secondary">
                {t('scanner.manualOcrLabel', language)}
              </label>
              <textarea
                rows={3}
                value={manualOcrText}
                onChange={(e) => setManualOcrText(e.target.value)}
                placeholder={t('scanner.manualOcrPlaceholder', language)}
                className="w-full bg-secondary-bg/50 border border-card-border rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:border-cyan-accent font-sans"
              />
            </div>
          </div>
        )}

        {/* Tab 4: QR Scanner */}
        {activeTab === 'qr' && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-card-border hover:border-cyan-accent/50 rounded-2xl p-8 text-center transition-all bg-secondary-bg/40 cursor-pointer"
            >
              <input
                type="file"
                id="qr-upload"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="qr-upload" className="cursor-pointer space-y-2 block">
                <div className="w-12 h-12 rounded-xl bg-cyan-accent/20 text-cyan-accent flex items-center justify-center mx-auto">
                  <QrCode className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-text-primary">
                  {selectedFile ? selectedFile.name : t('scanner.qrUploadPrompt', language)}
                </p>
                <p className="text-xs text-text-secondary">
                  {t('scanner.qrUploadHint', language)}
                </p>
              </label>
            </div>

            {filePreview && (
              <div className="p-4 rounded-xl bg-secondary-bg/60 border border-card-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={filePreview} alt="QR Preview" className="w-14 h-14 object-cover rounded-lg border border-card-border" />
                  <div>
                    <span className="text-xs font-semibold text-text-primary">{selectedFile?.name}</span>
                    <p className="text-[11px] text-text-secondary font-mono">{(selectedFile?.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedFile(null); setFilePreview(null); }}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-card-bg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* 10,000 QR Code Dataset ML Protection Badge */}
            <div className="p-3 rounded-xl bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-between text-xs font-mono text-cyan-accent">
              <span className="flex items-center gap-1.5 font-semibold">
                <Cpu className="w-3.5 h-3.5" />
                {language === 'hi' ? '10,000 QR पेलोड थ्रेट ML मॉडल द्वारा संचालित (99.7% सटीकता)' : 'Powered by 10,000 QR Payload Threat ML Classifier (99.7% Accuracy)'}
              </span>
              <span className="text-[10px] bg-cyan-accent/20 px-2 py-0.5 rounded border border-cyan-accent/40 font-bold">
                Quishing Defense
              </span>
            </div>

            {/* UPI Educational Disclaimer */}
            <div className="p-3.5 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-2.5 text-xs text-warning">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{t('scanner.upiNotice', language)}</span>
            </div>
          </div>
        )}

        {/* Options & Action Row */}
        <div className="pt-4 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-text-secondary select-none">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span>{t('scanner.privacyNote', language)}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={clearCurrentInput}
              disabled={isScanning}
              className="px-4 py-2.5 rounded-xl bg-secondary-bg hover:bg-card-border text-text-secondary text-xs font-medium transition-colors"
            >
              {t('scanner.clearBtn', language)}
            </button>
            <button
              onClick={executeScan}
              disabled={isScanning}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-cyan-accent hover:from-primary-hover hover:to-cyan-accent/90 text-white font-semibold text-sm shadow-cyber transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>{t('scanner.scanningBtn', language)}</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>{t('scanner.scanBtn', language)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preset Test Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-text-secondary uppercase">{t('scanner.samplesTitle', language)}:</span>
        <div className="flex flex-wrap gap-2">
          {samplePresets
            .filter((p) => p.tab === activeTab || (activeTab !== 'url' && p.tab === 'message'))
            .map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (activeTab === 'url') setUrlInput(p.text);
                  else setTextInput(p.text);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-card-bg border border-card-border text-text-secondary hover:text-cyan-accent hover:border-cyan-accent/40 transition-colors"
              >
                + {p.label}
              </button>
            ))}
        </div>
      </div>

      {/* Threat Intelligence Pipeline Status */}
      <ThreatIntelligencePanel pipelineStages={pipelineStatus} isScanning={isScanning} />
    </div>
  );
}
