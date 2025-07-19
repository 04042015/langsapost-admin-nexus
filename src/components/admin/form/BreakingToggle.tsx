"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface BreakingToggleProps {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}

export function BreakingToggle({ checked, onCheckedChange }: BreakingToggleProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <Label>Breaking News</Label>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
