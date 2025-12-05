import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getWallpapers } from '../services/github';
import { Wallpaper, WallpaperStore } from '../types';

interface State extends WallpaperStore {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filteredWallpapers: () => Wallpaper[];
    downloadedIds: string[];
    markDownloaded: (id: string) => void;
}

export const useStore = create<State>()(
    persist(
        (set, get) => ({
            wallpapers: [],
            favorites: [],
            isLoading: false,
            searchTerm: 'All', // Default to All
            downloadedIds: [],

            fetchWallpapers: async () => {
                set({ isLoading: true });
                const wallpapers = await getWallpapers();
                set({ wallpapers, isLoading: false });
            },

            toggleFavorite: (wallpaper) => {
                const { favorites } = get();
                const isFav = favorites.some((f) => f.id === wallpaper.id);
                if (isFav) {
                    set({ favorites: favorites.filter((f) => f.id !== wallpaper.id) });
                } else {
                    set({ favorites: [...favorites, { ...wallpaper, isFavorite: true }] });
                }
            },

            markDownloaded: (id) => {
                const { downloadedIds } = get();
                if (!downloadedIds.includes(id)) {
                    set({ downloadedIds: [...downloadedIds, id] });
                }
            },

            setSearchTerm: (term) => set({ searchTerm: term }),

            filteredWallpapers: () => {
                const { wallpapers, searchTerm, favorites } = get();

                if (searchTerm === 'Favorites') return favorites;

                let result = wallpapers;

                if (searchTerm === 'Trending') {
                    // Simple pseudo-random shuffle for "Trending" feel
                    return [...wallpapers].sort(() => 0.5 - Math.random());
                }

                if (searchTerm && searchTerm !== 'All') {
                    const lowerTerm = searchTerm.toLowerCase();
                    result = result.filter(w =>
                        w.name.toLowerCase().includes(lowerTerm) ||
                        w.folder.toLowerCase().includes(lowerTerm)
                    );
                }

                return result;
            },
        }),
        {
            name: 'wallpaper-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ favorites: state.favorites, wallpapers: state.wallpapers, downloadedIds: state.downloadedIds }),
        }
    )
);
