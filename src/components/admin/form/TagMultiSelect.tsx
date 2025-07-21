import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MultiSelect } from "@/components/ui/multi-select";

export interface TagOption {
  id: string;
  name: string;
}
interface TagMultiSelectProps {
  selected: TagOption[]; // array objek
  onChange: (tags: TagOption[]) => void;
}

export function TagMultiSelect({ selected, onChange }: TagMultiSelectProps) {
  const [tags, setTags] = useState<TagOption[]>([]);

  useEffect(() => {
    supabase.from("tags").select("id, name")
      .order("name")
      .then(({ data }) => data && setTags(data));
  }, []);

  const options = tags.map(tag => ({
    label: tag.name,
    value: tag.id,
  }));

  const selectedOptions = selected.map(t => ({
    label: t.name,
    value: t.id,
  }));

  function handleMultiChange(sel: { label: string; value: string }[]) {
    const arr = sel.map(s => {
      const found = tags.find(t => t.id === s.value);
      return found ?? { id: s.value, name: s.label };
    });
    onChange(arr);
  }

  return (
    <MultiSelect
      options={options}
      selected={selectedOptions}
      onChange={handleMultiChange}
      placeholder="Pilih tag"
    />
  );
      }
