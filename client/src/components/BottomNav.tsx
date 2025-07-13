import React from 'react';
import { Home, Heart, User } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useFavorites } from '../context/FavoritesContext';
import { useIsMobile } from '@/hooks/use-mobile';

export default function BottomNav() {
  const [location] = useLocation();
  const { favorites } = useFavorites();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const isActive = (path: string) => location === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-bg border-t border-white/10 z-40">
      <div className="flex justify-around py-3">
        <Link href="/" className={`mobile-nav-btn ${isActive('/') ? 'active' : ''}`}>
          <Home className="h-5 w-5 mb-1" />
          <span className="text-xs">Home</span>
        </Link>
        
        <Link href="/favorites" className={`mobile-nav-btn ${isActive('/favorites') ? 'active' : ''} relative`}>
          <Heart className="h-5 w-5 mb-1" />
          <span className="text-xs">Favorites</span>
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-500 text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {favorites.length}
            </span>
          )}
        </Link>
        
        <Link href="/profile" className={`mobile-nav-btn ${isActive('/profile') ? 'active' : ''}`}>
          <User className="h-5 w-5 mb-1" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
