"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface GalleryImageUploadProps {
  value?: string[]; // array of URL
  onChange: (urls: string[]) => void;
}

export function GalleryImageUpload({ value = [], onChange }: GalleryImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setLoading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      // TODO: Upload ke Supabase di sini
      const url = URL.createObjectURL(file); // sementara pakai blob preview
      uploadedUrls.push(url);
    }

    setLoading(false);
    onChange([...value, ...uploadedUrls]);
  };

  const handleRemove = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="gallery-upload">Galeri Gambar</Label>
      <Input
        id="gallery-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        disabled={loading}
      />

      {loading && <p className="text-sm text-muted-foreground">Mengunggah gambar...</p>}

      {Array.isArray(value) && value.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-2">
          {value.map((src, idx) => (
            <div key={idx} className="relative group">
              <img
                src={src}
                alt={`Gambar ${idx + 1}`}
                className="h-24 w-24 object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 bg-white/70 hover:bg-red-500 hover:text-white text-red-600 rounded-full p-1 shadow-md transition-opacity opacity-0 group-hover:opacity-100"
                aria-label="Hapus gambar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
      }
