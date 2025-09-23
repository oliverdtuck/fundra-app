import type { FC } from 'react';

import { createFileRoute, Outlet } from '@tanstack/react-router';
import { CircleQuestionMark } from 'lucide-react';

import { Header } from '../components/Header';

const Component: FC = () => (
  <>
    <Header>
      <button className="text-gray-500" type="button">
        <CircleQuestionMark />
      </button>
    </Header>
    <main className="flex justify-center px-4 py-16">
      <div className="flex max-w-md grow flex-col gap-6">
        <Outlet />
      </div>
    </main>
  </>
);

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
