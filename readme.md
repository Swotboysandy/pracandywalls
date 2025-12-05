# PracandyWalls - React Native Wallpaper App

A premium, production-ready wallpaper application built with React Native (Expo).

## Features
- **Dynamic Content**: Fetches high-quality wallpapers directly from GitHub.
- **Masonry Grid**: Smooth, 2-column layout with virtually infinite scrolling feeling.
- **Deep Search**: Search by filename or category.
- **Favorites**: Save your best wallpapers locally.
- **Offline Capable**: Caches images and data for offline viewing.
- **Premium UI**: Dark mode, smooth animations (Reanimated), and pinch-to-zoom.
- **Native Actions**: Set Wallpaper and Download to Gallery.

## Prerequisites
- Node.js (v18+)
- npm or yarn

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the App**
   ```bash
   npx expo start
   ```
   - Press `a` for Android Emulator.
   - Press `i` for iOS Simulator.
   - Scan QR code with Expo Go on physical device.

## Build for Play Store

To generate a production APK/AAB:

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure Build**
   ```bash
   eas build:configure
   ```

4. **Build for Android**
   ```bash
   eas build -p android --profile production
   ```
   This will generate an AAB file for upload to the Play Store.

   To generate an APK for side-loading:
   Update `eas.json`:
   ```json
   "build": {
     "preview": {
       "android": {
         "buildType": "apk"
       }
     }
   }
   ```
   Run: `eas build -p android --profile preview`

## Project Structure
- `app/`: Expo Router screens (Home, Image, Onboarding, Privacy).
- `src/components/`: Reusable UI components (MasonryGrid, WallpaperCard, etc).
- `src/services/`: API logic (GitHub fetcher).
- `src/store/`: Zustand state management.
- `src/hooks/`: Custom hooks.
- `src/theme/`: Color constants.

## Customization
- **Wallpapers**: Update `src/services/github.ts` to point to your own GitHub repository.
- **Icons**: Replace files in `assets/images/` with your own branding.
