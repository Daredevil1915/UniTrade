import React, { useState } from "react";
import { inputStyle, labelStyle } from "./Shared";

const VALID_DOMAINS = ["@iec.ac.in"];

export default function VerifyModal({ onClose, onVerify }) {
    const [email, setEmail] = useState("");
    const [step, setStep] = useState("input"); // input | code | done
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const handleSendCode = () => {
        setError("");
        const domain = email.substring(email.indexOf("@"));
        if (!VALID_DOMAINS.some(d => domain.toLowerCase() === d)) {
            setError(`ONLY IEC EMAIL IS ACCEPTED: ${VALID_DOMAINS[0]}`);
            return;
        }
        setStep("code");
    };

    const handleVerify = () => {
        // Demo: any 4+ digit code works
        if (code.length >= 4) {
            setStep("done");
            setTimeout(() => {
                onVerify(email);
                onClose();
            }, 1500);
        } else {
            setError("ENTER THE 4-DIGIT CODE (DEMO: ANY 4 DIGITS)");
        }
    };

    return (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-panel" style={{ maxWidth: 420, padding: 40, textAlign: "center" }}>
                {step === "done" ? (
                    <>
                        <div style={{ fontSize: 64, marginBottom: 24, animation: "float 2s ease infinite" }}>✅</div>
                        <h2 className="serif" style={{ color: "var(--emerald)", fontSize: 24, fontWeight: 800, marginBottom: 12 }}>VERIFIED.</h2>
                        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Your student identity has been confirmed.</p>
                    </>
                ) : (
                    <>
                        <div style={{ fontSize: 48, marginBottom: 24 }}>🎓</div>
                        <h2 className="serif" style={{ color: "var(--text)", fontSize: 22, fontWeight: 800, marginBottom: 12 }}>STUDENT VERIFICATION.</h2>
                        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 32 }}>
                            {step === "input" ? "Enter your university email to get verified on the ledger." : "Enter the verification code sent to your email."}
                        </p>

                        {step === "input" ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div style={{ textAlign: "left" }}>
                                    <label style={labelStyle}>UNIVERSITY EMAIL</label>
                                    <input className="input-box" type="email" value={email} onChange={e => setEmail(e.target.value)}
                                        placeholder="you@iec.ac.in" onKeyDown={e => e.key === "Enter" && handleSendCode()} />
                                </div>
                                {error && <div style={{ color: "var(--red)", fontSize: 11, fontFamily: "'Space Mono', monospace", textAlign: "left" }}>{error}</div>}
                                <div style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'Space Mono', monospace", textAlign: "left", letterSpacing: "0.05em" }}>
                                    SUPPORTED DOMAINS: {VALID_DOMAINS.join(", ")}
                                </div>
                                <button className="btn-gold" onClick={handleSendCode} style={{ marginTop: 8 }}>
                                    SEND VERIFICATION CODE
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div style={{ background: "var(--s0)", border: "1px solid var(--border)", padding: 16, fontSize: 12, color: "var(--gold)", fontFamily: "'Space Mono', monospace", textAlign: "left" }}>
                                    📧 CODE SENT TO {email.toUpperCase()}
                                </div>
                                <div style={{ textAlign: "left" }}>
                                    <label style={labelStyle}>VERIFICATION CODE</label>
                                    <input className="input-box" style={{ textAlign: "center", letterSpacing: 8, fontSize: 24, fontFamily: "'Space Mono', monospace" }}
                                        value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        placeholder="0000" maxLength={6} onKeyDown={e => e.key === "Enter" && handleVerify()} />
                                </div>
                                {error && <div style={{ color: "var(--red)", fontSize: 11, fontFamily: "'Space Mono', monospace", textAlign: "left" }}>{error}</div>}
                                <button className="btn-gold" onClick={handleVerify} style={{ marginTop: 8 }}>
                                    VERIFY IDENTITY
                                </button>
                            </div>
                        )}
                        <button onClick={onClose} className="btn-text-gold" style={{ marginTop: 24 }}>CANCEL</button>
                    </>
                )}
            </div>
        </div>
    );
}
