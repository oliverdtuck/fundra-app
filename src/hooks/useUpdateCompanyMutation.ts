import type { AxiosError, AxiosResponse } from 'axios';

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient
} from '@tanstack/react-query';
import toast from 'react-hot-toast';

import type { Company } from '../types/Company';
import type { UpdateCompanySchema } from '../types/UpdateCompanySchema';

import { api } from '../lib/api';
import { companiesSuspenseQueryOptions } from './useCompaniesSuspenseQuery';

interface Variables extends UpdateCompanySchema {
  companyId: string;
}

export const useUpdateCompanyMutation = (
  options?: Omit<
    UseMutationOptions<Company, AxiosError, Variables>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<Company, AxiosError, Variables>({
    ...options,
    mutationFn: async ({
      companyId,
      countryCode,
      fundingRound,
      name,
      productsAndServices,
      subSectorId,
      targetCustomers,
      website
    }) => {
      const { data } = await api.patch<
        Company,
        AxiosResponse<Company>,
        UpdateCompanySchema
      >(`/companies/${companyId}`, {
        countryCode,
        fundingRound,
        name,
        productsAndServices,
        subSectorId,
        targetCustomers,
        website
      });

      return data;
    },
    onSuccess: async (data, variables, onMutateResult, context) => {
      const { queryKey } = companiesSuspenseQueryOptions();

      await queryClient.invalidateQueries({
        queryKey
      });
      toast.success('Company updated successfully!');

      if (options?.onSuccess) {
        await options.onSuccess(data, variables, onMutateResult, context);
      }
    }
  });
};
