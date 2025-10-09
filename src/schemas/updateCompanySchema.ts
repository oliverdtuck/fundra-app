import * as z from 'zod';

export const updateCompanySchema = z.object({
  countryCode: z.string().optional(),
  fundingRoundId: z.uuid().optional(),
  name: z.string().optional(),
  productsAndServices: z.string().optional(),
  subSectorId: z.uuid().optional(),
  targetCustomers: z.string().optional(),
  website: z.string().optional()
});
