'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { MultiSelect } from '@/components/ui/multi-select'; // pastikan kamu punya komponen ini

interface Tag {
  id: string;
  name: string;
}

interface TagMultiSelectProps {
  values: string[];
  onChange: (values: string[]) => void;
}

export function TagMultiSelect({ values, onChange }: TagMultiSelectProps) {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('tags').select('*').order('name');
      if (!error && data) setTags(data);
    };
    fetchData();
  }, []);

  return (
    <MultiSelect
      options={tags.map(tag => ({ label: tag.name, value: tag.id }))}
      values={values}
      onChange={onChange}
      placeholder="Pilih tag"
    />
  );
}
