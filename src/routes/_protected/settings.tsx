import type { FC } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { Heading } from '../../components/Heading';

const Component: FC = () => <Heading level={1}>Settings</Heading>;

export const Route = createFileRoute('/_protected/settings')({
  component: Component
});
