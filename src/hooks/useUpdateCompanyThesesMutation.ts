import type { AxiosError, AxiosResponse } from 'axios';

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient
} from '@tanstack/react-query';
import toast from 'react-hot-toast';

import type { CompanyThesis } from '../types/CompanyThesis';
import type { UpdateCompanyThesesSchema } from '../types/UpdateCompanyThesesSchema';

import { api } from '../lib/api';
import { companyThesesSuspenseQueryOptions } from './useCompanyThesesSuspenseQuery';

interface Variables extends UpdateCompanyThesesSchema {
  companyId: string;
}

export const useUpdateCompanyThesesMutation = (
  options?: Omit<
    UseMutationOptions<CompanyThesis[], AxiosError, Variables>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<CompanyThesis[], AxiosError, Variables>({
    ...options,
    mutationFn: async ({ companyId, thesisIds }) => {
      const { data } = await api.put<
        CompanyThesis[],
        AxiosResponse<CompanyThesis[]>,
        UpdateCompanyThesesSchema
      >(`/companies/${companyId}/theses`, {
        thesisIds
      });

      return data;
    },
    onSuccess: async (data, variables, onMutateResult, context) => {
      const { companyId } = variables;
      const { queryKey } = companyThesesSuspenseQueryOptions(companyId);

      await queryClient.invalidateQueries({
        queryKey
      });
      toast.success('Company theses updated successfully!');

      if (options?.onSuccess) {
        await options.onSuccess(data, variables, onMutateResult, context);
      }
    }
  });
};
