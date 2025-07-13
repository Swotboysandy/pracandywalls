import React, { useState } from 'react';
import { Heart, Download, Smartphone, Share2, Monitor, Phone, Coffee } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallpaper } from '../types/wallpaper';
import { useFavorites } from '../context/FavoritesContext';
import { downloadWallpaper, shareWallpaper, isMobileDevice } from '../utils/wallpapers';
import { useToast } from '@/hooks/use-toast';

interface ImageModalProps {
  wallpaper: Wallpaper | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({ wallpaper, isOpen, onClose }: ImageModalProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  if (!wallpaper) return null;

  const isLiked = isFavorite(wallpaper.id);
  const isMobile = isMobileDevice();

  const handleFavoriteClick = () => {
    toggleFavorite(wallpaper.id);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: wallpaper.filename,
    });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const success = await downloadWallpaper(wallpaper);
      if (success) {
        toast({
          title: "Download started!",
          description: "Your wallpaper is being downloaded to your device",
        });
      } else {
        toast({
          title: "Download initiated",
          description: "If download doesn't start automatically, try right-clicking the image and selecting 'Save image as'",
        });
      }
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try right-clicking the image and selecting 'Save image as'",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBuyMeCoffee = () => {
    window.open('https://buymeacoffee.com/sandy_dumps', '_blank');
    toast({
      title: "Thank you! ☕",
      description: "Your support helps keep this gallery running!",
    });
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const success = await shareWallpaper(wallpaper);
      if (success) {
        toast({
          title: "Shared successfully!",
          description: "Wallpaper has been shared",
        });
      } else {
        toast({
          title: "Share not available",
          description: "Sharing is not supported on this device",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Unable to share this wallpaper",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleSetWallpaper = () => {
    toast({
      title: "How to set as wallpaper",
      description: isMobile 
        ? "Download the image, then go to Settings > Wallpaper to set it" 
        : "Download the image, then right-click on desktop > Properties > Background",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] bg-black/90 border-white/10 text-white p-6">
        <DialogHeader className="sr-only">
          <DialogTitle>Wallpaper Preview - {wallpaper.filename}</DialogTitle>
          <DialogDescription>
            Preview and download {wallpaper.filename}. Tags: {wallpaper.tags.join(', ')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-4">
            <h3 className="text-xl font-semibold">{wallpaper.filename}</h3>
            <div className="flex space-x-2">
              {wallpaper.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-purple-500/20 text-purple-300">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 flex items-center justify-center mb-4">
            <img 
              src={wallpaper.url} 
              alt={wallpaper.filename}
              className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <Button
              onClick={handleFavoriteClick}
              className={`${
                isLiked 
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700' 
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
              } font-semibold transition-all duration-300 transform hover:scale-105`}
            >
              <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
            
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </Button>

            {isMobile && (
              <Button
                onClick={handleShare}
                disabled={isSharing}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                <Share2 className="mr-2 h-4 w-4" />
                {isSharing ? 'Sharing...' : 'Share'}
              </Button>
            )}
            
            <Button
              onClick={handleBuyMeCoffee}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <Coffee className="mr-2 h-4 w-4" />
              Buy me a coffee ☕
            </Button>
            
            <Button
              onClick={handleSetWallpaper}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <Smartphone className="mr-2 h-4 w-4" />
              How to Set
            </Button>
          </div>

          {/* Metadata */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Resolution:</span>
                <span className="block font-semibold">{wallpaper.resolution}</span>
              </div>
              <div>
                <span className="text-gray-400">Size:</span>
                <span className="block font-semibold">{wallpaper.size}</span>
              </div>
              <div>
                <span className="text-gray-400">Format:</span>
                <span className="block font-semibold">JPEG</span>
              </div>
              <div>
                <span className="text-gray-400">Views:</span>
                <span className="block font-semibold">{(wallpaper.views / 1000).toFixed(1)}K</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
