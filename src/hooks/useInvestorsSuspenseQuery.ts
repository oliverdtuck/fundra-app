import type { AxiosError } from 'axios';

import {
  queryOptions,
  useSuspenseQuery,
  type UseSuspenseQueryOptions
} from '@tanstack/react-query';

import type { Investor } from '../types/Investor';
import type { ReadInvestorsParamsSchema } from '../types/ReadInvestorsParamsSchema';

import { api } from '../lib/api';

const readInvestors = async (params?: ReadInvestorsParamsSchema) => {
  const { data } = await api.get<Investor[]>('/investors', {
    params
  });

  return data;
};

type InvestorsSuspenseQueryOptions = Omit<
  UseSuspenseQueryOptions<Investor[], AxiosError>,
  'queryFn' | 'queryKey'
>;

export const investorsSuspenseQueryOptions = (
  params?: ReadInvestorsParamsSchema,
  options?: InvestorsSuspenseQueryOptions
) =>
  queryOptions({
    queryFn: () => readInvestors(params),
    queryKey: ['investors', params],
    ...options
  });

export const useInvestorsSuspenseQuery = (
  params?: ReadInvestorsParamsSchema,
  options?: InvestorsSuspenseQueryOptions
) => useSuspenseQuery(investorsSuspenseQueryOptions(params, options));
