'use client';

import * as React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Category } from '@/types';

interface CategorySelectProps {
  categories?: Category[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  categories = [],
  value,
  onChange,
  disabled = false,
}) => {
  const isEmpty = categories.length === 0;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Kategori</label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled || isEmpty}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={isEmpty ? 'Kategori belum tersedia' : 'Pilih kategori'}
          />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isEmpty && (
        <p className="text-sm text-red-500 mt-1">
          Tidak ada kategori tersedia.
        </p>
      )}
    </div>
  );
};
