import * as z from 'zod';

export const updateCompanyThesesSchema = z.object({
  thesisIds: z.array(z.uuid())
});
