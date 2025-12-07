import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { getWallpapers } from '../services/github';
import { defaultDarkTheme } from '../theme/themes';
import { Collection, Notification, SearchFilters, Setup, Theme, UserProfile, Wallpaper } from '../types';

// Wallpaper Store Slice
interface WallpaperState {
    wallpapers: Wallpaper[];
    isLoading: boolean;
    currentPage: number;
    hasMore: boolean;
    searchFilters: SearchFilters;
    fetchWallpapers: (page?: number) => Promise<void>;
    setSearchFilters: (filters: SearchFilters) => void;
    resetWallpapers: () => void;
}

// Favorites Store Slice
interface FavoritesState {
    favorites: Wallpaper[];
    loadFavorites: () => Promise<void>;
    toggleFavorite: (wallpaper: Wallpaper) => Promise<void>;
    isFavorite: (id: string) => boolean;
}

// Collections Store Slice
interface CollectionsState {
    collections: Collection[];
    isLoadingCollections: boolean;
    fetchCollections: () => Promise<void>;
}

// Setups Store Slice
interface SetupsState {
    setups: Setup[];
    isLoadingSetups: boolean;
    fetchSetups: () => Promise<void>;
}

// User Store Slice
interface UserState {
    currentUser: UserProfile | null;
    isAuthenticated: boolean;
    signIn: (user: UserProfile) => void;
    signOut: () => void;
}

// Notifications Store Slice
interface NotificationsState {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    clearAll: () => void;
}

// Theme Store Slice
interface ThemeState {
    currentTheme: Theme;
    isDarkMode: boolean;
    isAmoledMode: boolean;
    setTheme: (theme: Theme) => void;
    toggleDarkMode: () => void;
    toggleAmoledMode: () => void;
}

// Combined Store Type
type Store = WallpaperState &
    FavoritesState &
    CollectionsState &
    SetupsState &
    UserState &
    NotificationsState &
    ThemeState;

export const useStore = create<Store>((set, get) => ({
    // Wallpaper State
    wallpapers: [],
    isLoading: false,
    currentPage: 1,
    hasMore: true,
    searchFilters: {},

    fetchWallpapers: async (page?: number) => {
        const pageToFetch = page !== undefined ? page : get().currentPage;
        set({ isLoading: true });

        try {
            const newWallpapers = await getWallpapers(pageToFetch);

            if (page === 1) {
                set({ wallpapers: newWallpapers, currentPage: 1, hasMore: true });
            } else {
                set({
                    wallpapers: [...get().wallpapers, ...newWallpapers],
                    currentPage: pageToFetch,
                    hasMore: newWallpapers.length > 0,
                });
            }
        } catch (error) {
            console.error('Error fetching wallpapers:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    setSearchFilters: (filters: SearchFilters) => {
        set({ searchFilters: filters });
    },

    resetWallpapers: () => {
        set({ wallpapers: [], currentPage: 1, hasMore: true });
    },

    // Favorites State
    favorites: [],

    loadFavorites: async () => {
        try {
            const stored = await AsyncStorage.getItem('favorites');
            if (stored) {
                set({ favorites: JSON.parse(stored) });
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    },

    toggleFavorite: async (wallpaper: Wallpaper) => {
        const { favorites } = get();
        const index = favorites.findIndex((fav) => fav.id === wallpaper.id);

        let newFavorites: Wallpaper[];
        if (index >= 0) {
            newFavorites = favorites.filter((_, i) => i !== index);
        } else {
            newFavorites = [...favorites, wallpaper];
        }

        set({ favorites: newFavorites });

        try {
            await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    },

    isFavorite: (id: string) => {
        return get().favorites.some((fav) => fav.id === id);
    },

    // Collections State
    collections: [],
    isLoadingCollections: false,

    fetchCollections: async () => {
        set({ isLoadingCollections: true });
        try {
            // TODO: Implement collections API
            // For now, return mock data
            set({ collections: [] });
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            set({ isLoadingCollections: false });
        }
    },

    // Setups State
    setups: [],
    isLoadingSetups: false,

    fetchSetups: async () => {
        set({ isLoadingSetups: true });
        try {
            // TODO: Implement setups API
            set({ setups: [] });
        } catch (error) {
            console.error('Error fetching setups:', error);
        } finally {
            set({ isLoadingSetups: false });
        }
    },

    // User State
    currentUser: null,
    isAuthenticated: false,

    signIn: (user: UserProfile) => {
        set({ currentUser: user, isAuthenticated: true });
    },

    signOut: () => {
        set({ currentUser: null, isAuthenticated: false });
    },

    // Notifications State
    notifications: [],
    unreadCount: 0,

    addNotification: (notification: Notification) => {
        set({
            notifications: [notification, ...get().notifications],
            unreadCount: get().unreadCount + 1,
        });
    },

    markAsRead: (id: string) => {
        const notifications = get().notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
        );
        set({
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
        });
    },

    clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
    },

    // Theme State
    currentTheme: defaultDarkTheme,
    isDarkMode: true,
    isAmoledMode: false,

    setTheme: (theme: Theme) => {
        set({ currentTheme: theme, isDarkMode: theme.isDark });
    },

    toggleDarkMode: () => {
        set({ isDarkMode: !get().isDarkMode });
    },

    toggleAmoledMode: () => {
        set({ isAmoledMode: !get().isAmoledMode });
    },
}));
