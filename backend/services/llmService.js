/**
 * LLM Service — Provider-Agnostic Medical Report Generator
 * ==========================================================
 * Supports Gemini and OpenAI through a unified interface.
 * Switch providers by setting LLM_PROVIDER=gemini|openai in .env.
 * No application code changes needed to switch providers.
 *
 * Active provider: Gemini 2.5 Flash (default)
 */

const logger = require("../utils/logger");

// ---------------------------------------------------------------------------
// Provider implementations
// ---------------------------------------------------------------------------

/**
 * Gemini provider using fetch (no SDK dependency overhead).
 */
const GeminiProvider = {
  name: "gemini",
  model: process.env.GEMINI_MODEL || "gemini-2.5-flash",

  async generateReport(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,      // Low temperature for medical accuracy
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Gemini API error: ${response.status} — ${errorData?.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Gemini returned an empty response.");
    return text;
  },
};

/**
 * OpenAI provider (drop-in replacement for Gemini).
 */
const OpenAIProvider = {
  name: "openai",
  model: process.env.OPENAI_MODEL || "gpt-4o-mini",

  async generateReport(prompt) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: "system",
            content:
              "You are a professional medical AI assistant specializing in dermatology. " +
              "Provide accurate, helpful, and compassionate medical information. " +
              "Always include appropriate disclaimers.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenAI API error: ${response.status} — ${errorData?.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error("OpenAI returned an empty response.");
    return text;
  },
};

// ---------------------------------------------------------------------------
// Provider factory
// ---------------------------------------------------------------------------

const PROVIDERS = { gemini: GeminiProvider, openai: OpenAIProvider };

const getProvider = () => {
  const providerName = (process.env.LLM_PROVIDER || "gemini").toLowerCase();
  const provider = PROVIDERS[providerName];
  if (!provider) {
    throw new Error(
      `Unknown LLM_PROVIDER: '${providerName}'. Valid options: gemini, openai`
    );
  }
  return provider;
};

// ---------------------------------------------------------------------------
// Report prompt builder
// ---------------------------------------------------------------------------

const buildMedicalReportPrompt = (predictionData, questionnaire) => {
  const { top3, primaryDisease, primaryConfidence } = predictionData;

  const top3Text = top3
    .map((p) => `  ${p.rank}. ${p.disease} — ${p.confidence.toFixed(1)}% confidence`)
    .join("\n");

  const q = questionnaire || {};

  return `
You are an expert AI dermatologist assistant. Based on the AI analysis results and patient information below, generate a comprehensive medical skin disease report in JSON format.

## AI MODEL ANALYSIS RESULTS
Primary Prediction: ${primaryDisease} (${primaryConfidence.toFixed(1)}% confidence)
Top 3 Predictions:
${top3Text}

## PATIENT INFORMATION
- Age: ${q.age || "Not provided"}
- Gender: ${q.gender || "Not provided"}
- Affected Body Part: ${q.affectedBodyPart || "Not provided"}
- Duration of Condition: ${q.duration || "Not provided"}

## REPORTED SYMPTOMS
- Pain: ${q.pain || "Not reported"}
- Itching: ${q.itching || "Not reported"}
- Burning Sensation: ${q.burning || "Not reported"}
- Bleeding: ${q.bleeding || "Not reported"}
- Swelling: ${q.swelling || "Not reported"}
- Fever: ${q.fever || "Not reported"}
- Other Symptoms: ${q.otherSymptoms || "None"}

## MEDICAL HISTORY
- Family History of Skin Disease: ${q.familyHistory || "Not reported"}
- Previous Skin Diseases: ${q.previousSkinDisease || "None"}
- Current Medications: ${q.currentMedications || "None"}
- Diabetes: ${q.diabetes || "No"}
- Immune Disorder: ${q.immuneDisorder || "No"}
- Pregnancy: ${q.pregnancy || "No"}

## INSTRUCTIONS
Generate a detailed medical report as a valid JSON object with EXACTLY these fields:
{
  "predictedDisease": "string — primary predicted disease name",
  "top3Diseases": [{"disease": "string", "confidence": number, "rank": number}],
  "confidenceScore": number,
  "symptomsSummary": "string — 2-3 sentences summarizing reported symptoms",
  "possibleCauses": "string — 3-5 possible causes based on disease and patient info",
  "imageFindings": "string — describe what the AI model likely detected in the image",
  "riskLevel": "Low|Moderate|High|Critical",
  "recommendedActions": "string — 4-6 specific recommended actions",
  "lifestyleSuggestions": "string — 3-5 lifestyle modifications",
  "whenToConsultDermatologist": "string — specific warning signs requiring immediate attention",
  "disclaimer": "This AI analysis is for informational purposes only and does not constitute medical advice. Please consult a licensed dermatologist or healthcare professional for proper diagnosis and treatment."
}

Return ONLY the JSON object. No markdown code blocks. No extra text. Pure JSON.
`.trim();
};

// ---------------------------------------------------------------------------
// Parse LLM JSON response
// ---------------------------------------------------------------------------

const parseLLMResponse = (rawText) => {
  // Strip potential markdown code blocks
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  return JSON.parse(cleaned);
};

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Generate a medical report using the configured LLM provider.
 *
 * @param {object} predictionData - { top3, primaryDisease, primaryConfidence }
 * @param {object} questionnaire - Patient questionnaire answers
 * @returns {object} - Structured report data
 */
const generateMedicalReport = async (predictionData, questionnaire) => {
  const provider = getProvider();
  const startTime = Date.now();

  logger.info(`Generating medical report via ${provider.name} (${provider.model})`);

  const prompt = buildMedicalReportPrompt(predictionData, questionnaire);

  let rawResponse;
  try {
    rawResponse = await provider.generateReport(prompt);
  } catch (err) {
    logger.error(`LLM provider error [${provider.name}]: ${err.message}`);
    throw err;
  }

  let parsed;
  try {
    parsed = parseLLMResponse(rawResponse);
  } catch (err) {
    logger.error(`Failed to parse LLM JSON response: ${err.message}`);
    logger.debug(`Raw LLM response: ${rawResponse.substring(0, 500)}...`);
    throw new Error("LLM returned an invalid JSON response. Please try again.");
  }

  const generationTimeMs = Date.now() - startTime;
  logger.info(
    `Report generated in ${generationTimeMs}ms | Risk: ${parsed.riskLevel} | Provider: ${provider.name}`
  );

  return {
    ...parsed,
    rawResponse,
    llmProvider: provider.name,
    llmModel: provider.model,
    generationTimeMs,
  };
};

module.exports = { generateMedicalReport };
