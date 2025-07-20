'use client';

import { useEffect, useState } from 'react';
import { MultiSelect } from '@/components/ui/multi-select';
import { supabase } from '@/lib/supabase';

export type TagOption = {
  id: string;
  name: string;
};

type TagMultiSelectProps = {
  value?: TagOption[]; // optional untuk handle undefined awal
  onChange: (value: TagOption[]) => void;
};

export function TagMultiSelect({ value = [], onChange }: TagMultiSelectProps) {
  const [tags, setTags] = useState<TagOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('tags')
        .select('id, name')
        .order('name', { ascending: true });

      if (error) {
        setError('Gagal memuat tag.');
        console.error('Fetch tags error:', error);
      } else if (data) {
        setTags(data);
      }

      setLoading(false);
    };

    fetchTags();
  }, []);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Tags</label>

      <MultiSelect
        options={tags.map(tag => ({
          label: tag.name,
          value: tag.id,
        }))}
        selected={value.map(tag => ({
          label: tag.name,
          value: tag.id,
        }))}
        onChange={(selectedOptions) => {
          const selectedTags: TagOption[] = selectedOptions.map(opt => ({
            id: opt.value,
            name: opt.label,
          }));
          onChange(selectedTags);
        }}
        isLoading={loading}
        placeholder={loading ? 'Memuat tag...' : 'Pilih tag...'}
        disabled={loading || tags.length === 0}
      />

      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
                                                                }
