import type { AxiosError } from 'axios';

import {
  queryOptions,
  useSuspenseQuery,
  type UseSuspenseQueryOptions
} from '@tanstack/react-query';

import type { Thesis } from '../types/Thesis';

import { api } from '../lib/api';

type CompanyThesesSuspenseQueryOptions = Omit<
  UseSuspenseQueryOptions<Thesis[], AxiosError>,
  'queryFn' | 'queryKey'
>;

export const readCompanyTheses = async (companyId: string) => {
  const { data } = await api.get<Thesis[]>(`/companies/${companyId}/theses`);

  return data;
};

export const companyThesesSuspenseQueryOptions = (
  companyId: string,
  options?: CompanyThesesSuspenseQueryOptions
) =>
  queryOptions({
    queryFn: () => readCompanyTheses(companyId),
    queryKey: ['companies', companyId, 'theses'],
    ...options
  });

export const useCompanyThesesSuspenseQuery = (
  companyId: string,
  options?: CompanyThesesSuspenseQueryOptions
) => useSuspenseQuery(companyThesesSuspenseQueryOptions(companyId, options));
