import * as z from 'zod';

export const createCompanySchema = z.object({
  countryCode: z.string().min(1, 'Country is required'),
  name: z.string().min(1, 'Name is required'),
  website: z.string().optional()
});
