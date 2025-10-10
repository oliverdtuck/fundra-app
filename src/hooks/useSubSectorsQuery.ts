import type { AxiosError } from 'axios';

import {
  queryOptions,
  useQuery,
  type UseQueryOptions
} from '@tanstack/react-query';

import type { SubSector } from '../types/SubSector';

import { api } from '../lib/api';

const readSubSectors = async (primarySectorId: string) => {
  const { data } = await api.get<SubSector[]>(
    `/primary-sectors/${primarySectorId}/sub-sectors`
  );

  return data;
};

type SubSectorsQueryOptions = Omit<
  UseQueryOptions<SubSector[], AxiosError>,
  'queryFn' | 'queryKey'
>;

export const subSectorsQueryOptions = (
  primarySectorId: string,
  options?: SubSectorsQueryOptions
) =>
  queryOptions({
    queryFn: () => readSubSectors(primarySectorId),
    queryKey: ['primary-sectors', primarySectorId, 'sub-sectors'],
    ...options
  });

export const useSubSectorsQuery = (
  primarySectorId: string,
  options?: SubSectorsQueryOptions
) => useQuery(subSectorsQueryOptions(primarySectorId, options));
