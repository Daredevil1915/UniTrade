const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

function splitDataUrl(dataUrl) {
  const [prefix, base64] = dataUrl.split(",");
  const mimeMatch = prefix?.match(/^data:(.*?);base64$/i);
  if (!mimeMatch || !base64) {
    throw new Error("Invalid image format selected.");
  }

  return {
    mimeType: mimeMatch[1],
    imageBase64: base64,
  };
}

export async function toAiImagePayload(file) {
  if (!file) {
    throw new Error("Please choose an image first.");
  }

  if (!file.type?.startsWith("image/")) {
    throw new Error("Only image files are supported.");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image is too large. Please upload an image up to 5MB.");
  }

  const dataUrl = await readFileAsDataUrl(file);
  return splitDataUrl(dataUrl);
}

export async function requestListingSuggestion(imagePayload) {
  const response = await fetch("/api/analyze-listing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(imagePayload),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.error || "AI could not analyze this image right now.");
  }

  return {
    title: String(body?.title || ""),
    description: String(body?.description || ""),
    estimatedPrice: String(body?.estimatedPrice || ""),
    estimatedPriceInr: String(body?.estimatedPriceInr || ""),
    priceJudgement: String(body?.priceJudgement || ""),
    algoInrRate: Number(body?.algoInrRate || 0),
  };
}
