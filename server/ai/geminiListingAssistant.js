import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemini-2.5-flash";
const ALGO_INR_FALLBACK_RATE = 20;

function extractJson(text = "") {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("Gemini returned an empty response.");
  }

  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const rawJson = codeBlockMatch ? codeBlockMatch[1] : trimmed;

  try {
    return JSON.parse(rawJson);
  } catch {
    throw new Error("Gemini returned invalid JSON.");
  }
}

function sanitizeSuggestion(raw = {}) {
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const description = typeof raw.description === "string" ? raw.description.trim() : "";
  const estimatedPriceInr = typeof raw.estimatedPriceInr === "string" ? raw.estimatedPriceInr.trim() : "";
  const priceJudgement = typeof raw.priceJudgement === "string" ? raw.priceJudgement.trim() : "";

  if (!title || !description || !estimatedPriceInr || !priceJudgement) {
    throw new Error("Gemini response was missing required fields.");
  }

  return {
    title,
    description,
    estimatedPriceInr,
    priceJudgement,
  };
}

function buildPrompt(listedCondition) {
  return [
    "You are a campus marketplace assistant helping users create product listings.",
    "Analyze the uploaded product image and return listing suggestions in STRICT JSON only.",
    `Seller-selected condition is: ${listedCondition}.`,
    "Rules:",
    "1) Output valid JSON only. No markdown, no prose.",
    "2) Include exactly these fields: title, description, estimatedPriceInr, priceJudgement.",
    "3) title: short (4-10 words), clear, and buyer-friendly.",
    "4) description: 2-4 sentences describing visible condition, likely usage, and notable details. Do not invent hidden defects.",
    "5) estimatedPriceInr: INR range string in this exact format: \"₹<min> - ₹<max>\".",
    "6) priceJudgement: 1 short sentence that judges expected pricing fairness based on the selected condition and visible wear.",
    "7) If uncertain, still provide a conservative practical range based on visible cues.",
  ].join("\n");
}

function parseInrRange(estimatedPriceInr) {
  const values = (estimatedPriceInr.match(/\d+(?:,\d{3})*(?:\.\d+)?/g) || [])
    .map((entry) => Number(entry.replace(/,/g, "")))
    .filter((entry) => Number.isFinite(entry) && entry > 0);

  if (!values.length) {
    throw new Error("Could not parse INR range from AI response.");
  }

  if (values.length === 1) {
    return { minInr: values[0], maxInr: values[0] };
  }

  const [first, second] = values;
  return {
    minInr: Math.min(first, second),
    maxInr: Math.max(first, second),
  };
}

function formatInrRange(minInr, maxInr) {
  const formatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
  return `₹${formatter.format(Math.round(minInr))} - ₹${formatter.format(Math.round(maxInr))}`;
}

function formatAlgoRange(minAlgo, maxAlgo) {
  const normalize = (value) => Number(value.toFixed(2)).toString();
  return `${normalize(minAlgo)} - ${normalize(maxAlgo)} ALGO`;
}

async function fetchAlgoInrRate() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=inr");
    if (!response.ok) {
      throw new Error("Price feed unavailable");
    }

    const body = await response.json();
    const liveRate = Number(body?.algorand?.inr);
    if (!Number.isFinite(liveRate) || liveRate <= 0) {
      throw new Error("Invalid ALGO-INR rate");
    }

    return liveRate;
  } catch {
    return ALGO_INR_FALLBACK_RATE;
  }
}

export async function analyzeListingImage({ apiKey, mimeType, imageBase64, listedCondition = "Good" }) {
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY on server.");
  }

  if (!mimeType || !imageBase64) {
    throw new Error("Image payload is incomplete.");
  }

  const client = new GoogleGenAI({ apiKey });

  const response = await client.models.generateContent({
    model: MODEL_NAME,
    contents: [
      {
        role: "user",
        parts: [
          { text: buildPrompt(listedCondition) },
          {
            inlineData: {
              mimeType,
              data: imageBase64,
            },
          },
        ],
      },
    ],
    config: {
      temperature: 0.4,
      responseMimeType: "application/json",
    },
  });

  const parsed = extractJson(response?.text || "");
  const suggestion = sanitizeSuggestion(parsed);
  const algoInrRate = await fetchAlgoInrRate();
  const { minInr, maxInr } = parseInrRange(suggestion.estimatedPriceInr);

  const minAlgo = minInr / algoInrRate;
  const maxAlgo = maxInr / algoInrRate;

  return {
    title: suggestion.title,
    description: suggestion.description,
    estimatedPrice: formatAlgoRange(minAlgo, maxAlgo),
    estimatedPriceInr: formatInrRange(minInr, maxInr),
    priceJudgement: suggestion.priceJudgement,
    algoInrRate: Number(algoInrRate.toFixed(2)),
  };
}
