import React from 'react';
import Gallery from '../components/Gallery';
import { WallpaperFilter } from '../types/wallpaper';

interface HomeProps {
  filter: WallpaperFilter;
}

export default function Home({ filter }: HomeProps) {
  return (
    <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Premium Portrait Wallpapers
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Discover thousands of stunning portrait wallpapers curated for your mobile device. 
          High-quality images optimized for vertical screens.
        </p>
      </div>

      <Gallery filter={filter} />
    </main>
  );
}
