import { useFormikContext } from 'formik';

export function TagMultiSelect() {
  const { values, setFieldValue } = useFormikContext<any>();
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

  const selected = (values.tag_ids ?? []).map(tag => ({
    label: tag.name,
    value: tag.id,
  }));

  const handleChange = (selectedOptions: { label: string; value: string }[]) => {
    const selectedTags: TagOption[] = selectedOptions.map(opt => ({
      id: opt.value,
      name: opt.label,
    }));
    setFieldValue("tag_ids", selectedTags);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Tag</label>
      <MultiSelect
        options={options}
        values={selected}
        onChange={handleChange}
        placeholder="Pilih tag"
      />
    </div>
  );
}
