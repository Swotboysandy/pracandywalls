import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getWallpapers } from '../services/github';
import { Wallpaper, WallpaperStore } from '../types';

interface State extends WallpaperStore {
    searchTerm: string;
    selectedCategory: string;
    setSearchTerm: (term: string) => void;
    setSelectedCategory: (category: string) => void;
    filteredWallpapers: () => Wallpaper[];
    downloadedIds: string[];
    markDownloaded: (id: string) => void;
    currentPage: number;
    hasMorePages: boolean;
    loadMoreWallpapers: () => Promise<void>;
}

export const useStore = create<State>()(
    persist(
        (set, get) => ({
            wallpapers: [],
            favorites: [],
            isLoading: false,
            searchTerm: '', // Text search term
            selectedCategory: 'All', // Default category
            downloadedIds: [],
            currentPage: 1,
            hasMorePages: true,

            fetchWallpapers: async () => {
                set({ isLoading: true, currentPage: 1, wallpapers: [] });
                const wallpapers = await getWallpapers(1);
                set({ wallpapers, isLoading: false, hasMorePages: wallpapers.length === 20 });
            },

            loadMoreWallpapers: async () => {
                const { currentPage, hasMorePages, isLoading } = get();
                if (isLoading || !hasMorePages) return;

                set({ isLoading: true });
                const nextPage = currentPage + 1;
                const newWallpapers = await getWallpapers(nextPage);

                set((state) => ({
                    wallpapers: [...state.wallpapers, ...newWallpapers],
                    currentPage: nextPage,
                    isLoading: false,
                    hasMorePages: newWallpapers.length === 20,
                }));
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
            setSelectedCategory: (category) => set({ selectedCategory: category }),

            filteredWallpapers: () => {
                const { wallpapers, searchTerm, selectedCategory, favorites } = get();

                // Start with category filtering
                let result = wallpapers;

                // Filter by selected category first
                if (selectedCategory === 'Favorites') {
                    result = favorites;
                } else if (selectedCategory === 'Trending') {
                    result = [...wallpapers].sort(() => 0.5 - Math.random());
                } else if (selectedCategory && selectedCategory !== 'All') {
                    result = wallpapers.filter(w =>
                        w.folder.toLowerCase() === selectedCategory.toLowerCase()
                    );
                }

                // Then apply text search if present
                if (searchTerm && searchTerm.trim()) {
                    const lowerTerm = searchTerm.toLowerCase().trim();
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
