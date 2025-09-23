import type { FC, JSX } from 'react';

import clsx, { type ClassValue } from 'clsx';

interface HeadingProps {
  children: string;
  className?: ClassValue;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

const headingElements: Record<number, keyof JSX.IntrinsicElements> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6'
};

const headingStyles = {
  1: 'text-3xl font-bold',
  2: 'text-2xl font-semibold',
  3: 'text-xl font-medium',
  4: 'text-lg font-medium',
  5: 'text-base font-medium',
  6: 'text-sm font-medium'
};

export const Heading: FC<HeadingProps> = ({
  children,
  className = '',
  level
}) => {
  const Tag = headingElements[level];

  return (
    <Tag className={clsx(headingStyles[level], className)}>{children}</Tag>
  );
};
