import type { FC, ReactNode } from 'react';

import { Logo } from './Logo';

interface HeaderProps {
  children: ReactNode;
}

export const Header: FC<HeaderProps> = ({ children }) => (
  <header className="flex h-14 justify-center border-b border-b-gray-300 bg-white px-4">
    <div className="flex max-w-3xl grow items-center justify-between">
      <Logo />
      {children}
    </div>
  </header>
);
