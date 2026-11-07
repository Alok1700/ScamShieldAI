/**
 * Machine Learning Inference Service Client for ScamShield AI.
 * Communicates with the FastAPI scikit-learn classifier microservice.
 * Supports Text Phishing Classification & URL Threat ML Classification.
 * Implements strict timeouts and circuit-breaker behavior.
 */

const config = require('../../config');
const logger = require('../../utils/logger');

async function queryMlClassifier(text) {
  const startTime = Date.now();
  if (!text || text.trim().length === 0) {
    return {
      available: false,
      reason: 'Empty text provided for ML analysis'
    };
  }

  const endpoint = `${config.mlServiceUrl}/predict`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 sec timeout

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text.slice(0, 4000) }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      logger.warn({ status: response.status }, 'ML microservice returned non-200');
      return {
        available: false,
        reason: `ML service status: ${response.status}`
      };
    }

    const data = await response.json();
    return {
      available: true,
      isScam: data.is_scam,
      scamProbability: data.scam_probability,
      confidence: data.confidence,
      riskLevel: data.risk_level,
      indicativeTokens: data.indicative_tokens || [],
      latencyMs: Date.now() - startTime,
      modelVersion: data.model_version
    };
  } catch (err) {
    logger.warn({ err: err.message }, 'ML microservice text query failed or timed out');
    return {
      available: false,
      reason: 'ML service connection timed out or is offline',
      error: err.message
    };
  }
}

async function queryMlSmsClassifier(message) {
  const startTime = Date.now();
  if (!message || message.trim().length === 0) {
    return {
      available: false,
      reason: 'Empty message provided for SMS ML analysis'
    };
  }

  const endpoint = `${config.mlServiceUrl}/predict-sms`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 sec timeout

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message.slice(0, 4000) }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      logger.warn({ status: response.status }, 'ML microservice SMS endpoint returned non-200');
      return {
        available: false,
        reason: `ML SMS service status: ${response.status}`
      };
    }

    const data = await response.json();
    return {
      available: true,
      isScam: data.is_scam,
      scamProbability: data.scam_probability,
      confidence: data.confidence,
      riskLevel: data.risk_level,
      indicativeTokens: data.indicative_tokens || [],
      smsSignals: data.sms_signals || [],
      latencyMs: Date.now() - startTime,
      modelVersion: data.model_version
    };
  } catch (err) {
    logger.warn({ err: err.message }, 'ML microservice SMS query failed or timed out');
    return {
      available: false,
      reason: 'ML SMS service connection timed out or is offline',
      error: err.message
    };
  }
}

async function queryMlUrlClassifier(url) {
  const startTime = Date.now();
  if (!url || url.trim().length === 0) {
    return {
      available: false,
      reason: 'Empty URL provided for ML analysis'
    };
  }

  const endpoint = `${config.mlServiceUrl}/predict-url`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 sec timeout

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: url.trim().slice(0, 2000) }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      logger.warn({ status: response.status }, 'ML microservice URL endpoint returned non-200');
      return {
        available: false,
        reason: `ML URL service status: ${response.status}`
      };
    }

    const data = await response.json();
    return {
      available: true,
      isMalicious: data.is_malicious,
      scamProbability: data.scam_probability,
      confidence: data.confidence,
      riskLevel: data.risk_level,
      features: data.features || {},
      anomalies: data.anomalies || [],
      latencyMs: Date.now() - startTime,
      modelVersion: data.model_version
    };
  } catch (err) {
    logger.warn({ err: err.message }, 'ML microservice URL query failed or timed out');
    return {
      available: false,
      reason: 'ML URL service connection timed out or is offline',
      error: err.message
    };
  }
}

async function queryMlQrClassifier(payload) {
  const startTime = Date.now();
  if (!payload || payload.trim().length === 0) {
    return {
      available: false,
      reason: 'Empty QR payload provided for ML analysis'
    };
  }

  const endpoint = `${config.mlServiceUrl}/predict-qr`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 sec timeout

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ payload: payload.trim().slice(0, 4000) }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      logger.warn({ status: response.status }, 'ML microservice QR endpoint returned non-200');
      return {
        available: false,
        reason: `ML QR service status: ${response.status}`
      };
    }

    const data = await response.json();
    return {
      available: true,
      isMalicious: data.is_malicious,
      scamProbability: data.scam_probability,
      confidence: data.confidence,
      riskLevel: data.risk_level,
      payloadType: data.payload_type,
      features: data.features || {},
      anomalies: data.anomalies || [],
      quishingIndicators: data.quishing_indicators || [],
      latencyMs: Date.now() - startTime,
      modelVersion: data.model_version
    };
  } catch (err) {
    logger.warn({ err: err.message }, 'ML microservice QR query failed or timed out');
    return {
      available: false,
      reason: 'ML QR service connection timed out or is offline',
      error: err.message
    };
  }
}

async function checkMlHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const response = await fetch(`${config.mlServiceUrl}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

module.exports = {
  queryMlClassifier,
  queryMlSmsClassifier,
  queryMlUrlClassifier,
  queryMlQrClassifier,
  checkMlHealth
};
