import type { FC, ReactNode } from 'react';

import { Logo } from './Logo';

interface HeaderProps {
  children?: ReactNode;
}

export const Header: FC<HeaderProps> = ({ children }) => (
  <header className="flex justify-center bg-white p-4 shadow-sm">
    <div className="flex max-w-4xl grow items-center justify-between">
      <Logo />
      {children}
    </div>
  </header>
);
