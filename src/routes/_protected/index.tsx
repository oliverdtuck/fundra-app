import type { FC } from 'react';

import { createFileRoute } from '@tanstack/react-router';

const Component: FC = () => <div>Home</div>;

export const Route = createFileRoute('/_protected/')({
  component: Component
});
