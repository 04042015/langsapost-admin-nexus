"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface GalleryImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
}

export function GalleryImageUpload({ value = [], onChange }: GalleryImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setLoading(true);

    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      // ✅ TODO: Ganti dengan upload ke Supabase nanti
      const url = URL.createObjectURL(file); // Preview sementara
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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = value.findIndex((url) => url === active.id);
    const newIndex = value.findIndex((url) => url === over.id);

    onChange(arrayMove(value, oldIndex, newIndex));
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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={value} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3 mt-2">
              {value.map((src, idx) => (
                <SortableImageItem
                  key={src}
                  id={src}
                  src={src}
                  onRemove={() => handleRemove(idx)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

interface SortableImageItemProps {
  id: string;
  src: string;
  onRemove: () => void;
}

function SortableImageItem({ id, src, onRemove }: SortableImageItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-2 border rounded-md bg-white dark:bg-zinc-900 shadow-sm"
    >
      <div {...attributes} {...listeners} className="cursor-grab text-muted-foreground">
        <GripVertical size={18} />
      </div>
      <img src={src} alt="preview" className="h-20 w-20 object-cover rounded-md border" />
      <button
        type="button"
        onClick={onRemove}
        className="ml-auto text-red-500 hover:text-red-700"
        aria-label="Hapus gambar"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
          }
