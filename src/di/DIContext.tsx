'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createClientContainer, type ClientContainer } from './container.client';

const DIContext = createContext<ClientContainer | null>(null);

export function DIProvider({ children }: { children: ReactNode }) {
  const container = useMemo(() => createClientContainer(), []);
  return <DIContext.Provider value={container}>{children}</DIContext.Provider>;
}

export function useDI(): ClientContainer {
  const ctx = useContext(DIContext);
  if (!ctx) throw new Error('useDI must be used within DIProvider');
  return ctx;
}
