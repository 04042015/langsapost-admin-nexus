'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Category {
  id: string;
  name: string;
}

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (!error && data) setCategories(data);
    };
    fetchData();
  }, []);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Pilih kategori" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={cat.id}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
