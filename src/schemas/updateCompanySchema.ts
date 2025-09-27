import * as z from 'zod';

import type { FundingRound } from '../types/FundingRound';

export const updateCompanySchema = z.object({
  countryCode: z.string().optional(),
  fundingRound: z
    .enum<FundingRound[]>(['pre_seed', 'seed', 'series_a'])
    .optional(),
  name: z.string().optional(),
  productsAndServices: z.string().optional(),
  subSectorId: z.uuid().optional(),
  targetCustomers: z.string().optional(),
  website: z.string().optional()
});
