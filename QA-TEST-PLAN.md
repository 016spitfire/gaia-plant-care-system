# Gaia Plant Care System - QA Test Plan

**Testing URL (Local):** http://localhost:4173/  
**Testing URL (Production):** https://gaia-plant-care-system.vercel.app/

---

## 🎯 Test Environment Setup

### Prerequisites
- [ ] Test on Desktop Chrome/Edge (primary)
- [ ] Test on Android Chrome (if available)
- [ ] Test on iOS Safari (if available)
- [ ] Clear browser cache before starting
- [ ] Open browser DevTools Console to check for errors

---

## 1️⃣ Initial Load & UI

### Landing Page
- [ ] App loads without errors
- [ ] Alpha banner is visible at top (yellow background)
- [ ] Header shows: 🌱 Gaia Plant Care, 🔔 bell icon, ⚙️ settings icon, + Add Plant button
- [ ] No plants message displays (if first time)
- [ ] No console errors in DevTools

### Responsive Design
- [ ] Resize browser window to mobile size (375px width)
- [ ] Header buttons are visible and not overlapping
- [ ] Alpha banner text wraps properly
- [ ] All UI elements are accessible on small screens

---

## 2️⃣ Plant CRUD Operations

### Adding a Plant
- [ ] Click "+ Add Plant" button
- [ ] Modal overlay appears with dark background
- [ ] Form displays with all fields:
  - Name (required)
  - Species (optional)
  - Photo (optional)
  - Watering Frequency (required, default 7)
  - Notes (optional)
- [ ] Try submitting empty form → Should show validation error
- [ ] Fill in Name: "Test Monstera"
- [ ] Set Watering Frequency: 3 days
- [ ] Click "Add Plant" button
- [ ] Modal closes
- [ ] Plant card appears in list

### Viewing Plant Details
- [ ] Click on a plant card
- [ ] Detail modal opens showing:
  - Plant name
  - Species (if provided)
  - Photo (if provided)
  - Last Watered date
  - Next Watering date
  - Notes (if provided)
  - Custom fields (if any)
- [ ] Close button (✕) works
- [ ] Clicking outside modal closes it

### Editing a Plant
- [ ] Open plant detail
- [ ] Click "Edit" button
- [ ] Form pre-fills with existing data
- [ ] Change Name to "Updated Monstera"
- [ ] Change Watering Frequency to 5 days
- [ ] Click "Save Changes"
- [ ] Modal closes
- [ ] Plant card shows updated information
- [ ] Verify changes persist after page refresh

### Deleting a Plant
- [ ] Open plant detail
- [ ] Click "Delete" button
- [ ] Confirm deletion (if confirmation prompt exists)
- [ ] Plant card disappears from list
- [ ] Verify deletion persists after page refresh

---

## 3️⃣ Photo Capture & Display

### Taking a Photo (Desktop)
- [ ] Click "+ Add Plant"
- [ ] Click "Take Photo" or photo input
- [ ] File picker opens
- [ ] Select an image file
- [ ] Photo preview appears in form
- [ ] Photo is reasonable size (not huge)
- [ ] Submit form
- [ ] Photo displays on plant card (thumbnail)
- [ ] Click plant → Photo displays in detail view

### Photo Removal
- [ ] Edit a plant with a photo
- [ ] Click "Remove Photo" button (if exists)
- [ ] Photo disappears from preview
- [ ] Save changes
- [ ] Verify photo is removed from plant card

### Photo Edge Cases
- [ ] Try adding a very large image (5MB+)
- [ ] Verify compression works (check browser DevTools Network tab size)
- [ ] Try adding multiple plants with photos
- [ ] Verify app doesn't slow down

---

## 4️⃣ Watering Tracking

### Marking Plant as Watered
- [ ] Create a plant with 1-day watering frequency
- [ ] Click "Water" button on plant card
- [ ] Last Watered date updates to today
- [ ] Next Watering date updates to tomorrow
- [ ] Open plant detail → Verify dates are correct

### Plants Needing Water
- [ ] Create 3 plants:
  - Plant A: watered today, frequency 1 day
  - Plant B: watered 3 days ago, frequency 2 days
  - Plant C: watered today, frequency 7 days
- [ ] Yellow care reminder banner shows correct count (Plant B should need water)
- [ ] Click on care reminder banner
- [ ] Filter activates showing only plants needing water
- [ ] "Show All" button appears
- [ ] Click "Show All" → All plants display again

### Watering History
- [ ] Water a plant multiple times
- [ ] Check if history is tracked (in detail view if implemented)

---

## 5️⃣ Custom Fields System

### Managing Custom Fields
- [ ] Click ⚙️ settings icon in header
- [ ] Custom Field Manager modal opens
- [ ] Click "Add Field"
- [ ] Create field: Name="Location", Type="text"
- [ ] Click "Add Field"
- [ ] Create field: Name="Purchase Date", Type="date"
- [ ] Both fields appear in list
- [ ] Close field manager

### Using Custom Fields
- [ ] Add new plant
- [ ] Custom fields appear in form (Location, Purchase Date)
- [ ] Fill in Location: "Living Room"
- [ ] Fill in Purchase Date: Select a date
- [ ] Save plant
- [ ] Open plant detail → Custom fields display with values
- [ ] Edit plant → Custom field values are editable

### Deleting Custom Fields
- [ ] Open Custom Field Manager
- [ ] Delete "Location" field
- [ ] Confirm deletion
- [ ] Field disappears from list
- [ ] Add new plant → Location field no longer appears
- [ ] Existing plants → Location field still shows in detail (data preserved)

---

## 6️⃣ Notification System

### Initial Setup
- [ ] Click 🔔 bell icon in header
- [ ] Notification Settings modal opens properly (centered, dark overlay)
- [ ] Modal displays:
  - Title: 🔔 Notification Settings
  - Close button (✕) in top right
  - "Daily Reminders" section with Enable/Disable button
  - "How it works" info box at bottom

### Enabling Notifications
- [ ] Click "Enable" button
- [ ] Browser shows notification permission prompt
- [ ] Click "Allow" in browser prompt
- [ ] Test notification appears immediately: "🌱 Gaia Test - Notifications are working!"
- [ ] Button changes to "Disable"
- [ ] "Reminder Time" input appears (default 08:00)
- [ ] "Send Test Notification" button appears

### Testing Notifications
- [ ] Click "Send Test Notification" button
- [ ] Test notification appears: "🌱 Gaia Test - Notifications are working!"
- [ ] Notification displays browser icon/badge
- [ ] Click notification → App opens/focuses

### Changing Reminder Time
- [ ] Change time to 14:00 (2 PM)
- [ ] Close modal
- [ ] Reopen notification settings
- [ ] Verify time is still 14:00 (persisted)

### Disabling Notifications
- [ ] Click "Disable" button
- [ ] Button changes back to "Enable"
- [ ] Reminder time input disappears
- [ ] Close and reopen modal → Still shows as disabled

### Permission Denied Flow
- [ ] Reset notification permission in browser settings (Block notifications)
- [ ] Refresh page
- [ ] Open notification settings
- [ ] Warning message appears: "❌ Notification permission was denied"
- [ ] Instructions shown to enable in browser settings

---

## 7️⃣ Badge Count (Desktop Chrome/Edge Only)

### Badge Display
- [ ] Create 3 plants that need water today
- [ ] Badge count shows "3" on app icon (if installed as PWA)
- [ ] Water one plant
- [ ] Badge count updates to "2"
- [ ] Water all plants
- [ ] Badge count clears

**Note:** Badge API only works when app is installed as PWA on desktop Chrome/Edge

---

## 8️⃣ PWA Installation

### Desktop Installation
- [ ] Look for install icon in address bar (⊕ or download icon)
- [ ] Click install icon
- [ ] Install prompt appears: "Install Gaia?"
- [ ] Click "Install"
- [ ] App opens in standalone window (no browser UI)
- [ ] All features work in installed app
- [ ] App icon appears in taskbar/dock

### Install Prompt Banner (First Visit)
- [ ] Clear browser data or use Incognito
- [ ] Visit app for first time
- [ ] After 3 seconds, purple banner appears at bottom:
  - 📱 icon
  - "Install Gaia"
  - "Add to your home screen for the best experience"
  - "Install" button
  - ✕ dismiss button
- [ ] Click "Install" → Browser install prompt appears
- [ ] Close prompt → Banner remains
- [ ] Click ✕ dismiss → Banner disappears
- [ ] Refresh page → Banner doesn't reappear (remembered dismissal)

### Mobile Installation (Android Chrome)
- [ ] Visit app on Android phone
- [ ] Install prompt banner appears
- [ ] Tap menu (⋮) → "Install app" or "Add to Home screen"
- [ ] App icon appears on home screen
- [ ] Tap icon → App opens in standalone mode
- [ ] Green plant icon displays (not default PWA icon)

### Mobile Installation (iOS Safari)
- [ ] Visit app on iPhone
- [ ] Install prompt banner appears (no auto-install on iOS)
- [ ] Tap Share button (⬆️)
- [ ] Scroll down → Tap "Add to Home Screen"
- [ ] Edit name if desired → Tap "Add"
- [ ] App icon appears on home screen
- [ ] Tap icon → App opens

---

## 9️⃣ Offline Functionality

### Service Worker Registration
- [ ] Open DevTools → Application tab → Service Workers
- [ ] Service worker is registered and active
- [ ] No errors in service worker console

### Offline Mode Test
- [ ] With app loaded, open DevTools → Network tab
- [ ] Check "Offline" checkbox (simulates no internet)
- [ ] Refresh page → App still loads
- [ ] Add a plant → Works offline
- [ ] Water a plant → Works offline
- [ ] Take photo → Works offline
- [ ] Uncheck "Offline" → App still works

### Cache Verification
- [ ] DevTools → Application → Cache Storage
- [ ] Workbox cache exists with app assets (JS, CSS, HTML)
- [ ] All critical files are cached

---

## 🔟 Data Persistence

### IndexedDB
- [ ] Open DevTools → Application → IndexedDB
- [ ] "gaia-plant-care" database exists
- [ ] "plants" object store exists
- [ ] "customFields" object store exists (if implemented)
- [ ] Add a plant → Entry appears in IndexedDB
- [ ] Refresh page → Plant persists
- [ ] Close browser completely → Reopen → Plant persists

### LocalStorage
- [ ] DevTools → Application → Local Storage
- [ ] Check for notification settings:
  - `notification-time`
  - `notifications-enabled`
  - `pwa-install-dismissed`
- [ ] Enable notifications → Settings appear in localStorage
- [ ] Refresh page → Settings persist

---

## 1️⃣1️⃣ Edge Cases & Error Handling

### Invalid Input
- [ ] Try setting watering frequency to 0 → Should reject or default to 1
- [ ] Try setting watering frequency to negative number → Should reject
- [ ] Try setting watering frequency to 1000 → Should accept or warn
- [ ] Try entering extremely long plant name (500 characters) → Should handle gracefully
- [ ] Try entering special characters in name: `<script>alert('xss')</script>` → Should sanitize

### No Plants State
- [ ] Delete all plants
- [ ] Verify empty state message displays
- [ ] Care reminder shows 0 plants
- [ ] No errors in console

### Many Plants
- [ ] Add 20+ plants with photos
- [ ] Verify scroll works smoothly
- [ ] Verify app doesn't slow down
- [ ] Verify all plants load correctly

### Rapid Actions
- [ ] Rapidly click "Water" button multiple times
- [ ] Verify only one action processes
- [ ] Rapidly open/close modals
- [ ] Verify no UI glitches

---

## 1️⃣2️⃣ Browser Console Checks

### Throughout All Tests
- [ ] No JavaScript errors in console
- [ ] No React warnings
- [ ] No 404 errors for missing assets
- [ ] No CORS errors
- [ ] Service worker registers successfully

### Performance
- [ ] Network tab: Initial page load < 3 seconds
- [ ] Images are compressed (< 200KB each)
- [ ] No memory leaks (check Performance Monitor)

---

## 1️⃣3️⃣ Cross-Browser Testing

### Desktop Browsers
- [ ] Chrome (primary): All features work
- [ ] Edge: All features work
- [ ] Firefox: All features work (notifications may differ)
- [ ] Safari: All features work (notifications may differ)

### Mobile Browsers
- [ ] Android Chrome: All features work
- [ ] iOS Safari: All features work (no background notifications expected)

---

## 1️⃣4️⃣ Production Deployment Test

### Vercel Deployment
- [ ] Visit https://gaia-plant-care-system.vercel.app/
- [ ] All features work identically to local
- [ ] HTTPS enabled (check padlock icon)
- [ ] Service worker registers on production
- [ ] PWA installation works on production
- [ ] Notifications work on production
- [ ] No mixed content warnings

---

## 🐛 Bug Report Template

When you find issues, document them like this:

```
**Bug Title:** [Short description]
**Severity:** Critical / High / Medium / Low
**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Browser/Device:**
[Chrome 120 on Windows 11, etc.]

**Console Errors:**
[Any errors from DevTools console]

**Screenshots:**
[If applicable]
```

---

## ✅ Test Summary Checklist

### Must-Pass (Critical)
- [ ] App loads without errors
- [ ] Can add plants
- [ ] Can edit plants
- [ ] Can delete plants
- [ ] Can mark plants as watered
- [ ] Data persists after refresh
- [ ] PWA installs successfully
- [ ] No critical console errors

### Should-Pass (High Priority)
- [ ] Photos work
- [ ] Custom fields work
- [ ] Notifications work on supported browsers
- [ ] Offline mode works
- [ ] Care reminders display correctly
- [ ] Badge count updates

### Nice-to-Have (Medium Priority)
- [ ] Install prompt banner works
- [ ] Mobile responsive design perfect
- [ ] All browsers fully compatible
- [ ] Performance is excellent

---

## 📊 Testing Status

**Date:** ___________  
**Tester:** ___________  
**Build:** ___________  

**Total Tests:** 200+  
**Passed:** ___________  
**Failed:** ___________  
**Skipped:** ___________  

**Overall Status:** ⬜ Pass / ⬜ Fail / ⬜ Pass with Issues

---

## 🎯 Next Steps After Testing

1. Document all bugs found
2. Prioritize fixes (Critical → High → Medium → Low)
3. Create GitHub issues for each bug
4. Fix critical bugs before deployment
5. Retest after fixes
6. Deploy to production when tests pass

---

**Good luck with testing! 🧪**
