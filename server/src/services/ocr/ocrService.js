/**
 * OCR Text Extraction Service for ScamShield AI.
 * Powered by Tesseract.js running in memory.
 * Raw screenshots are never permanently persisted without explicit user consent.
 */

const Tesseract = require('tesseract.js');
const logger = require('../../utils/logger');

async function extractTextFromImageBuffer(buffer, mimeType) {
  const startTime = Date.now();
  try {
    logger.info({ mimeType, bufferSize: buffer.length }, 'Initiating OCR text extraction');

    // Run recognition on image buffer
    const result = await Tesseract.recognize(
      buffer,
      'eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing text' && m.progress % 0.5 === 0) {
            logger.debug({ progress: m.progress }, 'OCR recognizing');
          }
        }
      }
    );

    const extractedText = (result.data.text || '').trim();
    const confidence = typeof result.data.confidence === 'number' ? result.data.confidence : null;
    const durationMs = Date.now() - startTime;

    logger.info({ durationMs, confidence, textLength: extractedText.length }, 'OCR extraction finished');

    return {
      success: true,
      extractedText,
      confidence,
      durationMs,
      error: null
    };
  } catch (error) {
    logger.error({ err: error.message }, 'OCR text extraction failed');
    return {
      success: false,
      extractedText: '',
      confidence: null,
      durationMs: Date.now() - startTime,
      error: 'Failed to extract text from the uploaded screenshot. You can manually enter or edit the text for analysis.'
    };
  }
}

module.exports = {
  extractTextFromImageBuffer
};
