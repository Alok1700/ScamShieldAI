/**
 * In-memory storage repository fallback for ScamShield AI.
 * Ensures the platform functions out of the box even when MongoDB Atlas URI is unconfigured.
 */

class MemoryStore {
  constructor() {
    this.scans = new Map();
    this.feedback = [];
    this.audits = [];
    this.users = new Map();
  }

  saveScan(scanData) {
    const record = {
      ...scanData,
      _id: scanData.scanId,
      createdAt: new Date().toISOString()
    };
    this.scans.set(scanData.scanId, record);
    return record;
  }

  getScan(scanId) {
    return this.scans.get(scanId) || null;
  }

  listScans(limit = 20) {
    const all = Array.from(this.scans.values());
    all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return all.slice(0, limit);
  }

  deleteScan(scanId) {
    return this.scans.delete(scanId);
  }

  saveFeedback(data) {
    const record = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() };
    this.feedback.push(record);
    return record;
  }

  saveAudit(data) {
    const record = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() };
    this.audits.push(record);
    return record;
  }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;
