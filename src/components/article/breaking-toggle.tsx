import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface BreakingToggleProps {
  value: boolean;
  onChange: (val: boolean) => void;
}

export function BreakingToggle({ value, onChange }: BreakingToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch checked={value} onCheckedChange={onChange} />
      <Label>Breaking News</Label>
    </div>
  );
}
