/* eslint-disable react-refresh/only-export-components */
import React, { useEffect } from "react";

// ── Toast ──
export function Toast({ message, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 4500); return () => clearTimeout(t); }, [onClose]);
    const cls = type === "success" ? "toast toast-success" : type === "error" ? "toast toast-error" : "toast toast-info";
    const icon = type === "success" ? "✓" : type === "error" ? "✗" : "—";
    return (
        <div className={cls}>
            <span style={{ flexShrink: 0 }}>{icon}</span>
            <span style={{ lineHeight: 1.5 }}>{message}</span>
            <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 18, opacity: 0.6, padding: "0 2px", flexShrink: 0 }}>×</button>
        </div>
    );
}

// ── Badge ──
export function Badge({ text, color }) {
    // Map color to badge class
    const colorMap = {
        "#10b981": "badge-emerald",
        "#00FF94": "badge-emerald",
        "#3b82f6": "badge-gold",
        "#D4AF37": "badge-gold",
        "#f59e0b": "badge-amber",
        "#ef4444": "badge-red",
        "#FF3333": "badge-red",
    };
    const cls = `badge ${colorMap[color] || "badge-muted"}`;
    return <span className={cls}>{text.toUpperCase()}</span>;
}

// ── Truncate ──
export const truncate = (addr) => addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";

export const statusColor = {
    pending:              "var(--amber)",
    ready_for_delivery:   "var(--gold)",
    completed:            "var(--emerald)",
    cancelled:            "var(--red)",
    Pending:              "var(--amber)",
    Negotiated:           "var(--gold)",
    Confirmed:            "var(--emerald)",
    Failed:               "var(--red)",
};

export const conditionColor = {
    "Like New":  "var(--emerald)",
    "Excellent": "var(--gold)",
    "Good":      "var(--amber)",
    "Fair":      "var(--red)",
};

// ── Shared Styles (modal forms) ──
export const labelStyle = {
    display: "block",
    color: "var(--text-dim)",
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 8,
    fontFamily: "'Space Mono', monospace",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
};

export const inputStyle = {
    width: "100%",
    background: "var(--s0)",
    border: "1px solid var(--border)",
    padding: "12px 14px",
    color: "var(--text)",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
    transition: "border-color 0.2s",
};
