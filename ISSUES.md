# Critical Issues to Fix

## Immediate Bugs Found:
1. ❌ Components using named exports (`CategorySelector`, `SearchBar`, `WallpaperCard`) but inconsistent usage
2. ❌ `settings` route doesn't exist (causing navigation error)
3. ❌ Category selection doesn't actually filter wallpapers
4. ❌ Search doesn't work
5. ❌ No bottom navigation visible
6. ❌ MasonryGrid not styled properly

## UI Issues (Not matching Prism):
1. Header says "Discover" - Prism doesn't have this
2. Search bar placement wrong
3. Category chips should be in a dropdown/menu, not horizontal scroll
4. Missing bottom tabs
5. Colors don't match Prism's theme

## Action Plan:
**Phase 1: Fix Broken Functionality (PRIORITY)**
- Fix all imports/exports
- Make search work
- Make category filtering work
- Add bottom navigation
- Fix routing

**Phase 2: Match Prism UI Exactly**
- Study Prism screenshots/UI
- Recreate exact layout
- Match colors, spacing, fonts
- Add all Prism features

Starting with Phase 1...
