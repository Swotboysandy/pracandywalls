import { Wallpaper } from '../types/wallpaper';

const BASE_IMAGE_URL = 'https://instimage.vercel.app/images';

// Mock tags for filtering
const mockTags = ['nature', 'abstract', 'anime', 'night', 'space', 'minimal', 'city', 'fantasy'];
const mockResolutions = ['1080x1920', '1080x2340', '1440x2960', '1170x2532'];
const mockSizes = ['1.2 MB', '2.4 MB', '3.1 MB', '4.8 MB', '1.8 MB', '2.9 MB'];

// Generate wallpaper data
export function generateWallpaperData(count: number): Wallpaper[] {
  const wallpapers: Wallpaper[] = [];
  
  for (let i = 1; i <= count; i++) {
    wallpapers.push({
      id: i,
      filename: `img (${i}).jpg`,
      url: `${BASE_IMAGE_URL}/img (${i}).jpg`,
      tags: [
        mockTags[Math.floor(Math.random() * mockTags.length)],
        mockTags[Math.floor(Math.random() * mockTags.length)]
      ].filter((tag, index, arr) => arr.indexOf(tag) === index),
      resolution: mockResolutions[Math.floor(Math.random() * mockResolutions.length)],
      size: mockSizes[Math.floor(Math.random() * mockSizes.length)],
      views: Math.floor(Math.random() * 50000) + 1000
    });
  }
  
  return wallpapers;
}

// Filter wallpapers based on search and tag
export function filterWallpapers(wallpapers: Wallpaper[], search: string, tag: string): Wallpaper[] {
  return wallpapers.filter(wallpaper => {
    const matchesSearch = !search || 
      wallpaper.filename.toLowerCase().includes(search.toLowerCase()) ||
      wallpaper.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    
    const matchesTag = !tag || tag === 'all' || wallpaper.tags.includes(tag);
    
    return matchesSearch && matchesTag;
  });
}

// Get all available tags
export function getAllTags(): string[] {
  return mockTags;
}

// Device detection helper
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Enhanced download functionality
export function downloadWallpaper(wallpaper: Wallpaper): Promise<boolean> {
  return new Promise(async (resolve) => {
    try {
      // Try to fetch the image as blob for direct download
      const response = await fetch(wallpaper.url);
      const blob = await response.blob();
      
      // Create object URL from blob
      const blobUrl = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = wallpaper.filename;
      link.style.display = 'none';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      resolve(true);
    } catch (error) {
      console.error('Blob download failed, trying fallback:', error);
      
      // Fallback to direct link download
      try {
        const link = document.createElement('a');
        link.href = wallpaper.url;
        link.download = wallpaper.filename;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        resolve(true);
      } catch (fallbackError) {
        console.error('Fallback download failed:', fallbackError);
        resolve(false);
      }
    }
  });
}

// Copy image URL to clipboard
export function copyImageUrl(wallpaper: Wallpaper): Promise<boolean> {
  return navigator.clipboard.writeText(wallpaper.url).then(() => true).catch(() => false);
}

// Share wallpaper (for mobile devices with Web Share API)
export function shareWallpaper(wallpaper: Wallpaper): Promise<boolean> {
  if (navigator.share) {
    return navigator.share({
      title: `Wallpaper: ${wallpaper.filename}`,
      text: `Check out this amazing wallpaper!`,
      url: wallpaper.url
    }).then(() => true).catch(() => false);
  }
  return Promise.resolve(false);
}
