import type { FC, ReactNode } from 'react';

interface OnboardingNavigationProps {
  children: ReactNode;
}

export const OnboardingNavigation: FC<OnboardingNavigationProps> = ({
  children
}) => (
  <nav aria-label="Onboarding Steps">
    <ol className="flex items-center gap-4">{children}</ol>
  </nav>
);
