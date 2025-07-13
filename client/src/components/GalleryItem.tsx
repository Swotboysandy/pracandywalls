import React from 'react';
import { Heart } from 'lucide-react';
import { Wallpaper } from '../types/wallpaper';
import { useFavorites } from '../context/FavoritesContext';

interface GalleryItemProps {
  wallpaper: Wallpaper;
  onClick: () => void;
}

export default function GalleryItem({ wallpaper, onClick }: GalleryItemProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isLiked = isFavorite(wallpaper.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(wallpaper.id);
  };

  return (
    <div className="gallery-item animate-fade-in group" onClick={onClick}>
      <img 
        src={wallpaper.url} 
        alt={wallpaper.filename}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          // Fallback for broken images
          const target = e.target as HTMLImageElement;
          target.src = `https://via.placeholder.com/400x720/9333ea/ffffff?text=${encodeURIComponent(wallpaper.filename)}`;
        }}
      />
      <div className="overlay" />
      <button 
        className={`favorite-btn ${isLiked ? 'favorited' : ''}`}
        onClick={handleFavoriteClick}
        aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      </button>
      <div className="info">
        <div className="text-xs font-medium">{wallpaper.filename}</div>
        <div className="text-xs text-gray-300 mt-1">
          {wallpaper.tags.map(tag => `#${tag}`).join(' ')}
        </div>
      </div>
    </div>
  );
}
