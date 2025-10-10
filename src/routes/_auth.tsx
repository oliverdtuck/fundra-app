import type { FC } from 'react';

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { Header } from '../components/Header';
import { Spinner } from '../components/Spinner';
import { companiesSuspenseQueryOptions } from '../hooks/useCompaniesSuspenseQuery';
import { companyThesesSuspenseQueryOptions } from '../hooks/useCompanyThesesSuspenseQuery';
import { checkAuth } from '../utils/checkAuth';

const Component: FC = () => (
  <>
    <Header />
    <main className="flex justify-center px-4 py-16">
      <div className="flex max-w-md grow flex-col gap-6">
        <Outlet />
      </div>
    </main>
  </>
);

export const Route = createFileRoute('/_auth')({
  component: Component,
  loader: async ({ context }) => {
    const user = await checkAuth();

    if (!user) {
      return;
    }

    const { queryClient } = context;
    const companies = await queryClient.ensureQueryData(
      companiesSuspenseQueryOptions()
    );

    if (companies.length === 0) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/onboarding/company-information'
      });
    }

    const [
      { fundingRound, id, productsAndServices, subSector, targetCustomers }
    ] = companies;

    if (!subSector) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/onboarding/sector'
      });
    }

    if (!fundingRound) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/onboarding/funding-stage'
      });
    }

    if (!productsAndServices) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/onboarding/overview/products-and-services'
      });
    }

    if (!targetCustomers) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/onboarding/overview/target-customers'
      });
    }

    const companyTheses = await queryClient.ensureQueryData(
      companyThesesSuspenseQueryOptions(id)
    );

    if (companyTheses.length === 0) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/onboarding/overview/investment-thesis'
      });
    }

    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({
      params: {
        companyId: id
      },
      to: '/companies/$companyId'
    });
  },
  pendingComponent: () => (
    <main className="flex h-screen items-center justify-center">
      <Spinner size="lg" />
    </main>
  )
});
