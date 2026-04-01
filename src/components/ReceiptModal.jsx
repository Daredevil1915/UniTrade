import React from "react";
import { motion } from "framer-motion";
import { truncate } from "./Shared";

export default function ReceiptModal({ order, onClose }) {
    if (!order) return null;

    const algoPrice = Number(order.price || order.finalPrice || order.amount || 0);
    const inrValue = (algoPrice * 15).toLocaleString("en-IN");

    const handlePrint = () => {
        const printContent = document.getElementById("receipt-print-area");
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert("Please allow popups to print the receipt.");
            return;
        }

        printWindow.document.write(`
            <html>
                <head>
                    <title>UniTrade Receipt - ${order.id}</title>
                    <style>
                        body {
                            font-family: 'Space Mono', 'Inter', monospace, sans-serif;
                            padding: 40px;
                            background: white;
                            color: #000;
                            margin: 0;
                        }
                        .receipt-print-area {
                            max-width: 500px;
                            margin: 0 auto;
                        }
                        .serif { font-family: serif; }
                        .no-print { display: none !important; }
                        
                        /* Map any used CSS vars to printable fallback colors */
                        :root {
                            --border: #ccc;
                            --text: #000;
                            --text-dim: #555;
                            --gold: #000; /* Print gold as black for better readability */
                            --s0: #fafafa;
                        }
                        
                        /* Force clean printable styles */
                        * {
                            color: black !important;
                            border-color: #ccc !important;
                            box-shadow: none !important;
                            text-shadow: none !important;
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt-print-area">
                        ${printContent.innerHTML}
                    </div>
                    <script>
                        setTimeout(() => {
                            window.print();
                            window.close();
                        }, 250);
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <motion.div
          className="modal-backdrop receipt-modal-container"
          onClick={e => e.target === e.currentTarget && onClose()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
            <motion.div
              id="receipt-print-area"
              className="modal-panel receipt-print-area"
              style={{ maxWidth: 460, padding: "40px 32px", maxHeight: "90vh", overflowY: "auto", position: "relative" }}
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
            >
                
                {/* Close Button */}
                <button onClick={onClose} className="btn-text-gold no-print" style={{ position: "absolute", top: 20, right: 24, fontSize: 16 }}>✕</button>

                {/* Receipt Header */}
                <div style={{ borderBottom: "2px dashed var(--border)", paddingBottom: 24, marginBottom: 24, textAlign: "center" }}>
                    <div className="serif" style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>⬡ UNITRADE LEDGER</div>
                    <div style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'Space Mono', monospace", marginTop: 8, letterSpacing: "0.2em" }}>
                        OFFICIAL TRANSACTION RECEIPT
                    </div>
                </div>

                {/* Details Slab */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>ORDER ID</span>
                        <span style={{ fontSize: 10, color: "var(--gold)", fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>{order.id}</span>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>DATE SQUARED</span>
                        <span style={{ fontSize: 10, color: "var(--text)", fontFamily: "'Space Mono', monospace" }}>
                            {new Date(order.timestamp?.toDate?.() || order.date).toLocaleString()}
                        </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>ITEM</span>
                        <span style={{ fontSize: 14, color: "var(--text)", fontFamily: "'Space Mono', monospace", fontWeight: 800, textAlign: "right" }}>
                            {order.title?.toUpperCase()}
                        </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>PAYMENT METHOD</span>
                        <span style={{ fontSize: 10, color: "var(--text)", fontFamily: "'Space Mono', monospace" }}>
                            ON-CHAIN (ALGO)
                        </span>
                    </div>

                    {order.txId && (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>TX HASH</span>
                            <a 
                                href={`https://lora.algokit.io/testnet/transaction/${order.txId}`} 
                                target="_blank" 
                                rel="noreferrer"
                                style={{ fontSize: 10, color: "var(--text)", fontFamily: "'Space Mono', monospace", textDecoration: "underline", textUnderlineOffset: 2 }}
                            >
                                {truncate(order.txId)} ↗
                            </a>
                        </div>
                    )}
                </div>

                {/* Parties Involvement */}
                <div style={{ marginTop: 24, padding: "16px", background: "var(--s0)", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>FROM (BUYER)</div>
                        <div style={{ fontSize: 10, color: "var(--text)", fontFamily: "'Space Mono', monospace" }}>{truncate(order.buyerAddress || order.buyerId)}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>TO (SELLER)</div>
                        <div style={{ fontSize: 10, color: "var(--text)", fontFamily: "'Space Mono', monospace" }}>{truncate(order.sellerAddress || order.sellerId)}</div>
                    </div>
                </div>

                {/* Pricing Breakdown */}
                <div style={{ marginTop: 24, borderTop: "2px dashed var(--border)", paddingTop: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <span style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>FINAL SETTLEMENT</span>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--gold)", fontFamily: "'Space Mono', monospace", lineHeight: 1 }}>
                                {algoPrice.toFixed(2)} ALGO
                            </div>
                            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4, fontFamily: "'Space Mono', monospace" }}>
                                ≈ ₹{inrValue} INR
                            </div>
                        </div>
                    </div>
                </div>

                {/* Digital Signature */}
                <div style={{ marginTop: 32, textAlign: "center", opacity: 0.6 }}>
                    <div style={{ fontSize: 24, fontFamily: "serif", fontStyle: "italic", letterSpacing: "0.1em" }}>Verified by UniTrade</div>
                    <div style={{ fontSize: 8, color: "var(--text-dim)", fontFamily: "'Space Mono', monospace", marginTop: 4 }}>
                        STATE VERIFIED VIA ALGORAND TESTNET SIGNATURE.
                    </div>
                </div>

                {/* Actions */}
                <div className="no-print" style={{ marginTop: 40, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                    <button onClick={handlePrint} className="btn-gold" style={{ width: "100%", padding: "14px 0", fontSize: 11 }}>
                        🖨️ PRINT / DOWNLOAD PDF
                    </button>
                    <button onClick={onClose} className="btn-outline" style={{ width: "100%", padding: "12px 0", fontSize: 11, marginTop: 12 }}>
                        RETURN TO HUB
                    </button>
                </div>

            </motion.div>
        </motion.div>
    );
}
