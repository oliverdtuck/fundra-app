import * as z from 'zod';

export const updateCompanyThesesSchema = z.object({
  thesisIds: z.array(z.uuid()).min(1, 'At least one thesis is required')
});
