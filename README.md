# Gaia Plant Care System

🌱 A mobile-first PWA for plant enthusiasts to track watering schedules, care routines, and plant health.

---

## ⚠️ ALPHA VERSION - UNDER RAPID DEVELOPMENT

**This application is in active development and not yet feature-complete.**

Currently implemented:
- ✅ PWA installation (installable to home screen)
- ✅ Offline support via Service Worker
- ✅ Plant CRUD operations with photo capture
- ✅ Watering tracking and custom fields
- ✅ Mobile-first responsive design

Still in development:
- ⏳ Push notifications and daily reminders
- ⏳ Data export/backup functionality
- ⏳ Advanced care tracking features

**Use at your own risk. Data is stored locally on your device. Backup functionality is not yet implemented.**

---

**Status:** 🚧 Work in Progress

## Overview

Gaia is designed to help plant parents keep their green friends happy and healthy. Take photos of your plants, set watering schedules, and get gentle daily reminders when plants need attention.

Built for real-world use by a mobile dog grooming business transitioning to a plant nursery.

## Core Features (Planned)

### Plant Management
- 📷 **Photo Capture** - Take photos directly from your phone camera
- 🌿 **Plant Profiles** - Name, species, care notes for each plant
- 💧 **Watering Schedules** - Set custom watering frequency per plant
- 📅 **Care History** - Track when plants were last watered
- 📝 **Notes** - Add observations, growth updates, special care instructions

### Smart Reminders
- 🔔 **Daily Digest Notification** - One notification per day with plants needing attention
- 🏷️ **Badge Count** - App icon shows number of plants needing care
- 📱 **In-App Banner** - Immediate notification when opening app
- 🤖 **Android Push Notifications** - Background notifications (Android only)
- 🍎 **iOS In-App Alerts** - Banner notifications when app is opened (iOS)

### Offline-First Design
- 💾 **Local Storage** - All data stored on device via IndexedDB
- 📸 **Optimized Images** - Compressed photos for efficient storage
- ✈️ **Works Offline** - Full functionality without internet connection
- 🔄 **PWA Installable** - Add to home screen on Android and iOS

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool with PWA plugin
- **IndexedDB** (via `idb`) - Local database for plant data and photos
- **Service Worker** - Offline support and notifications
- **PWA** - Installable web app

### Key Dependencies

- **idb** - Promise-based IndexedDB wrapper (cleaner API than raw IndexedDB)
- **browser-image-compression** - Client-side photo compression before storage
- **date-fns** - Lightweight date manipulation for watering schedules
- **vite-plugin-pwa** - Service worker and manifest generation

### Architectural Decisions

**No routing library:** Mobile-first PWA with component-based navigation (modals/slide-ins). Users interact via installed app, not web URLs. Keeps bundle small and UX native-feeling.

**No Redux:** IndexedDB is the source of truth. React Context API + useState sufficient for UI state (current view, selected plant). Avoids Redux boilerplate for simple state needs.

**Native crypto.randomUUID():** Uses browser API instead of uuid library. Zero dependencies, works in all modern browsers, saves bundle size.

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## License

MIT

## Author

Spencer Kittle ([@016spitfire](https://github.com/016spitfire))

---

*Because every plant deserves a little attention.*
