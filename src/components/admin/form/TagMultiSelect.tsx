'use client';

import { useEffect, useState } from 'react';
import { MultiSelect } from '@/components/ui/multi-select';
import { supabase } from '@/lib/supabase';

export type TagOption = {
  id: string;
  name: string;
};

type TagMultiSelectProps = {
  value: TagOption[];
  onChange: (value: TagOption[]) => void;
};

export function TagMultiSelect({ value, onChange }: TagMultiSelectProps) {
  const [tags, setTags] = useState<TagOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('tags').select('id, name');
      if (!error && data) {
        setTags(data);
      }
      setLoading(false);
    };

    fetchTags();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Tags</label>
      <MultiSelect
        options={tags.map(tag => ({ label: tag.name, value: tag.id }))}
        selected={value.map(tag => ({ label: tag.name, value: tag.id }))}
        onChange={(selectedOptions) => {
          const selectedTags: TagOption[] = selectedOptions.map(opt => ({
            id: opt.value,
            name: opt.label,
          }));
          onChange(selectedTags);
        }}
        isLoading={loading}
        placeholder="Pilih tag..."
      />
    </div>
  );
          }
