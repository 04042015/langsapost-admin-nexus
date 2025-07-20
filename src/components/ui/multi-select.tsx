'use client';

import * as React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type Option = {
  label: string;
  value: string;
};

type MultiSelectProps = {
  options: Option[];
  selected?: Option[]; // jadikan opsional
  onChange: (selected: Option[]) => void;
  placeholder?: string;
  isLoading?: boolean;
};

export function MultiSelect({
  options,
  selected = [], // default aman
  onChange,
  placeholder = 'Pilih opsi...',
  isLoading = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleOption = (option: Option) => {
    const exists = selected.some((item) => item.value === option.value);
    if (exists) {
      onChange(selected.filter((item) => item.value !== option.value));
    } else {
      onChange([...selected, option]);
    }
  };

  const isSelected = (option: Option) =>
    selected.some((item) => item.value === option.value);

  const displayLabel = (selected?.length ?? 0) > 0
    ? selected.map((item) => item.label).join(', ')
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
            'hover:border-primary focus:outline-none focus:ring-1 focus:ring-ring'
          )}
        >
          <span className={cn('truncate', (selected?.length ?? 0) === 0 && 'text-muted-foreground')}>
            {displayLabel}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 z-50">
        <Command>
          <CommandInput placeholder="Cari..." />
          <CommandEmpty>{isLoading ? 'Memuat data...' : 'Tidak ditemukan'}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => toggleOption(option)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Check
                    className={cn(
                      'h-4 w-4',
                      isSelected(option) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
      }
