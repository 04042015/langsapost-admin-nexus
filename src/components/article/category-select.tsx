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
      console.log("Kategori dari Supabase:", data);
      if (!error && data) setCategories(data);
      if (error) console.error("Gagal ambil kategori:", error);
    };
    fetchData();
  }, []);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Pilih kategori" />
      </SelectTrigger>
      <SelectContent>
        {categories.length === 0 ? (
          <div className="p-2 text-sm text-gray-500">Belum ada kategori tersedia</div>
        ) : (
          categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
        }
