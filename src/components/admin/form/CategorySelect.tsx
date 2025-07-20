// src/components/admin/form/CategorySelect.tsx
import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/types";

interface CategorySelectProps {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ categories, value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Pilih kategori" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
