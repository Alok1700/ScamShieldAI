/**
 * QR Code Decoder & UPI Protocol Analyzer for ScamShield AI.
 * 
 * Uses Jimp to normalize image bitmap and jsQR to decode payload.
 * Parses UPI payment URIs (upi://pay?pa=...&pn=...&am=...&cu=INR)
 * Explicitly educates users that scanning a UPI QR code or entering a PIN 
 * DEBITS funds from their account and CANNOT be used to receive refunds.
 */

const Jimp = require('jimp');
const jsQR = require('jsqr');
const logger = require('../../utils/logger');

/**
 * Parses UPI parameters from a upi://pay URI
 */
function parseUpiUri(uri) {
  try {
    const urlObj = new URL(uri);
    if (urlObj.protocol !== 'upi:') return null;

    const params = new URLSearchParams(urlObj.search);
    const payeeVpa = params.get('pa') || '';
    const payeeName = params.get('pn') || '';
    const amount = params.get('am') || null;
    const currency = params.get('cu') || 'INR';
    const transactionNote = params.get('tn') || '';
    const merchantCode = params.get('mc') || '';

    return {
      payeeVpa,
      payeeName,
      amount,
      currency,
      transactionNote,
      merchantCode,
      rawUri: uri
    };
  } catch {
    return null;
  }
}

/**
 * Decodes QR code from buffer and analyzes payload
 */
async function decodeAndAnalyzeQrBuffer(buffer) {
  const startTime = Date.now();
  try {
    const image = await Jimp.read(buffer);
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const imageData = new Uint8ClampedArray(image.bitmap.data);

    const qrCode = jsQR(imageData, width, height, {
      inversionAttempts: 'attemptBoth'
    });

    if (!qrCode || !qrCode.data) {
      return {
        success: false,
        error: 'No valid QR code could be detected in the provided image. Please ensure the QR code is clear, well-lit, and uncropped.',
        durationMs: Date.now() - startTime
      };
    }

    const rawData = qrCode.data.trim();
    logger.info({ rawLength: rawData.length }, 'QR code successfully decoded');

    // Categorize payload
    let payloadType = 'text';
    let upiDetails = null;
    let detectedUrl = null;
    const signals = [];

    if (rawData.startsWith('upi://pay')) {
      payloadType = 'upi_payment';
      upiDetails = parseUpiUri(rawData);

      // UPI Security Warning Signal
      signals.push({
        type: 'upi_payment_payload',
        severity: 'medium',
        evidence: `Payee: ${upiDetails.payeeName || 'Unknown'} (${upiDetails.payeeVpa})${upiDetails.amount ? `, Amount: Rs ${upiDetails.amount}` : ''}`,
        explanation: 'CRITICAL SECURITY NOTICE: Scanning this QR code initiates a PAYMENT (money transfer OUT of your account). Scanning a QR code or typing your UPI PIN can NEVER receive money or process a cashback.',
        source: 'qr_upi_analyzer'
      });
    } else if (/^https?:\/\//i.test(rawData) || /^(www\.)/i.test(rawData)) {
      payloadType = 'url';
      detectedUrl = rawData;
    } else if (/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(rawData)) {
      payloadType = 'upi_vpa';
      signals.push({
        type: 'upi_vpa_address',
        severity: 'low',
        evidence: rawData,
        explanation: 'Decoded QR contains a direct UPI VPA address. Sending funds to this address will debit your account.',
        source: 'qr_analyzer'
      });
    }

    return {
      success: true,
      payloadType,
      decodedData: rawData,
      upiDetails,
      detectedUrl,
      signals,
      durationMs: Date.now() - startTime
    };
  } catch (err) {
    logger.error({ err: err.message }, 'Failed to process QR image buffer');
    return {
      success: false,
      error: `Error decoding QR code: ${err.message}`,
      durationMs: Date.now() - startTime
    };
  }
}

module.exports = {
  decodeAndAnalyzeQrBuffer,
  parseUpiUri
};
