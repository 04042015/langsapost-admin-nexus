'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Input } from '@/components/ui/input';

interface FeaturedImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export function FeaturedImageUpload({ value, onChange }: FeaturedImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `featured-images/${Date.now()}.${fileExt}`;

    const { error, data } = await supabase.storage
      .from('media') // pastikan bucket 'media' sudah dibuat
      .upload(filePath, file);

    if (error) {
      alert('Gagal upload gambar');
      console.error(error);
    } else {
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath);
      onChange(urlData.publicUrl);
    }

    setUploading(false);
  };

  return (
    <div className="space-y-2">
      {value && <img src={value} alt="Preview" className="w-full max-w-sm rounded" />}
      <Input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
    </div>
  );
      }
