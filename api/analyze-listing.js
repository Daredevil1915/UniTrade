import { analyzeListingImage } from "../server/ai/geminiListingAssistant.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { mimeType, imageBase64, listedCondition } = req.body || {};

    const suggestion = await analyzeListingImage({
      apiKey: process.env.GEMINI_API_KEY,
      mimeType,
      imageBase64,
      listedCondition,
    });

    return res.status(200).json(suggestion);
  } catch (error) {
    const message = error?.message || "Could not analyze image.";
    return res.status(500).json({ error: message });
  }
}
