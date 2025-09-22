import type { FC } from 'react';

import { createFileRoute, Outlet } from '@tanstack/react-router';

const Component: FC = () => <Outlet />;

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context }) => {
    const { auth } = context;
    const { user } = auth;

    if (!user) {
      return;
    }
  },
  component: Component
});
