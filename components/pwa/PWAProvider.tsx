'use client';

import { useEffect } from 'react';
import { usePWASession } from '@/hooks/usePWASession';

interface PWAProviderProps {
  userId?: string | number | null;
  children: React.ReactNode;
}

export function PWAProvider({
  userId,
  children,
}: PWAProviderProps) {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register('/sw.js', {
        scope: '/',
      })
      .catch((error) => {
        console.warn('INRA PWA service worker registration failed:', error);
      });
  }, []);

  usePWASession(userId);

  return <>{children}</>;
}