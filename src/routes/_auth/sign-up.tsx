import type { FC } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { Heading } from '../../components/Heading';

const Component: FC = () => <Heading level={1}>Sign Up</Heading>;

export const Route = createFileRoute('/_auth/sign-up')({
  component: Component
});
