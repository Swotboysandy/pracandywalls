import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllTags } from '../utils/wallpapers';

interface TagFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TagFilter({ value, onChange }: TagFilterProps) {
  const tags = getAllTags();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-purple-500">
        <SelectValue placeholder="All Tags" />
      </SelectTrigger>
      <SelectContent className="bg-gray-900 border-white/20">
        <SelectItem value="all" className="text-white hover:bg-white/10">All Tags</SelectItem>
        {tags.map(tag => (
          <SelectItem 
            key={tag} 
            value={tag} 
            className="text-white hover:bg-white/10 capitalize"
          >
            {tag}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
