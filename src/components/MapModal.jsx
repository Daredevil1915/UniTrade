import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const goldIcon = new L.DivIcon({
    html: '<div></div>',
    className: 'gold-dot-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

const PICKUP_SPOTS = [
    { name: "🚪 IEC Main Gate", lat: 28.6758, lng: 77.4471, desc: "SECURITY MONITORING" },
    { name: "🏢 Admin Block", lat: 28.6762, lng: 77.4479, desc: "HIGH VISIBILITY" },
    { name: "📚 Library Entrance", lat: 28.6766, lng: 77.4484, desc: "DAYTIME LOCATION" },
    { name: "🍽️ Cafeteria", lat: 28.6761, lng: 77.4489, desc: "BUSY COMMON AREA" },
    { name: "🅿️ Parking Zone A", lat: 28.6754, lng: 77.4482, desc: "SPACIOUS MEETUP" },
    { name: "🏠 Hostel Gate", lat: 28.6752, lng: 77.4475, desc: "MONITORED ENTRY" },
];

export default function MapModal({ onClose }) {
    return (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-panel" style={{ maxWidth: 720, padding: 32, animation: "scaleIn .25s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                    <div>
                        <h2 className="serif" style={{ color: "var(--text)", fontSize: 24, fontWeight: 800, margin: "0 0 8px" }}>CAMPUS NODES.</h2>
                        <div style={{ color: "var(--text-dim)", fontSize: 11, fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em" }}>
                            VERIFIED MEETUP SPOTS · IEC GHAZIABAD
                        </div>
                    </div>
                    <button onClick={onClose} className="btn-text-gold" style={{ fontSize: 24 }}>✕</button>
                </div>

                <div style={{ border: "1px solid var(--border)", overflow: "hidden", height: 400, background: "var(--s0)" }}>
                    <MapContainer center={[28.6758, 77.4479]} zoom={17} style={{ height: "100%", width: "100%", filter: "grayscale(1) invert(0.9) contrast(1.2)" }} scrollWheelZoom={true}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {PICKUP_SPOTS.map((spot, i) => (
                            <Marker key={i} position={[spot.lat, spot.lng]} icon={goldIcon}>
                                <Popup>
                                    <div style={{ padding: "4px 0" }}>
                                        <div style={{ color: "var(--gold)", fontWeight: 800, textTransform: "uppercase", fontSize: 11, letterSpacing: "0.1em", marginBottom: 4 }}>
                                            {spot.name}
                                        </div>
                                        <div style={{ color: "var(--text-muted)", fontSize: 10, lineHeight: 1.4 }}>
                                            {spot.desc}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* Spot List */}
                <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {PICKUP_SPOTS.map((spot, i) => (
                        <div key={i} style={{ background: "var(--s0)", border: "1px solid var(--border)", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{spot.name.toUpperCase()}</div>
                            <div style={{ fontSize: 9, color: "var(--text-dim)", fontFamily: "'Space Mono', monospace", letterSpacing: "0.05em" }}>{spot.desc}</div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 24, textAlign: "center" }}>
                    <button onClick={onClose} className="btn-gold" style={{ padding: "12px 32px", fontSize: 11 }}>CLOSE MAP VIEW</button>
                </div>
            </div>
        </div>
    );
}
