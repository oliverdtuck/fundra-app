import type { FC } from 'react';

interface ButtonProps {
  children: string;
  type: 'button' | 'submit';
}

export const Button: FC<ButtonProps> = ({ children, type }) => (
  <button
    className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white"
    type={type}
  >
    {children}
  </button>
);
