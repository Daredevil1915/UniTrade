import React, { useEffect, useState } from "react";
import { labelStyle, inputStyle } from "./Shared";
import { requestListingSuggestion, toAiImagePayload } from "../services/listingAiService";

const CATEGORIES = ["Books", "Electronics", "Clothing", "Furniture", "Misc"];
const emojis = ["📦", "📘", "📗", "📙", "🖩", "⌨️", "🖥️", "📱", "🔌", "🪑", "👕", "👟", "🎮", "🎸", "🎒"];

function withTimeout(promise, timeoutMs, timeoutMessage) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
        promise
            .then((result) => {
                clearTimeout(timer);
                resolve(result);
            })
            .catch((err) => {
                clearTimeout(timer);
                reject(err);
            });
    });
}

export default function SellModal({ onClose, onList, accountAddress }) {
    const [form, setForm] = useState({ title: "", category: "Books", price: "", description: "", condition: "Good", image: "📦" });
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const [aiSuggestionAlgo, setAiSuggestionAlgo] = useState("");
    const [aiSuggestionInr, setAiSuggestionInr] = useState("");
    const [aiPriceJudgement, setAiPriceJudgement] = useState("");
    const [aiAlgoInrRate, setAiAlgoInrRate] = useState(0);
    const [analyzingImage, setAnalyzingImage] = useState(false);
    const [aiError, setAiError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        return () => {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [imagePreviewUrl]);

    const handleImageSelection = (event) => {
        const file = event.target.files?.[0] || null;
        setAiError("");
        setAiSuggestionAlgo("");
        setAiSuggestionInr("");
        setAiPriceJudgement("");
        setAiAlgoInrRate(0);

        if (!file) {
            setSelectedImageFile(null);
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
            setImagePreviewUrl("");
            return;
        }

        const preview = URL.createObjectURL(file);
        setSelectedImageFile(file);
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
        setImagePreviewUrl(preview);
    };

    const extractSuggestedPrice = (estimatedPriceAlgo) => {
        const matches = estimatedPriceAlgo.match(/\d+(?:\.\d+)?/g);
        if (!matches?.length) return "";
        if (matches.length === 1) return Number(matches[0]).toFixed(2);

        const values = matches.slice(0, 2).map(Number).filter((value) => Number.isFinite(value));
        if (!values.length) return "";

        const average = values.reduce((sum, value) => sum + value, 0) / values.length;
        return average.toFixed(2);
    };

    const handleAnalyzeImage = async () => {
        setError("");
        setAiError("");

        if (!selectedImageFile) {
            setAiError("Upload an image first to get AI suggestions.");
            return;
        }

        setAnalyzingImage(true);

        try {
            const imagePayload = await toAiImagePayload(selectedImageFile);
            const suggestion = await requestListingSuggestion({
                ...imagePayload,
                listedCondition: form.condition,
            });
            const fallbackTitle = form.title || suggestion.title;
            const suggestedPrice = extractSuggestedPrice(suggestion.estimatedPrice);

            setForm((current) => ({
                ...current,
                title: fallbackTitle,
                description: suggestion.description || current.description,
                price: current.price || suggestedPrice,
            }));
            setAiSuggestionAlgo(suggestion.estimatedPrice);
            setAiSuggestionInr(suggestion.estimatedPriceInr);
            setAiPriceJudgement(suggestion.priceJudgement);
            setAiAlgoInrRate(suggestion.algoInrRate);
        } catch (analysisError) {
            setAiError(analysisError?.message || "AI analysis failed. You can still enter details manually.");
        } finally {
            setAnalyzingImage(false);
        }
    };

    const handleSubmit = async () => {
        if (!form.title || !form.price || !form.description) {
            setError("Please complete all required fields.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            await withTimeout(
                onList({ ...form, price: parseFloat(form.price), sellerAddress: accountAddress }),
                15000,
                "Listing is taking too long. Check Firebase Auth/Firestore rules and retry."
            );
            onClose();
        } catch (submitError) {
            setError(submitError?.message || "Could not publish your listing. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 20, padding: 32, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", animation: "scaleIn .25s ease" }}>
                <h2 style={{ margin: "0 0 24px", color: "#f9fafb", fontSize: 20, fontWeight: 800 }}>📦 List an Item</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                        <label style={labelStyle}>Upload Image (Temporary, AI only)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelection}
                            style={{ ...inputStyle, padding: 8 }}
                        />
                        {imagePreviewUrl && (
                            <img
                                src={imagePreviewUrl}
                                alt="Selected listing preview"
                                style={{ marginTop: 10, width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 10, border: "1px solid #1f2937" }}
                            />
                        )}
                        <button
                            onClick={handleAnalyzeImage}
                            disabled={!selectedImageFile || analyzingImage}
                            style={{ marginTop: 10, width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #374151", background: analyzingImage ? "#374151" : "#1f2937", color: "#f9fafb", cursor: !selectedImageFile || analyzingImage ? "not-allowed" : "pointer", fontWeight: 600 }}
                        >
                            {analyzingImage ? "Analyzing image..." : "Generate AI Title, Description & Price"}
                        </button>
                        <div style={{ marginTop: 8, color: "#9ca3af", fontSize: 12 }}>
                            Image is processed in-memory and is not stored in Firebase or database.
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Pick an Icon</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {emojis.map(e => (
                                <button key={e} onClick={() => setForm(f => ({ ...f, image: e }))}
                                    style={{ fontSize: 22, padding: "6px 10px", borderRadius: 8, border: `2px solid ${form.image === e ? "#6366f1" : "#1f2937"}`, background: form.image === e ? "#6366f122" : "#111827", cursor: "pointer", transition: "all .15s" }}>{e}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Title *</label>
                        <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Calculus Textbook" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                            <label style={labelStyle}>Category</label>
                            <select style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Condition</label>
                            <select style={inputStyle} value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}>
                                {["Like New", "Excellent", "Good", "Fair"].map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Price (ALGO) *</label>
                        <input style={inputStyle} type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" />
                        {aiSuggestionAlgo && <div style={{ marginTop: 6, color: "#93c5fd", fontSize: 12 }}>AI estimated price (ALGO): {aiSuggestionAlgo}</div>}
                        {aiSuggestionInr && <div style={{ marginTop: 4, color: "#9ca3af", fontSize: 12 }}>INR reference: {aiSuggestionInr}{aiAlgoInrRate ? ` (1 ALGO ≈ ₹${aiAlgoInrRate})` : ""}</div>}
                    </div>
                    <div>
                        <label style={labelStyle}>Description *</label>
                        <textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe condition, edition, accessories..." />
                    </div>
                    {aiPriceJudgement && (
                        <div style={{ background: "#052e1633", border: "1px solid #34d39966", borderRadius: 8, padding: "8px 10px", fontSize: 12, color: "#6ee7b7" }}>
                            Condition-based pricing judgement: {aiPriceJudgement}
                        </div>
                    )}
                    {aiError && (
                        <div style={{ background: "#1e3a8a33", border: "1px solid #60a5fa66", borderRadius: 8, padding: "8px 10px", fontSize: 12, color: "#93c5fd" }}>
                            {aiError || "AI could not analyze the image. You can continue manually."}
                        </div>
                    )}
                    {error && (
                        <div style={{ background: "#7f1d1d33", border: "1px solid #ef444466", borderRadius: 8, padding: "8px 10px", fontSize: 12, color: "#fca5a5" }}>
                            {error}
                        </div>
                    )}
                    <div style={{ display: "flex", gap: 12 }}>
                        <button onClick={onClose} disabled={submitting} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "1px solid #1f2937", background: "none", color: "#9ca3af", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                        <button onClick={handleSubmit} disabled={submitting} style={{ flex: 2, padding: "12px 0", borderRadius: 10, border: "none", background: submitting ? "#374151" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", cursor: submitting ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 15 }}>
                            {submitting ? "Listing..." : "List Item"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
