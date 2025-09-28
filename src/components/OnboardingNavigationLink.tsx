import type { FC } from 'react';

import { Link, type LinkProps } from '@tanstack/react-router';
import clsx from 'clsx';
import { Check } from 'lucide-react';

export interface OnboardingNavigationLinkProps extends Pick<LinkProps, 'to'> {
  children: string;
  completed: boolean;
  disabled?: boolean;
  index: number;
}

export const OnboardingNavigationLink: FC<OnboardingNavigationLinkProps> = ({
  children,
  completed,
  disabled,
  index,
  to
}) => (
  <Link
    aria-label={`${children}${completed ? ' - completed' : ''}`}
    className="flex items-center gap-4 text-sm disabled:cursor-not-allowed"
    disabled={disabled}
    to={to}
    {...(disabled && {
      'aria-disabled': true,
      tabIndex: -1
    })}
  >
    {({ isActive }) => (
      <>
        <span
          className={clsx(
            'flex size-8 items-center justify-center rounded-full',
            {
              'bg-black text-white': completed,
              'bg-gray-300': !completed
            }
          )}
        >
          {completed ? <Check size={16} /> : index + 1}
        </span>
        <span
          className={clsx('hidden md:block', {
            'text-gray-500': !isActive
          })}
        >
          {children}
        </span>
      </>
    )}
  </Link>
);
