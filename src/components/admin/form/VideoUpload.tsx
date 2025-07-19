"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface VideoUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export function VideoUpload({ value, onChange }: VideoUploadProps) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    // TODO: Upload ke Supabase
    const url = URL.createObjectURL(file); // sementara pakai blob URL
    onChange(url);

    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <Label>Upload Video</Label>
      <Input type="file" accept="video/*" onChange={handleUpload} />
      {value && (
        <video src={value} controls className="mt-2 w-full max-w-md rounded" />
      )}
      {loading && <p className="text-sm text-muted-foreground">Mengunggah video...</p>}
    </div>
  );
}
