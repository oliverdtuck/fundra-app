import type { AxiosError, AxiosResponse } from 'axios';

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient
} from '@tanstack/react-query';
import toast from 'react-hot-toast';

import type { Company } from '../types/Company';
import type { CreateCompanySchema } from '../types/CreateCompanySchema';

import { api } from '../lib/api';
import { companiesSuspenseQueryOptions } from './useCompaniesSuspenseQuery';

export const useCreateCompanyMutation = (
  options?: Omit<
    UseMutationOptions<Company, AxiosError, CreateCompanySchema>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<Company, AxiosError, CreateCompanySchema>({
    ...options,
    mutationFn: async (variables) => {
      const { data } = await api.post<
        Company,
        AxiosResponse<Company>,
        CreateCompanySchema
      >('/companies', variables);

      return data;
    },
    onSuccess: async (data, variables, onMutateResult, context) => {
      const { queryKey } = companiesSuspenseQueryOptions();

      await queryClient.invalidateQueries({
        queryKey
      });
      toast.success('Company created successfully!');

      if (options?.onSuccess) {
        await options.onSuccess(data, variables, onMutateResult, context);
      }
    }
  });
};
