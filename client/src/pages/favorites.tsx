import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import Gallery from '../components/Gallery';
import { useFavorites } from '../context/FavoritesContext';
import { WallpaperFilter } from '../types/wallpaper';

interface FavoritesProps {
  filter: WallpaperFilter;
}

export default function Favorites({ filter }: FavoritesProps) {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">No Favorites Yet</h3>
            <p className="text-gray-400 mb-6">Start exploring and heart your favorite wallpapers to see them here.</p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-semibold">
                Browse Gallery
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Your Favorites
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          All your favorite wallpapers in one place.
        </p>
      </div>

      <Gallery 
        filter={filter} 
        showFavoritesOnly={true} 
        favoriteIds={favorites} 
      />
    </main>
  );
}
