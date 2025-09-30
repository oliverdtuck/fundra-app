import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';
import { type FC, Fragment } from 'react';

import { Header } from '../../components/Header';
import { OnboardingNavigation } from '../../components/OnboardingNavigation';
import {
  OnboardingNavigationLink,
  type OnboardingNavigationLinkProps
} from '../../components/OnboardingNavigationLink';
import { OnboardingNavigationSeparator } from '../../components/OnboardingNavigationSeparator';
import { ProgressBar } from '../../components/ProgressBar';
import { Spinner } from '../../components/Spinner';
import { UserMenu } from '../../components/UserMenu';
import {
  companiesSuspenseQueryOptions,
  useCompaniesSuspenseQuery
} from '../../hooks/useCompaniesSuspenseQuery';
import { meSuspenseQueryOptions } from '../../hooks/useMeSuspenseQuery';

const Component: FC = () => {
  const companiesSuspenseQuery = useCompaniesSuspenseQuery();
  const {
    companyInfo,
    fundingStage,
    overview,
    sector
  }: Record<string, Omit<OnboardingNavigationLinkProps, 'index'>> = {
    companyInfo: {
      children: 'Company Information',
      completed: companiesSuspenseQuery.data.length > 0,
      to: '/onboarding/company-information'
    },
    fundingStage: {
      children: 'Funding Stage',
      completed:
        companiesSuspenseQuery.data.length > 0
          ? companiesSuspenseQuery.data[0].fundingRound !== null
          : false,
      to: '/onboarding/funding-stage'
    },
    overview: {
      children: 'Overview',
      completed: false,
      to: '/onboarding/overview'
    },
    sector: {
      children: 'Sector',
      completed:
        companiesSuspenseQuery.data.length > 0
          ? companiesSuspenseQuery.data[0].subSector !== null
          : false,
      to: '/onboarding/sector'
    }
  };
  const steps: Omit<OnboardingNavigationLinkProps, 'index'>[] = [
    companyInfo,
    {
      ...sector,
      disabled: !companyInfo.completed
    },
    {
      ...fundingStage,
      disabled: !companyInfo.completed || !sector.completed
    },
    {
      ...overview,
      disabled:
        !companyInfo.completed || !sector.completed || !fundingStage.completed
    }
  ];
  const location = useLocation();
  const currentStepIndex = steps.findIndex((step) =>
    step.to ? location.pathname.startsWith(step.to) : false
  );
  const progress = ((currentStepIndex + 1) / steps.length) * 100 - 10;

  return (
    <>
      <Header>
        <UserMenu />
      </Header>
      <main className="flex justify-center px-4 py-16">
        <div className="flex max-w-4xl grow flex-col gap-6">
          <OnboardingNavigation>
            {steps.map(({ children, completed, disabled, to }, index) => (
              <Fragment key={to}>
                <OnboardingNavigationLink
                  completed={completed}
                  disabled={disabled}
                  index={index}
                  to={to}
                >
                  {children}
                </OnboardingNavigationLink>
                {index < steps.length - 1 && <OnboardingNavigationSeparator />}
              </Fragment>
            ))}
          </OnboardingNavigation>
          <ProgressBar value={progress} />
          <Outlet />
        </div>
      </main>
    </>
  );
};

export const Route = createFileRoute('/_protected/_onboarding')({
  component: Component,
  loader: async ({ context }) => {
    const { queryClient } = context;

    await queryClient.ensureQueryData(companiesSuspenseQueryOptions());
    await queryClient.ensureQueryData(meSuspenseQueryOptions());
  },
  pendingComponent: () => (
    <main className="flex h-screen items-center justify-center">
      <Spinner size="lg" />
    </main>
  )
});
