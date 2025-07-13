export interface Wallpaper {
  id: number;
  filename: string;
  url: string;
  tags: string[];
  resolution: string;
  size: string;
  views: number;
}

export interface WallpaperFilter {
  search: string;
  tag: string;
}

export type PageType = 'home' | 'favorites' | 'profile';
