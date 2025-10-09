import type { AxiosError } from 'axios';

import {
  queryOptions,
  useSuspenseQuery,
  type UseSuspenseQueryOptions
} from '@tanstack/react-query';

import type { Thesis } from '../types/Thesis';

import { api } from '../lib/api';

type ThesesSuspenseQueryOptions = Omit<
  UseSuspenseQueryOptions<Thesis[], AxiosError>,
  'queryFn' | 'queryKey'
>;

const readTheses = async () => {
  const { data } = await api.get<Thesis[]>('/theses');

  return data;
};

export const thesesSuspenseQueryOptions = (
  options?: ThesesSuspenseQueryOptions
) =>
  queryOptions({
    queryFn: readTheses,
    queryKey: ['theses'],
    ...options
  });

export const useThesesSuspenseQuery = (options?: ThesesSuspenseQueryOptions) =>
  useSuspenseQuery(thesesSuspenseQueryOptions(options));
