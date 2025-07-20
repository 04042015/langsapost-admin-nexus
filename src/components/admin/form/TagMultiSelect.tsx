'use client';

import { useEffect, useState } from 'react';
import { MultiSelect, OptionType } from '@/components/ui/multi-select';
import { supabase } from '@/lib/supabase';

export type TagOption = {
  id: string;
  name: string;
};

interface TagMultiSelectProps {
  value: TagOption[];
  onChange: (value: TagOption[]) => void;
  disabled?: boolean;
}

export function TagMultiSelect({ value, onChange, disabled = false }: TagMultiSelectProps) {
  const [tagOptions, setTagOptions] = useState<TagOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.from('tags').select('id, name');
      if (error) {
        console.error('Gagal memuat tags:', error.message);
        setError('Gagal memuat tags');
      } else {
        setTagOptions(data);
      }

      setLoading(false);
    };

    fetchTags();
  }, []);

  const options: OptionType[] = tagOptions.map(tag => ({
    label: tag.name,
    value: tag.id,
  }));

  const selected: OptionType[] = value.map(tag => ({
    label: tag.name,
    value: tag.id,
  }));

  const handleChange = (selectedOptions: OptionType[]) => {
    const selectedTags = selectedOptions.map(opt => ({
      id: opt.value,
      name: opt.label,
    }));
    onChange(selectedTags);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Tags</label>
      <MultiSelect
        options={options}
        selected={selected}
        onChange={handleChange}
        isLoading={loading}
        disabled={disabled}
        placeholder="Pilih tag..."
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
        }
