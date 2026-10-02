/**
 * LLM Service — Provider-Agnostic Medical Report Generator
 * ==========================================================
 * Supports Groq, Gemini, and OpenAI through a unified interface.
 * Switch providers by setting LLM_PROVIDER=groq|gemini|openai in .env.
 * No application code changes needed to switch providers.
 *
 * Active provider: Groq (preferred when configured)
 */

const logger = require("../utils/logger");

const resolveGeminiModel = () => {
  const rawModel = (process.env.GEMINI_MODEL || "gemini-2.0-flash").trim();
  const normalized = rawModel.replace(/^models\//i, "");

  const retiredModels = new Set([
    "gemini-2.5-flash",
    "gemini-2.5-flash-preview",
    "gemini-2.5-flash-lite",
    "gemini-2.5-pro",
    "gemini-2.5-pro-preview",
  ]);

  if (retiredModels.has(normalized)) {
    logger.warn(
      `GEMINI_MODEL='${rawModel}' is no longer available for new users. Falling back to 'gemini-2.0-flash'.`
    );
    return "gemini-2.0-flash";
  }

  return normalized || "gemini-2.0-flash";
};

// ---------------------------------------------------------------------------
// Provider implementations
// ---------------------------------------------------------------------------

/**
 * Gemini provider using fetch (no SDK dependency overhead).
 */
const GeminiProvider = {
  name: "gemini",
  model: resolveGeminiModel(),

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

/**
 * Groq provider using the OpenAI-compatible chat completions API.
 */
const GroqProvider = {
  name: "groq",
  model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",

  async generateReport(prompt) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is not configured.");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Groq API error: ${response.status} — ${errorData?.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error("Groq returned an empty response.");
    return text;
  },
};

// ---------------------------------------------------------------------------
// Provider factory
// ---------------------------------------------------------------------------

const PROVIDERS = { gemini: GeminiProvider, openai: OpenAIProvider, groq: GroqProvider };

const getProvider = () => {
  const providerName = (process.env.LLM_PROVIDER || "auto").toLowerCase();

  if (providerName === "auto") {
    if (process.env.GROQ_API_KEY) return PROVIDERS.groq;
    if (process.env.OPENAI_API_KEY) return PROVIDERS.openai;
    if (process.env.GEMINI_API_KEY) return PROVIDERS.gemini;
    throw new Error("No LLM provider API key is configured. Set GROQ_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY.");
  }

  const provider = PROVIDERS[providerName];
  if (!provider) {
    throw new Error(
      `Unknown LLM_PROVIDER: '${providerName}'. Valid options: groq, gemini, openai, auto`
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
  if (typeof rawText !== "string") {
    throw new Error("LLM response is not a string.");
  }

  let cleaned = rawText.trim();

  // Groq / reasoning models may prefix JSON with <think>...</think>
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  // Strip potential markdown code blocks
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  // Extract the first valid JSON object if the model wrapped it in extra commentary
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
  }

  return JSON.parse(cleaned);
};

const buildFallbackReport = (predictionData, questionnaire) => {
  const { top3 = [], primaryDisease = "Skin condition", primaryConfidence = 0 } = predictionData || {};
  const q = questionnaire || {};

  const top3Diseases = (top3.length ? top3 : [{ disease: primaryDisease, confidence: primaryConfidence, rank: 1 }]).map((item) => ({
    disease: item.disease || primaryDisease,
    confidence: Number(item.confidence || primaryConfidence || 0),
    rank: item.rank || 1,
  }));

  const symptomSummary = [
    q.pain && q.pain !== "No",
    q.itching && q.itching !== "No",
    q.otherSymptoms && q.otherSymptoms !== "None",
  ].filter(Boolean).length
    ? [q.pain && q.pain !== "No" ? `pain reported as ${q.pain}` : null, q.itching && q.itching !== "No" ? `itching reported as ${q.itching}` : null, q.otherSymptoms && q.otherSymptoms !== "None" ? `other symptoms noted: ${q.otherSymptoms}` : null].filter(Boolean).join(", ")
    : "symptoms are not clearly described in the questionnaire";

  const riskLevel = (() => {
    if (q.fever === "Yes" || q.bleeding === "Yes" || q.swelling === "Yes") return "Moderate";
    if (Number(primaryConfidence || top3[0]?.confidence || 0) >= 80) return "Moderate";
    return "Low";
  })();

  return {
    predictedDisease: primaryDisease,
    top3Diseases,
    confidenceScore: Number(primaryConfidence || top3[0]?.confidence || 0),
    symptomsSummary: `The image and questionnaire suggest a likely diagnosis of ${primaryDisease}. Based on the available information, ${symptomSummary}, and the lesion pattern appears consistent with an inflammatory or reactive skin condition. This should be reviewed alongside the patient history and physical examination for confirmation.`,
    possibleCauses: "This local clinical summary is based on the lesion appearance and patient answers. Common possibilities include irritation, inflammation, infection, chronic skin stress, or another dermatologic condition. The exact cause may vary depending on the lesion location, duration, and skin history.",
    imageFindings: `The visual pattern is most consistent with ${primaryDisease}. The local AI model indicates moderate confidence in this assessment, and the result should be interpreted as a supportive screening tool rather than a definitive diagnosis.`,
    riskLevel,
    recommendedActions: "Arrange a dermatology review to confirm the diagnosis, avoid scratching or irritating the area, keep the lesion clean and dry, and monitor any changes in size, color, or texture over time.",
    lifestyleSuggestions: "Use gentle skin care products, avoid harsh soaps or scented lotions, protect the lesion from friction and excessive sun exposure, and maintain good hygiene around the affected area.",
    whenToConsultDermatologist: "Seek prompt medical evaluation if the lesion spreads rapidly, bleeds, becomes painful, develops pus, or is accompanied by fever, swelling, or significant new symptoms.",
    disclaimer: "This AI analysis is for informational purposes only and does not constitute medical advice. Please consult a licensed dermatologist or healthcare professional for proper diagnosis and treatment.",
    fallback: true,
  };
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
  const primaryProvider = getProvider();
  const providersToTry =
    primaryProvider.name === "gemini" && process.env.OPENAI_API_KEY
      ? [primaryProvider, PROVIDERS.openai]
      : [primaryProvider];

  let lastError;

  for (const provider of providersToTry) {
    const startTime = Date.now();
    logger.info(`Generating medical report via ${provider.name} (${provider.model})`);

    const prompt = buildMedicalReportPrompt(predictionData, questionnaire);

    try {
      const rawResponse = await provider.generateReport(prompt);
      const parsed = parseLLMResponse(rawResponse);

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
    } catch (err) {
      lastError = err;
      logger.error(`LLM provider error [${provider.name}]: ${err.message}`);

      const isGeminiAvailabilityIssue =
        provider.name === "gemini" &&
        /404|not available|not found|unsupported|invalid model|service unavailable/i.test(err.message);

      if (isGeminiAvailabilityIssue && process.env.OPENAI_API_KEY) {
        logger.warn("Gemini model unavailable; retrying report generation with OpenAI.");
        continue;
      }

      logger.warn("Falling back to local medical report generation because the configured LLM provider is unavailable or rate-limited.");
      const fallbackReport = buildFallbackReport(predictionData, questionnaire);
      return {
        ...fallbackReport,
        rawResponse: JSON.stringify(fallbackReport),
        llmProvider: "fallback",
        llmModel: "local-fallback",
        generationTimeMs: Date.now() - startTime,
      };
    }
  }

  logger.warn("Falling back to local medical report generation because no external LLM provider succeeded.");
  const fallbackReport = buildFallbackReport(predictionData, questionnaire);
  return {
    ...fallbackReport,
    rawResponse: JSON.stringify(fallbackReport),
    llmProvider: "fallback",
    llmModel: "local-fallback",
    generationTimeMs: 0,
  };
};

module.exports = { generateMedicalReport };
