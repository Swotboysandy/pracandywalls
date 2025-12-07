// Wallpaper Types
export interface Wallpaper {
    id: string;
    url: string;
    name: string;
    path: string;
    folder?: string;
    category?: string;
    tags?: string[];
    resolution?: string;
    size?: number;
    views?: number;
    downloads?: number;
    favorites?: number;
    colors?: string[];
    dominantColor?: string;
    uploader?: UserProfile;
    uploadedAt?: Date;
    isPremium?: boolean;
}

// Collection Types
export interface Collection {
    id: string;
    name: string;
    description: string;
    coverImage: string;
    wallpapers: Wallpaper[];
    isPremium: boolean;
    category: string;
    updatedAt: Date;
}

// Setup Types (Homescreen Setups)
export interface Setup {
    id: string;
    name: string;
    description: string;
    image: string;
    wallpaper?: Wallpaper;
    iconPack?: string;
    widgetName?: string;
    launcher?: string;
    uploader: UserProfile;
    uploadedAt: Date;
    views: number;
    likes: number;
    isPremium: boolean;
}

// User Profile Types
export interface UserProfile {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    bio?: string;
    isVerified: boolean;
    isPremium: boolean;
    socialLinks?: {
        twitter?: string;
        instagram?: string;
    };
    stats: {
        wallpapers: number;
        setups: number;
        followers: number;
        following: number;
    };
    joinedAt: Date;
}

// Notification Types
export interface Notification {
    id: string;
    type: 'follower' | 'upload_approved' | 'recommendation' | 'post';
    title: string;
    message: string;
    image?: string;
    link?: string;
    read: boolean;
    createdAt: Date;
}

// Theme Types
export interface Theme {
    id: string;
    name: string;
    isDark: boolean;
    colors: {
        primary: string;
        background: string;
        surface: string;
        accent: string;
        text: string;
        textSecondary: string;
        border: string;
        card: string;
    };
}

// Filter Types
export type FilterType =
    | 'none'
    | 'clarendon'
    | 'hudson'
    | 'mayfair'
    | 'rise'
    | 'valencia'
    | 'nashville'
    | 'xpro2'
    | 'willow'
    | 'lofi'
    | 'inkwell'
    | 'sepia'
    | 'vintage'
    | 'warm'
    | 'cool';

export interface FilterConfig {
    type: FilterType;
    intensity: number; // 0-100
}

// Search  & Category Types
export interface SearchFilters {
    keyword?: string;
    color?: string;
    category?: string;
    resolution?: string;
    sortBy?: 'trending' | 'newest' | 'popular' | 'random';
    purity?: 'sfw' | 'sketchy' | 'nsfw';
}

export type Category =
    | 'all'
    | 'trending'
    | 'abstract'
    | 'nature'
    | 'landscape'
    | 'art'
    | '4k'
    | 'sports'
    | 'architecture'
    | 'marvel'
    | 'neon'
    | 'minimal'
    | 'space'
    | 'cars';
