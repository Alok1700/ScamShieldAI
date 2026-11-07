import { create } from 'zustand';

const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('scamshield_language');
      if (saved && ['en', 'hi'].includes(saved)) {
        document.documentElement.lang = saved;
        return saved;
      }
    } catch {
      // Ignore localStorage errors
    }
  }
  return 'en';
};

export const useScanStore = create((set, get) => ({
  activeTab: 'message', // 'message', 'url', 'screenshot', 'qr'
  language: getInitialLanguage(), // 'en', 'hi'
  consentToSave: false,
  isScanning: false,
  currentReport: null,
  error: null,
  
  // Pipeline animation stages during scan
  pipelineStatus: {
    contentExtracted: false,
    urlsIdentified: false,
    rulesApplied: false,
    mlClassifierRun: false,
    threatIntelChecked: false,
    explanationGenerated: false
  },

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setLanguage: (lang) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('scamshield_language', lang);
        document.documentElement.lang = lang;
      } catch {
        // Ignore localStorage errors
      }
    }
    set({ language: lang });
  },
  setConsentToSave: (consent) => set({ consentToSave: consent }),
  setCurrentReport: (report) => set({ currentReport: report, error: null }),
  clearReport: () => set({ currentReport: null, error: null }),
  setError: (err) => set({ error: err, isScanning: false }),
  setIsScanning: (scanning) => set({ isScanning: scanning }),

  setPipelineStage: (stage, value) => set((state) => ({
    pipelineStatus: { ...state.pipelineStatus, [stage]: value }
  })),

  resetPipeline: () => set({
    pipelineStatus: {
      contentExtracted: false,
      urlsIdentified: false,
      rulesApplied: false,
      mlClassifierRun: false,
      threatIntelChecked: false,
      explanationGenerated: false
    }
  })
}));
