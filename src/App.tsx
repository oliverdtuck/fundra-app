import type { FC } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';

import { queryClient } from './queryClient';
import { router } from './router';

export const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <Toaster />
  </QueryClientProvider>
);
