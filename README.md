# UniTrade

UniTrade is a high-end, student-focused campus marketplace built with React + Vite, Firebase (Auth + Firestore), and Algorand TestNet wallet payments. It features a modern **"Etheric Glass"** design system with full mobile responsiveness.

The app supports real-time listings, buyer-seller chat, negotiated offers, wishlist sync, and an OTP-gated payment release workflow designed for in-person campus handovers.

## Table of Contents

1. [Project Summary](#project-summary)
2. [Core Features](#core-features)
3. [Design System: Etheric Glass](#design-system-etheric-glass)
4. [Tech Stack](#tech-stack)
5. [Application Architecture](#application-architecture)
6. [Project Structure](#project-structure)
7. [Local Development Setup](#local-development-setup)
8. [Firebase Setup Guide](#firebase-setup-guide)
9. [Algorand and Pera Wallet Setup](#algorand-and-pera-wallet-setup)
10. [User Flows](#user-flows)
11. [Firestore Data Model](#firestore-data-model)
12. [Security Model and Rules](#security-model-and-rules)
13. [Scripts](#scripts)
14. [Troubleshooting](#troubleshooting)
15. [Known Limitations](#known-limitations)
16. [Future Improvements](#future-improvements)

## Project Summary

UniTrade solves a common campus problem: students need a trusted, fast, low-friction way to buy and sell used items.

This project combines:

- A stunning **Glassmorphism UI** with deep-space gradients and neon accents.
- Anonymous Firebase authentication for lightweight onboarding.
- Algorand wallet integration through Pera Wallet.
- A "held-until-verification" order workflow where payment is only released after in-person OTP verification.
- Full mobile responsiveness for on-the-go campus trading.

## Core Features

### Marketplace and Discovery

- **Etheric Glass UI**: Semi-transparent surfaces, backdrop blurs, and neon cyan/magenta accents.
- **Real-time Feed**: Instant updates using Firestore subscriptions.
- **Advanced Filtering**: Search, categories, condition, and price range sliders.
- **Smart Sorting**: Sort by Newest, Price (Asc/Desc), and Top Rated.
- **Wishlist**: Personal space to save interesting items with real-time sync.

### Listing Management

- **Visual Creation**: Modal-based listing with auto-thumbnail emojis and rich metadata.
- **Ownership Control**: Robust security ensures only owners can edit or delete their items.
- **Auto-Sold**: Listings automatically transition to "Sold" state upon algorithmic payment finality.

### Wallet and Payments

- **Pera Wallet Integration**: Secure connection, session persistence, and instant signing.
- **Live Balance**: Real-time ALGO polling via Algod TestNet.
- **On-Chain Transactions**: Finalizing deals directly on the Algorand blockchain.

### Orders and Fulfillment

- **Handover Workflow**: OTP-based physical verification system.
- **Custom Offers**: Structured negotiation flow within the chat system.
- **Rating System**: Build campus trust with post-deal ratings.
- **Order Tracking**: Comprehensive dashboard for "My Orders" and "Listed Offers".

## Design System: Etheric Glass

UniTrade uses a custom-built Glassmorphism engine defined in `glassmorphism.css`:

- **Aesthetic**: Deep dark backgrounds (`#0d0d1c`), 12px-24px backdrop blurs, and 1px "ghost borders" (low-opacity white).
- **Colors**: Primary Cyan (`#00F2FE`), Magenta (`#FF00C8`), and Soft Gold accents.
- **Mobile First**: 
  - **Bottom Action Sheets**: Side drawers automatically transform into mobile-native bottom sheets on small screens.
  - **Responsive Grids**: Layouts collapse from multi-column grids to sleek vertical feeds.
  - **Reflowed Headers**: Dense navigation wraps into accessible mobile layouts.
- **Dark Mode Maps**: Custom Leaflet overrides inverting tiles while preserving UI layers and neon markers.

## Tech Stack

### Frontend

- **React 19**: Modern component architecture.
- **Vite 7**: Ultra-fast build tool and dev server.
- **Vanilla CSS (Glassmorphism)**: Custom design token system with heavy backdrop-filter usage.

### Backend-as-a-Service

- **Firebase Authentication**: Anonymous and logic-ready.
- **Cloud Firestore**: High-performance real-time database.

### Web3 and Payments

- **algosdk**: Core Algorand interaction.
- **@perawallet/connect**: Primary wallet provider.
- **Algorand TestNet**: Running on carbon-neutral blockchain infrastructure.

### Mapping

- **Leaflet + React Leaflet**: Themed dark-mode campus map integration.

## Application Architecture

1. **Boot**: App initializes Firebase and Establishes Auth.
2. **Sync**: Real-time hooks (`useListings`, `useOrders`, `useWishlist`) subscribe to Firestore.
3. **Connect**: User links Pera Wallet to unlock "Signed" operations.
4. **Interact**: Trading happens via Cards, Modals, and Chat Drawers.
5. **Finalize**: Chain-based payment release updates the source of truth (Firestore).

## Project Structure

- `src/main.jsx`: Entry point with CSS cascades.
- `src/index.css`: Foundation and brutalism legacy.
- `src/glassmorphism.css`: **The Design System** (Theme + Mobile Rules).
- `src/components/`: Atomic UI components (ListingCard, ChatDrawer, etc.).
- `src/hooks/`: Business logic orchestration.
- `src/services/`: Direct API interface for Firestore and Algorand.

## Local Development Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill Firebase credentials.
3. `npm run dev`

## Known Limitations

- Email verification is a UI simulation (No actual email backend).
- ALGO/INR rates are based on a static 15x multiplier.
- No automated frontend test suite (Component-level unit tests needed).

## Future Improvements

- **PWA Support**: Full offline and "Add to Home Screen" capability.
- **Smart Contract Escrow**: Replacing app-state logic with decentralized Teal scripts.
- **Live Price Feed**: Integration with DEX APIs for real-time INR/USD rates.
- **Rich Media**: Shifting from emojis to Cloud Storage image uploads.

---
*Built for the campus. Powered by Algorand.*
