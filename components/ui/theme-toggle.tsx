'use client';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="size-7 p-0 rounded-full shadow-md bg-background"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-3" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
