import type { AxiosError } from 'axios';

import {
  queryOptions,
  useSuspenseQuery,
  type UseSuspenseQueryOptions
} from '@tanstack/react-query';

import type { PrimarySector } from '../types/PrimarySector';

import { api } from '../lib/api';

type PrimarySectorsSuspenseQueryOptions = Omit<
  UseSuspenseQueryOptions<PrimarySector[], AxiosError>,
  'queryFn' | 'queryKey'
>;

export const readPrimarySectors = async () => {
  const { data } = await api.get<PrimarySector[]>('/primary-sectors');

  return data;
};

export const primarySectorsSuspenseQueryOptions = (
  options?: PrimarySectorsSuspenseQueryOptions
) =>
  queryOptions({
    queryFn: readPrimarySectors,
    queryKey: ['primary-sectors'],
    ...options
  });

export const usePrimarySectorsSuspenseQuery = (
  options?: PrimarySectorsSuspenseQueryOptions
) => useSuspenseQuery(primarySectorsSuspenseQueryOptions(options));
