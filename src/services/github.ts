import { Wallpaper } from '../types';

// Using Vercel deployment for images
const BASE_URL = 'https://instimage.vercel.app/images';
const TOTAL_IMAGES = 1600;
const IMAGES_PER_PAGE = 20; // Load only 20 images at a time for smooth performance

export const getWallpapers = async (page: number = 1): Promise<Wallpaper[]> => {
    // Mock Data for Fallback
    const MOCK_WALLPAPERS: Wallpaper[] = [
        {
            id: '1',
            url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=1000&auto=format&fit=crop',
            name: 'Wallpaper 1',
            folder: 'Collection',
            path: 'mock/wallpaper_1.jpg'
        },
        {
            id: '2',
            url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=1000&auto=format&fit=crop',
            name: 'Wallpaper 2',
            folder: 'Collection',
            path: 'mock/wallpaper_2.jpg'
        },
        {
            id: '3',
            url: 'https://images.unsplash.com/photo-1707345512638-997d31a10eaa?q=80&w=1000&auto=format&fit=crop',
            name: 'Wallpaper 3',
            folder: 'Collection',
            path: 'mock/wallpaper_3.jpg'
        }
    ];

    try {
        // Calculate start and end indices for this page
        const startIndex = (page - 1) * IMAGES_PER_PAGE + 1;
        const endIndex = Math.min(page * IMAGES_PER_PAGE, TOTAL_IMAGES);

        // Generate wallpapers array for this page only
        const wallpapers: Wallpaper[] = [];

        for (let i = startIndex; i <= endIndex; i++) {
            // Create categories based on number ranges for organization
            let category = 'Collection';
            if (i <= 200) category = 'Set 1';
            else if (i <= 400) category = 'Set 2';
            else if (i <= 600) category = 'Set 3';
            else if (i <= 800) category = 'Set 4';
            else if (i <= 1000) category = 'Set 5';
            else if (i <= 1200) category = 'Set 6';
            else category = 'Set 7';

            wallpapers.push({
                id: `img-${i}`,
                url: `${BASE_URL}/img%20(${i}).jpg`,
                name: `Wallpaper ${i}`,
                path: `images/img (${i}).jpg`,
                folder: category,
            });
        }

        console.log(`✅ Generated ${wallpapers.length} wallpapers (page ${page}) from Vercel`);
        return wallpapers;

    } catch (error) {
        console.warn('❌ Error generating wallpapers, using mock data:', error);
        return MOCK_WALLPAPERS;
    }
};
