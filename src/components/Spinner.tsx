import type { FC } from 'react';

import clsx, { type ClassValue } from 'clsx';

interface SpinnerProps {
  className?: ClassValue;
  size?: 'md' | 'sm';
  variant?: 'default' | 'white';
}

export const Spinner: FC<SpinnerProps> = ({
  className,
  size = 'md',
  variant = 'default'
}) => (
  <span
    aria-label="Loading"
    className={clsx(
      'animate-spin rounded-full',
      {
        'border-x-gray-200 border-t-black border-b-gray-200':
          variant === 'default',
        'border-x-white/30 border-t-white border-b-white/30':
          variant === 'white',
        'size-4 border-2': size === 'sm',
        'size-8 border-4': size === 'md'
      },
      className
    )}
    role="status"
  />
);
