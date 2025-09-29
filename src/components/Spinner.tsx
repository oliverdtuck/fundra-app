import type { FC } from 'react';

import clsx, { type ClassValue } from 'clsx';

interface SpinnerProps {
  className?: ClassValue;
}

export const Spinner: FC<SpinnerProps> = ({ className }) => (
  <span
    className={clsx(
      'size-8 animate-spin rounded-full border-4 border-x-gray-200 border-t-black border-b-gray-200',
      className
    )}
  />
);
