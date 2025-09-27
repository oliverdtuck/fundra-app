import type { FC } from 'react';

import { createFileRoute, redirect } from '@tanstack/react-router';

import { companiesSuspenseQueryOptions } from '../../hooks/useCompaniesSuspenseQuery';
import { companyThesesSuspenseQueryOptions } from '../../hooks/useCompanyThesesSuspenseQuery';

const Component: FC = () => <div>Home</div>;

export const Route = createFileRoute('/_protected/')({
  beforeLoad: async ({ context }) => {
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
    const companyTheses = await queryClient.ensureQueryData(
      companyThesesSuspenseQueryOptions(id)
    );

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

    if (
      !productsAndServices ||
      !targetCustomers ||
      companyTheses.length === 0
    ) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/onboarding/overview'
      });
    }
  },
  component: Component
});
