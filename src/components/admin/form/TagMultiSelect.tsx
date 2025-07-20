import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabase";
import { MultiSelect } from '@/components/ui/multi-select';

type TagOption = {
  id: string;
  name: string;
};

export function TagMultiSelect() {
  const formik = useFormikContext<any>();

  if (!formik) return null;

  const { values, setFieldValue } = formik;
  const [tags, setTags] = useState<TagOption[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name')
        .order('name');

      if (!error && data) {
        setTags(data);
      }
    };
    fetchTags();
  }, []);

  const options = tags.map((tag) => ({
    label: tag.name,
    value: tag.id,
  }));

  const selected = (values.tags ?? []).map((tagId: string) => {
    const found = tags.find((t) => t.id === tagId);
    return found
      ? { label: found.name, value: found.id }
      : { label: tagId, value: tagId };
  });

  const handleChange = (selectedOptions: { label: string; value: string }[]) => {
    const tagIds = selectedOptions.map((opt) => opt.value);
    setFieldValue('tags', tagIds);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Tag</label>
      <MultiSelect
        options={options}
        selected={selected}
        onChange={handleChange}
        placeholder="Pilih tag"
      />
    </div>
  );
}
