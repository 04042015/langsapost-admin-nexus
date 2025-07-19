"use client";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ArticleStatusSelectProps {
  value: "draft" | "scheduled" | "published";
  onChange: (value: "draft" | "scheduled" | "published") => void;
}

export function ArticleStatusSelect({ value, onChange }: ArticleStatusSelectProps) {
  return (
    <div className="space-y-1.5">
      <Label>Status Artikel</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Pilih status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="scheduled">Terjadwal</SelectItem>
          <SelectItem value="published">Publish</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
