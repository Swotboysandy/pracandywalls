export interface Wallpaper {
    id: string;
    url: string;
    name: string;
    path: string;
    folder: string;
    isFavorite?: boolean;
}

export type WallpaperStore = {
    wallpapers: Wallpaper[];
    favorites: Wallpaper[];
    fetchWallpapers: () => Promise<void>;
    toggleFavorite: (wallpaper: Wallpaper) => void;
    isLoading: boolean;
};
