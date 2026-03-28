import React from "react";
import { Badge, truncate, conditionColor } from "./Shared";

export default function ListingCard({ listing, onBuy, accountAddress, currentUserId, wishlist, onToggleWishlist, onChat, onDelete }) {
    const isWished = wishlist?.includes(listing.id);
    const sellerAddress = listing.sellerAddress || listing.seller?.walletAddress || listing.seller;
    const isOwner = Boolean(
        accountAddress && sellerAddress && accountAddress === sellerAddress
    );

    return (
        <div className="listing-card" style={{ height: "100%" }}>
            {/* Thumbnail */}
            <div className="card-thumb">
                <span style={{ position: "relative", zIndex: 1 }}>{listing.image}</span>
                <button
                    className={`wishlist-btn${isWished ? " active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(listing.id); }}
                    title={isWished ? "Remove from saved" : "Save listing"}
                >
                    {isWished ? "♥" : "♡"}
                </button>
            </div>

            {/* Body */}
            <div className="card-body">
                <div className="card-category">{listing.category}</div>
                <div className="card-title">{listing.title}</div>
                <div className="card-desc">{listing.description}</div>

                {/* Badges row */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                    <Badge text={listing.condition} color={conditionColor[listing.condition] || "#8A7420"} />
                    {listing.rating >= 4.0 && (
                        <span className="badge badge-gold">⭐ TRUSTED</span>
                    )}
                    <span style={{ marginLeft: "auto", fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.06em" }}>
                        {truncate(sellerAddress)}
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className="card-footer">
                <div>
                    <div className="card-price">
                        {listing.price}
                        <span style={{ fontSize: 12, fontWeight: 400, color: "var(--gold-muted)", marginLeft: 4 }}>ALGO</span>
                    </div>
                    <div className="card-fiat">≈ ₹{(listing.price * 15).toLocaleString("en-IN")} INR</div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {accountAddress && (
                        <button
                            className="btn-text-gold"
                            onClick={() => onChat?.(listing)}
                            title="Message seller"
                            style={{ fontSize: 11, letterSpacing: "0.1em" }}
                        >
                            CHAT →
                        </button>
                    )}
                    {isOwner ? (
                        <button className="btn-danger" onClick={() => onDelete?.(listing)}>
                            DELETE
                        </button>
                    ) : (
                        <button
                            className="btn-gold"
                            onClick={() => onBuy(listing)}
                            disabled={!accountAddress}
                            style={{ padding: "8px 18px", fontSize: 11 }}
                        >
                            {accountAddress ? "BUY" : "CONNECT"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
