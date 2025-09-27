import type { FC } from 'react';

import { createFileRoute } from '@tanstack/react-router';

const Component: FC = () => <>Company</>;

export const Route = createFileRoute('/_protected/companies/$companyId/')({
  component: Component
});
