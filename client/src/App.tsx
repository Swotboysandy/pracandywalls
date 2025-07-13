import { useState } from 'react';
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FavoritesProvider } from "./context/FavoritesContext";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Home from "./pages/home";
import Favorites from "./pages/favorites";
import Profile from "./pages/profile";
import NotFound from "@/pages/not-found";
import { WallpaperFilter } from "./types/wallpaper";

function Router() {
  const [filter, setFilter] = useState<WallpaperFilter>({ search: '', tag: 'all' });

  return (
    <div className="min-h-screen flex flex-col">
      <Header filter={filter} onFilterChange={setFilter} />
      
      <div className="flex-1">
        <Switch>
          <Route path="/" component={() => <Home filter={filter} />} />
          <Route path="/favorites" component={() => <Favorites filter={filter} />} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </div>
      
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FavoritesProvider>
          <Toaster />
          <Router />
        </FavoritesProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
