"use client";
import { Button } from "@/components/ui/button";

interface InlineImageUploadProps {
  onUpload: (url: string) => void;
}

export function InlineImageUpload({ onUpload }: InlineImageUploadProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: upload ke Supabase
    const url = URL.createObjectURL(file); // sementara blob
    onUpload(url);
  };

  return (
    <div className="my-2">
      <label className="text-sm font-medium">Upload Gambar Inline</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
    </div>
  );
}
