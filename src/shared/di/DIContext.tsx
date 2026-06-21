'use client';

import { createDIProvider } from '@handharr-labs/web-client';
import { createClientContainer, type ClientContainer } from './container.client';

export const { DIProvider, useDI } = createDIProvider<ClientContainer>(createClientContainer);
