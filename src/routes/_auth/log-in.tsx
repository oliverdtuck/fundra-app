import type { FC } from 'react';

import { createFileRoute } from '@tanstack/react-router';

const Component: FC = () => <div>Log In</div>;

export const Route = createFileRoute('/_auth/log-in')({
  component: Component
});
