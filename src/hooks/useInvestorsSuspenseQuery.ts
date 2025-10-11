import type { AxiosError } from 'axios';

import {
  queryOptions,
  useSuspenseQuery,
  type UseSuspenseQueryOptions
} from '@tanstack/react-query';

import type { Investor } from '../types/Investor';
import type { ReadInvestorsParamsSchema } from '../types/ReadInvestorsParamsSchema';

import { api } from '../lib/api';

interface Data {
  data: Investor[];
  limit: number;
  page: number;
  total: number;
}

const readInvestors = async (params?: ReadInvestorsParamsSchema) => {
  const { data } = await api.get<Data>('/investors', {
    params
  });

  return data;
};

type InvestorsSuspenseQueryOptions = Omit<
  UseSuspenseQueryOptions<Data, AxiosError>,
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
