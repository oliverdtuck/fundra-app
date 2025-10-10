import type { AxiosError } from 'axios';

import {
  queryOptions,
  useSuspenseQuery,
  type UseSuspenseQueryOptions
} from '@tanstack/react-query';

import type { User } from '../types/User';

import { api } from '../lib/api';

const readMe = async () => {
  const { data } = await api.get<User>('/users/me');

  return data;
};

type MeSuspenseQueryOptions = Omit<
  UseSuspenseQueryOptions<User, AxiosError>,
  'queryFn' | 'queryKey'
>;

export const meSuspenseQueryOptions = (options?: MeSuspenseQueryOptions) =>
  queryOptions({
    queryFn: readMe,
    queryKey: ['me'],
    ...options
  });

export const useMeSuspenseQuery = (options?: MeSuspenseQueryOptions) =>
  useSuspenseQuery(meSuspenseQueryOptions(options));
