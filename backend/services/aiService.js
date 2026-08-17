/**
 * AI Service Client
 * ==================
 * Proxies image prediction requests to the FastAPI AI microservice.
 * Uses form-data for multipart/form-data forwarding.
 */

const FormData = require("form-data");
const logger = require("../utils/logger");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";
const fetchFn = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

/**
 * Forward an image buffer to the FastAPI predict endpoint.
 *
 * @param {Buffer} imageBuffer - Raw image bytes from Multer memory storage
 * @param {string} originalName - Original filename
 * @param {string} mimeType - MIME type from Multer
 * @returns {Promise<object>} - { top3, modelVersion, processingTimeMs }
 */
const callAIService = async (imageBuffer, originalName, mimeType) => {
  const form = new FormData();
  form.append("image", imageBuffer, {
    filename: originalName || "upload.jpg",
    contentType: mimeType || "image/jpeg",
  });

  const url = `${AI_SERVICE_URL}/api/v1/predict`;
  logger.info(`Calling AI service: POST ${url} | file=${originalName} size=${imageBuffer.length}`);

  const startTime = Date.now();
  const response = await fetchFn(url, {
    method: "POST",
    body: form,
    headers: form.getHeaders(),
    signal: AbortSignal.timeout(60_000), // 60s timeout
  });

  const elapsed = Date.now() - startTime;

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ detail: "Unknown AI service error" }));
    const detail = typeof errorBody.detail === "object"
      ? errorBody.detail.message
      : errorBody.detail || "AI service error";
    logger.error(`AI service error ${response.status}: ${detail}`);
    throw Object.assign(new Error(detail), { statusCode: response.status });
  }

  const data = await response.json();
  logger.info(`AI service responded in ${elapsed}ms | top1=${data.top3?.[0]?.disease}`);
  return data;
};

module.exports = { callAIService };
