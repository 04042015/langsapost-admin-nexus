"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GalleryImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function GalleryImageUpload({ value, onChange }: GalleryImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setLoading(true);

    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      // TODO: Upload ke Supabase
      const url = URL.createObjectURL(file); // sementara pakai blob URL
      uploadedUrls.push(url);
    }

    setLoading(false);
    onChange([...value, ...uploadedUrls]);
  };

  return (
    <div className="space-y-2">
      <Label>Galeri Gambar</Label>
      <Input type="file" accept="image/*" multiple onChange={handleUpload} />
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((src, idx) => (
          <img key={idx} src={src} className="h-20 w-20 object-cover rounded border" />
        ))}
      </div>
      {loading && <p className="text-sm text-muted-foreground">Mengunggah...</p>}
    </div>
  );
}
