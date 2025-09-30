import type { LucideIcon } from 'lucide-react';
import type { FC, MouseEventHandler } from 'react';

import clsx, { type ClassValue } from 'clsx';

import { Spinner } from './Spinner';

interface ButtonProps {
  children: string;
  className?: ClassValue;
  disabled?: boolean;
  EndIcon?: LucideIcon;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  StartIcon?: LucideIcon;
  type: 'button' | 'submit';
  variant?: 'danger' | 'primary';
}

export const Button: FC<ButtonProps> = ({
  children,
  className,
  disabled,
  EndIcon,
  loading,
  onClick,
  StartIcon,
  type,
  variant = 'primary'
}) => (
  <button
    className={clsx(
      'relative rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-80',
      {
        'bg-black hover:bg-gray-800': variant === 'primary',
        'bg-red-500 hover:bg-red-600': variant === 'danger'
      },
      className
    )}
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    disabled={disabled || loading}
    onClick={onClick}
    type={type}
  >
    <span
      className={clsx('flex items-center justify-center gap-2 text-white', {
        invisible: loading,
        visible: !loading
      })}
    >
      {StartIcon && <StartIcon size={16} />}
      <span className="font-medium">{children}</span>
      {EndIcon && <EndIcon size={16} />}
    </span>
    {loading && (
      <Spinner
        className="absolute top-1/2 left-1/2 -translate-1/2"
        size="sm"
        variant="white"
      />
    )}
  </button>
);
