'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';

export interface DateFilterProps {
  label?: string;
  value: string;
  onChange: (date: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function DateFilter({
  label,
  value,
  onChange,
  min,
  max,
  placeholder = 'Select date',
  disabled = false,
}: DateFilterProps) {
  return (
    <div className="flex flex-col gap-1 min-w-[160px]">
      {label && (
        <span className="text-xs text-muted-foreground mb-1">{label}</span>
      )}
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
}
