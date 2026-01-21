'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface ProductFilterProps {
  productId: string;
  onProductIdChange: (id: string) => void;
  productSearch: string;
  onProductSearchChange: (v: string) => void;
  productOptions: Array<{ uuid: string; sku: string; name: string }>;
  productLoading: boolean;
  placeholder?: string;
  showAllOption?: boolean;
}

export default function ProductFilter({
  productId,
  onProductIdChange,
  productSearch,
  onProductSearchChange,
  productOptions,
  productLoading,
  placeholder = 'Search product...',
  showAllOption = false,
}: ProductFilterProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [highlighted, setHighlighted] = React.useState<number>(-1);

  // Show search string in input unless a product is selected
  const inputValue =
    !productId || productId === '__ALL__'
      ? productSearch
      : (() => {
          const found = productOptions.find((p) => p.uuid === productId);
          return found ? `${found.sku}` : productSearch;
        })();

  // Filter productOptions by search string (case-insensitive, match sku or name)
  const filteredOptions = productSearch
    ? productOptions.filter(
        (p) =>
          p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
          p.name.toLowerCase().includes(productSearch.toLowerCase())
      )
    : productOptions;

  // Close dropdown on click outside
  React.useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="min-w-[180px] relative" ref={rootRef}>
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={inputValue}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          onProductSearchChange(e.target.value);
          if (productId !== '') onProductIdChange('');
          setOpen(true);
          setHighlighted(-1);
        }}
        autoComplete="off"
        onKeyDown={(e) => {
          if (!open && (e.key === 'ArrowDown' || e.key === 'Enter'))
            setOpen(true);
          if (!open) return;
          if (e.key === 'ArrowDown') {
            setHighlighted((h) =>
              Math.min(
                h + 1,
                showAllOption
                  ? filteredOptions.length
                  : filteredOptions.length - 1
              )
            );
            e.preventDefault();
          } else if (e.key === 'ArrowUp') {
            setHighlighted((h) => Math.max(h - 1, 0));
            e.preventDefault();
          } else if (e.key === 'Enter') {
            let idx = highlighted;
            if (idx === -1 && showAllOption) idx = 0;
            if (idx === 0 && showAllOption) {
              onProductIdChange('__ALL__');
              onProductSearchChange('');
              setHighlighted(0);
              setOpen(false);
            } else if (
              filteredOptions.length > 0 &&
              (idx > 0 || (!showAllOption && idx >= 0))
            ) {
              const product = filteredOptions[showAllOption ? idx - 1 : idx];
              if (product) {
                onProductIdChange(product.uuid);
                onProductSearchChange(`${product.sku} - ${product.name}`);
                setOpen(false);
              }
            }
            e.preventDefault();
          } else if (e.key === 'Escape') {
            setOpen(false);
          }
        }}
      />
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-background border rounded shadow max-h-48 overflow-y-auto animate-in fade-in-0 zoom-in-95">
          {productLoading ? (
            <div className="p-2 text-sm text-muted-foreground">Loading...</div>
          ) : filteredOptions.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground">
              No products found.
            </div>
          ) : (
            filteredOptions.map((product, i) => {
              const idx = showAllOption ? i + 1 : i;
              return (
                <div
                  key={product.uuid}
                  className={`px-3 py-2 cursor-pointer select-none hover:bg-accent ${highlighted === idx ? 'bg-accent' : productId === product.uuid ? 'bg-accent/50' : ''}`}
                  onMouseEnter={() => setHighlighted(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onProductIdChange(product.uuid);
                    onProductSearchChange(`${product.sku}`);
                    setOpen(false);
                  }}
                >
                  <span className="font-medium">{product.sku}</span>{' '}
                  <span className="text-xs text-muted-foreground">
                    {product.name}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
      {productId && productId !== '__ALL__' && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-2 top-2 h-6 w-6 p-0"
          tabIndex={-1}
          onClick={() => {
            onProductIdChange('');
            onProductSearchChange('');
            setHighlighted(0);
          }}
        >
          <span aria-hidden>×</span>
        </Button>
      )}
    </div>
  );
}
