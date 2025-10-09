import type { AxiosError } from 'axios';

import {
  queryOptions,
  useSuspenseQuery,
  type UseSuspenseQueryOptions
} from '@tanstack/react-query';

import type { FundingRound } from '../types/FundingRound';

import { api } from '../lib/api';

type FundingRoundsSuspenseQueryOptions = Omit<
  UseSuspenseQueryOptions<FundingRound[], AxiosError>,
  'queryFn' | 'queryKey'
>;

const readFundingRounds = async () => {
  const { data } = await api.get<FundingRound[]>('/funding-rounds');

  return data;
};

export const fundingRoundsSuspenseQueryOptions = (
  options?: FundingRoundsSuspenseQueryOptions
) =>
  queryOptions({
    queryFn: readFundingRounds,
    queryKey: ['funding-rounds'],
    ...options
  });

export const useFundingRoundsSuspenseQuery = (
  options?: FundingRoundsSuspenseQueryOptions
) => useSuspenseQuery(fundingRoundsSuspenseQueryOptions(options));
