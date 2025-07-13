import React, { useState, useMemo } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GalleryItem from './GalleryItem';
import ImageModal from './ImageModal';
import { Wallpaper, WallpaperFilter } from '../types/wallpaper';
import { generateWallpaperData, filterWallpapers } from '../utils/wallpapers';

interface GalleryProps {
  filter: WallpaperFilter;
  showFavoritesOnly?: boolean;
  favoriteIds?: number[];
}

const BATCH_SIZE = 20;
const TOTAL_IMAGES = 1000;

export default function Gallery({ filter, showFavoritesOnly = false, favoriteIds = [] }: GalleryProps) {
  const [loadedCount, setLoadedCount] = useState(BATCH_SIZE);
  const [loading, setLoading] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);

  // Generate all wallpapers once
  const allWallpapers = useMemo(() => generateWallpaperData(TOTAL_IMAGES), []);

  // Filter wallpapers based on props
  const filteredWallpapers = useMemo(() => {
    let wallpapers = allWallpapers;
    
    if (showFavoritesOnly) {
      wallpapers = wallpapers.filter(w => favoriteIds.includes(w.id));
    }
    
    return filterWallpapers(wallpapers, filter.search, filter.tag);
  }, [allWallpapers, filter, showFavoritesOnly, favoriteIds]);

  // Currently displayed wallpapers
  const displayedWallpapers = filteredWallpapers.slice(0, loadedCount);

  const hasMore = loadedCount < filteredWallpapers.length;

  const handleLoadMore = async () => {
    setLoading(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoadedCount(prev => Math.min(prev + BATCH_SIZE, filteredWallpapers.length));
    setLoading(false);
  };

  // Reset load count when filter changes
  React.useEffect(() => {
    setLoadedCount(BATCH_SIZE);
  }, [filter, showFavoritesOnly]);

  const openModal = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper);
  };

  const closeModal = () => {
    setSelectedWallpaper(null);
  };

  return (
    <>
      {/* Gallery Stats */}
      <div className="flex justify-center mb-8">
        <div className="glass-bg rounded-lg px-6 py-3">
          <span className="text-sm text-gray-300">Showing </span>
          <span className="font-semibold text-purple-400">{displayedWallpapers.length}</span>
          <span className="text-sm text-gray-300"> of {filteredWallpapers.length} wallpapers</span>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 auto-rows-max mb-12">
        {displayedWallpapers.map(wallpaper => (
          <GalleryItem
            key={wallpaper.id}
            wallpaper={wallpaper}
            onClick={() => openModal(wallpaper)}
          />
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <Loader2 className="inline-block h-12 w-12 animate-spin text-purple-500" />
          <p className="mt-4 text-gray-300">Loading amazing wallpapers...</p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="text-center">
          <Button
            onClick={handleLoadMore}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus className="mr-2 h-4 w-4" />
            Load More Wallpapers
          </Button>
        </div>
      )}

      {/* No Results */}
      {displayedWallpapers.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">No Results Found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
          </div>
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        wallpaper={selectedWallpaper}
        isOpen={!!selectedWallpaper}
        onClose={closeModal}
      />
    </>
  );
}
