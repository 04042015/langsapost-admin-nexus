import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { MultiSelect } from "@/components/ui/multi-select";

export interface TagOption {
  id: string;
  name: string;
}

interface TagMultiSelectProps {
  value: TagOption[];
  onChange: (value: TagOption[]) => void;
}

export function TagMultiSelect({ value, onChange }: TagMultiSelectProps) {
  const [tags, setTags] = useState<TagOption[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase.from("tags").select("id, name").order("name");
      if (!error && data) setTags(data);
    };
    fetchTags();
  }, []);

  const options = tags.map(tag => ({
    label: tag.name,
    value: tag.id,
  }));

  const selected = Array.isArray(value)
    ? value.map(tag => ({
        label: tag.name,
        value: tag.id,
      }))
    : [];

  const handleChange = (selectedOptions: { label: string; value: string }[]) => {
    const selectedTags: TagOption[] = selectedOptions.map(opt => ({
      id: opt.value,
      name: opt.label,
    }));
    onChange(selectedTags);
  };

  return (
    <MultiSelect
      options={options}
      selected={selected} // ✅ GANTI DARI values → selected
      onChange={handleChange}
      placeholder="Pilih tag"
    />
  );
}
