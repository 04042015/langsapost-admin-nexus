import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ArticleStatusSelectProps {
  value: 'draft' | 'scheduled' | 'published';
  onChange: (val: 'draft' | 'scheduled' | 'published') => void;
}

export function ArticleStatusSelect({ value, onChange }: ArticleStatusSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Status artikel" />
      </SelectTrigger>
      <SelectContent position="popper" avoidCollisions={false}>
        <SelectItem value="draft">Draft</SelectItem>
        <SelectItem value="scheduled">Terjadwal</SelectItem>
        <SelectItem value="published">Publish</SelectItem>
      </SelectContent>
    </Select>
  );
}
