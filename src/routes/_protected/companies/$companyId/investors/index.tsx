import type { FC } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import {
  investorsSuspenseQueryOptions,
  useInvestorsSuspenseQuery
} from '../../../../../hooks/useInvestorsSuspenseQuery';
import { readInvestorsParamsSchema } from '../../../../../schemas/readInvestorsParamsSchema';

const Component: FC = () => {
  const search = Route.useSearch();
  const investorsSuspenseQuery = useInvestorsSuspenseQuery(search);

  return (
    <ul>
      {investorsSuspenseQuery.data.data.map((investor) => (
        <li key={investor.id}>{investor.type}</li>
      ))}
    </ul>
  );
};

export const Route = createFileRoute(
  '/_protected/companies/$companyId/investors/'
)({
  component: Component,
  validateSearch: readInvestorsParamsSchema,
  // eslint-disable-next-line perfectionist/sort-objects
  loaderDeps: ({ search }) => search,
  // eslint-disable-next-line perfectionist/sort-objects
  loader: async ({ context, deps }) => {
    const { queryClient } = context;

    await queryClient.ensureQueryData(investorsSuspenseQueryOptions(deps));
  }
});
