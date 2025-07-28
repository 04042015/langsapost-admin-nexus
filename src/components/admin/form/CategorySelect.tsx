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
  <div className="mt-2 text-xs text-gray-600">
  Current selected ID: <code>{value}</code>
</div>

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
  {/* DEBUG: Tampilkan value */}
  {value && (
    <span className="text-xs ml-2 text-gray-500">
      (ID: {value})
    </span>
  )}
</SelectTrigger>
        <SelectContent position="popper" avoidCollisions={false}>
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

      {/* DEBUG LOG (development only) */}
      {process.env.NODE_ENV !== 'production' && (
        <pre className="text-xs text-left bg-gray-100 p-2 mt-4 rounded overflow-x-auto">
{JSON.stringify({ categories, value }, null, 2)}
        </pre>
      )}
    </div>
  );
};
