'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SunMedium, MoonStar } from 'lucide-react';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Button variant="outline" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
      {resolvedTheme === 'dark' ? (
        <SunMedium />
      ) : (
        <MoonStar />
      )}
    </Button>
  );
}
