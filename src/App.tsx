import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { type FC, useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './components/AuthProvider';
import { useAuth } from './hooks/useAuth';
import { queryClient } from './queryClient';
import { router } from './router';

const InnerApp: FC = () => {
  const isInitialMount = useRef(true);
  const auth = useAuth();
  const { user } = auth;

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (!user) {
        queryClient.clear();
      }

      void router.invalidate();
    }
  }, [user]);

  return (
    <RouterProvider
      context={{
        auth
      }}
      router={router}
    />
  );
};

export const App: FC = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <InnerApp />
    </QueryClientProvider>
    <Toaster />
  </AuthProvider>
);
