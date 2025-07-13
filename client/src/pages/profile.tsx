import React from 'react';
import { User, Settings, Heart, Download, Palette } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFavorites } from '../context/FavoritesContext';

export default function Profile() {
  const { favorites } = useFavorites();

  return (
    <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Profile Settings
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Manage your preferences and account settings.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="glass-bg border-white/10">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Guest User</h3>
              <p className="text-gray-400">Wallpaper enthusiast</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-pink-400" />
                  <span className="text-white">Favorites</span>
                </div>
                <span className="font-semibold text-purple-400">{favorites.length}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Download className="h-5 w-5 text-blue-400" />
                  <span className="text-white">Downloads</span>
                </div>
                <span className="font-semibold text-blue-400">0</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Palette className="h-5 w-5 text-indigo-400" />
                  <span className="text-white">Theme</span>
                </div>
                <span className="font-semibold text-indigo-400">Dark</span>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-semibold">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
