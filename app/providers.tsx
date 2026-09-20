'use client';

import * as React from 'react';
import { ThemeProvider as InraThemeProvider } from '@/lib/theme';

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <InraThemeProvider>{children}</InraThemeProvider>;
}