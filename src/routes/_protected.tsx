import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { checkAuth } from '../utils/checkAuth';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    const user = await checkAuth();

    if (!user) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/log-in'
      });
    }
  },
  component: Outlet
});
