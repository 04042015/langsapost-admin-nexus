// src/components/admin/form/TagMultiSelect.tsx
import { useEffect, useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export interface TagOption {
  id: string;
  name: string;
}

interface TagMultiSelectProps {
  selected: TagOption[];
  onChange: (tags: TagOption[]) => void;
}

export function TagMultiSelect({ selected, onChange }: TagMultiSelectProps) {
  const [tags, setTags] = useState<TagOption[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase.from("tags").select("id, name");
      if (!error && data) setTags(data);
    };
    fetchTags();
  }, []);

  const toggleTag = (tag: TagOption) => {
    if (selected.some((t) => t.id === tag.id)) {
      onChange(selected.filter((t) => t.id !== tag.id));
    } else {
      onChange([...selected, tag]);
    }
  };

  const removeTag = (tagId: string) => {
    onChange(selected.filter((t) => t.id !== tagId));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Tags</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {selected.length > 0
              ? `${selected.length} tag dipilih`
              : "Pilih tags"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Cari tag..." />
            <CommandList>
              {tags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  value={tag.name}
                  onSelect={() => toggleTag(tag)}
                >
                  {selected.some((t) => t.id === tag.id) ? "✓ " : ""} {tag.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2 mt-2">
        {selected.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
            {tag.name}
            <button onClick={() => removeTag(tag.id)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
             }
