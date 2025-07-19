"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SeoMetaFieldsProps {
  value: {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
  };
  onChange: (val: SeoMetaFieldsProps["value"]) => void;
}

export function SeoMetaFields({ value, onChange }: SeoMetaFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Meta Title</Label>
        <Input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>
      <div>
        <Label>Meta Description</Label>
        <Textarea
          rows={2}
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
        />
      </div>
      <div>
        <Label>Keywords</Label>
        <Input
          value={value.keywords}
          onChange={(e) => onChange({ ...value, keywords: e.target.value })}
          placeholder="Pisahkan dengan koma, contoh: berita, langsa"
        />
      </div>
      <div>
        <Label>Canonical URL</Label>
        <Input
          value={value.canonical}
          onChange={(e) => onChange({ ...value, canonical: e.target.value })}
        />
      </div>
    </div>
  );
}
