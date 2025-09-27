import { Avatar } from '@base-ui-components/react/avatar';
import { Menu } from '@base-ui-components/react/menu';
import {
  createFileRoute,
  Link,
  Outlet,
  useLocation
} from '@tanstack/react-router';
import { LogOut, Settings } from 'lucide-react';
import { type FC, Fragment } from 'react';

import { Header } from '../../components/Header';
import { OnboardingNavigation } from '../../components/OnboardingNavigation';
import {
  OnboardingNavigationLink,
  type OnboardingNavigationLinkProps
} from '../../components/OnboardingNavigationLink';
import { OnboardingNavigationSeparator } from '../../components/OnboardingNavigationSeparator';
import { ProgressBar } from '../../components/ProgressBar';
import { useAuth } from '../../hooks/useAuth';
import {
  companiesSuspenseQueryOptions,
  useCompaniesSuspenseQuery
} from '../../hooks/useCompaniesSuspenseQuery';
import {
  meSuspenseQueryOptions,
  useMeSuspenseQuery
} from '../../hooks/useMeSuspenseQuery';

const Component: FC = () => {
  const auth = useAuth();
  const meSuspenseQuery = useMeSuspenseQuery();
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
  const currentStepIndex = steps.findIndex(
    (step) => step.to === location.pathname
  );
  const progress = ((currentStepIndex + 1) / steps.length) * 100 - 10;

  const signOut = () => {
    void auth.signOut();
  };

  return (
    <>
      <Header>
        <Menu.Root>
          <Menu.Trigger
            render={
              <button type="button">
                <Avatar.Root className="flex size-8 items-center justify-center rounded-full bg-black font-medium text-white">
                  {meSuspenseQuery.data.name.charAt(0)}
                </Avatar.Root>
              </button>
            }
          />
          <Menu.Portal>
            <Menu.Positioner align="end" sideOffset={8}>
              <Menu.Popup className="w-64 rounded-lg border border-gray-300 bg-white p-[0.4375rem] shadow-sm">
                <Menu.Item
                  className="flex items-center justify-between p-2 data-[highlighted]:rounded-lg data-[highlighted]:bg-gray-100"
                  render={<Link to="/settings" />}
                >
                  <span>Settings</span>
                  <Settings className="text-gray-500" size={16} />
                </Menu.Item>
                <Menu.Item
                  className="flex items-center justify-between p-2 data-[highlighted]:rounded-lg data-[highlighted]:bg-gray-100"
                  onClick={signOut}
                >
                  <span>Log Out</span>
                  <LogOut className="text-gray-500" size={16} />
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </Header>
      <main className="flex justify-center px-4 py-16">
        <div className="flex max-w-3xl grow flex-col gap-6">
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
  }
});
