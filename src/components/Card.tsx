import type { FC, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

export const Card: FC<CardProps> = ({ children }) => (
  <div className="flex flex-col gap-6 rounded-lg border border-gray-300 bg-white p-[1.9375rem]">
    {children}
  </div>
);
