import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api/v1` 
    : '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 45000 // 45s to allow OCR processing if large image
});

export const scanService = {
  scanText: async (text, consentToSave = false, language = 'en') => {
    const res = await api.post('/scan/text', { text, consentToSave, language });
    return res.data;
  },

  scanUrl: async (url, consentToSave = false, language = 'en') => {
    const res = await api.post('/scan/url', { url, consentToSave, language });
    return res.data;
  },

  scanImage: async (formData) => {
    const res = await api.post('/scan/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  scanQr: async (formData) => {
    const res = await api.post('/scan/qr', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  listScans: async () => {
    const res = await api.get('/scan');
    return res.data;
  },

  getScanById: async (id) => {
    const res = await api.get(`/scan/${id}`);
    return res.data;
  },

  deleteScan: async (id) => {
    const res = await api.delete(`/scan/${id}`);
    return res.data;
  },

  submitFeedback: async (id, feedbackType, comment) => {
    const res = await api.post(`/scan/${id}/feedback`, { feedbackType, comment });
    return res.data;
  },

  getHealth: async () => {
    const res = await api.get('/health');
    return res.data;
  },

  getModelEvaluations: async () => {
    const res = await api.get('/scan/model-evaluations');
    return res.data;
  },

  getReadiness: async () => {
    const res = await api.get('/ready');
    return res.data;
  }
};

export default api;
