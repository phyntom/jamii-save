'use client';

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';
import * as React from 'react';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  //Fix hydration issue (ensures the theme is loaded on the client)
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <>{children}</>

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  );
}
