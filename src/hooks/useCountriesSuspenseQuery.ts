import type { AxiosError } from 'axios';

import {
  queryOptions,
  useSuspenseQuery,
  type UseSuspenseQueryOptions
} from '@tanstack/react-query';

import type { Country } from '../types/Country';

import { api } from '../lib/api';

const readCountries = async () => {
  const { data } = await api.get<Country[]>('/countries');

  return data;
};

type CountriesSuspenseQueryOptions = Omit<
  UseSuspenseQueryOptions<Country[], AxiosError>,
  'queryFn' | 'queryKey'
>;

export const countriesSuspenseQueryOptions = (
  options?: CountriesSuspenseQueryOptions
) =>
  queryOptions({
    queryFn: readCountries,
    queryKey: ['countries'],
    ...options
  });

export const useCountriesSuspenseQuery = (
  options?: CountriesSuspenseQueryOptions
) => useSuspenseQuery(countriesSuspenseQueryOptions(options));
