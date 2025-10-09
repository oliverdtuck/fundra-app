import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { getCurrentUser } from 'aws-amplify/auth';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    try {
      await getCurrentUser();
    } catch {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/log-in'
      });
    }
  },
  component: Outlet
});
