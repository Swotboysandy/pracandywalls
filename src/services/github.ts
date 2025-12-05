import axios from 'axios';
import { Wallpaper } from '../types';

const REPO_OWNER = 'Swotboysandy';
const REPO_NAME = 'instimage';
const BRANCH = 'master';
const BASE_RAW_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}`;
const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${BRANCH}?recursive=1`;

export const getWallpapers = async (): Promise<Wallpaper[]> => {
    // Mock Data for Fallback
    const MOCK_WALLPAPERS: Wallpaper[] = [
        {
            id: '1',
            url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=1000&auto=format&fit=crop',
            name: 'Abstract Waves',
            folder: 'Abstract',
            path: 'mock/abstract_waves.jpg'
        },
        {
            id: '2',
            url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=1000&auto=format&fit=crop',
            name: 'Mountain Peak',
            folder: 'Nature',
            path: 'mock/mountain_peak.jpg'
        },
        {
            id: '3',
            url: 'https://images.unsplash.com/photo-1707345512638-997d31a10eaa?q=80&w=1000&auto=format&fit=crop',
            name: 'Neon City',
            folder: 'City',
            path: 'mock/neon_city.jpg'
        },
        {
            id: '4',
            url: 'https://images.unsplash.com/photo-1682695796954-bad25e45562d?q=80&w=1000&auto=format&fit=crop',
            name: 'Desert Dunes',
            folder: 'Nature',
            path: 'mock/desert_dunes.jpg'
        },
        {
            id: '5',
            url: 'https://images.unsplash.com/photo-1706466710402-a16df5d3d4f4?q=80&w=1000&auto=format&fit=crop',
            name: 'Minimal Dark',
            folder: 'Minimal',
            path: 'mock/minimal_dark.jpg'
        },
        {
            id: '6',
            url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
            name: 'Liquid Paint',
            folder: 'Abstract',
            path: 'mock/liquid_paint.jpg'
        }
    ];

    try {
        const response = await axios.get(API_URL);
        const tree = response.data.tree;

        // Filter for files in the 'images' folder and valid extensions
        const imageFiles = tree.filter((item: any) => {
            const isFile = item.type === 'blob';
            const isInImagesFolder = item.path.startsWith('images/');
            const isImage = /\.(jpg|jpeg|png|webp)$/i.test(item.path);
            return isFile && isInImagesFolder && isImage;
        });

        // Map to Wallpaper objects
        const wallpapers = imageFiles.map((item: any) => {
            const pathParts = item.path.split('/');
            // images/Category/filename.jpg
            const filename = pathParts[pathParts.length - 1];
            const folder = pathParts.length > 2 ? pathParts[1] : 'Uncategorized';

            return {
                id: item.sha,
                url: `${BASE_RAW_URL}/${item.path.replace(/ /g, '%20')}`, // Handle spaces
                name: filename.replace(/\.(jpg|jpeg|png|webp)$/i, ''),
                path: item.path,
                folder: folder,
            };
        });

        return wallpapers.length > 0 ? wallpapers : MOCK_WALLPAPERS;

    } catch (error) {
        console.warn('Error fetching wallpapers, using mock data:', error);
        return MOCK_WALLPAPERS;
    }
};
