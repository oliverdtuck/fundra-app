import type { AxiosError } from 'axios';

import {
  queryOptions,
  useSuspenseQuery,
  type UseSuspenseQueryOptions
} from '@tanstack/react-query';

import type { Company } from '../types/Company';

import { api } from '../lib/api';

type CompaniesSuspenseQueryOptions = Omit<
  UseSuspenseQueryOptions<Company[], AxiosError>,
  'queryFn' | 'queryKey'
>;

export const readCompanies = async () => {
  const { data } = await api.get<Company[]>('/companies');

  return data;
};

export const companiesSuspenseQueryOptions = (
  options?: CompaniesSuspenseQueryOptions
) =>
  queryOptions({
    queryFn: readCompanies,
    queryKey: ['companies'],
    ...options
  });

export const useCompaniesSuspenseQuery = (
  options?: CompaniesSuspenseQueryOptions
) => useSuspenseQuery(companiesSuspenseQueryOptions(options));
