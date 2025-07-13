# PracandyWalls – Development Guide

## Overview

This is a modern, mobile-first wallpaper gallery application inspired by Wallhaven. It showcases portrait-oriented wallpapers in a sleek, responsive grid layout with advanced filtering, favorites functionality, and a premium user experience.

---

## User Preferences

- **Communication style**: Simple, everyday language

---

## System Architecture

### Frontend

- **Framework**: React 18 + TypeScript  
- **Build Tool**: Vite (fast dev & optimized builds)  
- **UI**: Radix UI + shadcn/ui design system  
- **Styling**: Tailwind CSS with custom CSS variables  
- **Routing**: Wouter (lightweight client-side routing)  
- **State**:  
  - React Context API (favorites)  
  - TanStack Query (server state, caching)  
- **Design**: Mobile-first responsive grid; adaptive navigation  

### Backend

- **Runtime**: Node.js + Express.js  
- **Language**: TypeScript  
- **Dev Mode**: Vite integration (HMR)  
- **Prod Build**: ESBuild (server bundling)  

---

## Data Storage

- **Primary DB**: PostgreSQL via Neon (serverless)  
- **ORM**: Drizzle ORM + Drizzle Kit (migrations)  
- **Local Storage**: Browser `localStorage` (favorites)  
- **In-Memory**: Dev fallback  

---

## Key Features

### Gallery

1. **Grid**: Auto-fit portrait cards (min 120 px wide)  
2. **Source**: External CDN + placeholder fallback  
3. **Lazy Loading** & error handling  
4. **Pagination**: “Load More” (20 per batch)  

### Navigation

- **Desktop**: Static header (logo, links, search, filters)  
- **Mobile**: Sticky bottom nav (icons)  
- **Responsive**: Conditional rendering by breakpoint  

### UI/UX

- **Design System**: shadcn/ui + Radix primitives  
- **Theme**: Dark mode, purple→blue gradients  
- **Typography**: Poppins (Google Fonts)  
- **Effects**: Transitions, hover animations, glass morphism  

### Search & Filter

- **Text Search**: Realtime by filename/tags  
- **Tag Filter**: Dropdown of categories  
- **Combined**: Supports multi-criteria filtering  

---

## Data Flow

1. **Image List**  
   - Auto-generated filenames: `img (1).jpg` … `img (N).jpg`  
   - Mock tags per image  
2. **Rendering**  
   - Show first 20; “Load More” appends next batches  
3. **Favorites**  
   - React Context + `localStorage`  
   - Heart icon toggles, immediate UI update  
4. **Modal**  
   - Click thumbnail → lightbox with full image/tags/download  

---

## Dependencies

### Core

- React, Wouter, Express  
- Drizzle ORM, Neon Database  
- TanStack Query  
- React Icons, Lucide React  

### UI

- Radix UI primitives  
- shadcn/ui  
- Tailwind CSS (+-merge, animate)  
- Framer Motion  

### Dev

- Vite, ESBuild, TypeScript  
- PostCSS + Autoprefixer  
- cross-env  

---

## Project Structure

```text
wallpaper-site/
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── context/
    │   └── FavoritesContext.tsx
    ├── utils/
    │   └── fetchWallpapers.ts
    ├── styles/
    │   └── globals.css
    ├── components/
    │   ├── Header.tsx
    │   ├── BottomNav.tsx
    │   ├── SearchBar.tsx
    │   ├── TagFilter.tsx
    │   ├── Gallery.tsx
    │   ├── GalleryItem.tsx
    │   └── ImageModal.tsx
    └── pages/
        ├── _app.tsx
        ├── _document.tsx
        ├── index.tsx
        ├── favorites.tsx
        └── profile.tsx
