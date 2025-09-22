import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ context }) => {
    const { auth } = context;
    const { user } = auth;

    if (!user) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/log-in'
      });
    }
  },
  component: Outlet
});
