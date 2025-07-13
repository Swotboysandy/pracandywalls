import React from 'react';
import { Image, Home, Heart, User } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import SearchBar from './SearchBar';
import TagFilter from './TagFilter';
import { useFavorites } from '../context/FavoritesContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { WallpaperFilter } from '../types/wallpaper';

interface HeaderProps {
  filter: WallpaperFilter;
  onFilterChange: (filter: WallpaperFilter) => void;
}

export default function Header({ filter, onFilterChange }: HeaderProps) {
  const [location] = useLocation();
  const { favorites } = useFavorites();
  const isMobile = useIsMobile();

  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filter, search });
  };

  const handleTagChange = (tag: string) => {
    onFilterChange({ ...filter, tag });
  };

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 glass-bg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Image className="h-5 w-5 text-white" />
            </div>
            {!isMobile && (
              <h1 className="text-xl font-bold">Wallhaven Gallery</h1>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
            <Link href="/favorites" className={`nav-link ${isActive('/favorites') ? 'active' : ''} relative`}>
              <Heart className="mr-2 h-4 w-4" />
              Favorites
              {favorites.length > 0 && (
                <span className="bg-pink-500 text-xs px-2 py-1 rounded-full ml-2 min-w-[20px] text-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link href="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </nav>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            {!isMobile && (
              <SearchBar
                value={filter.search}
                onChange={handleSearchChange}
                className="w-64"
              />
            )}

            {/* Tag Filter */}
            <TagFilter
              value={filter.tag}
              onChange={handleTagChange}
            />
          </div>
        </div>

        {/* Mobile Search */}
        {isMobile && (
          <div className="mt-4">
            <SearchBar
              value={filter.search}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>
        )}
      </div>
    </header>
  );
}
