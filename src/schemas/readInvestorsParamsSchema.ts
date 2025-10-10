import * as z from 'zod';

import type { InvestorType } from '../types/InvestorType';

export const readInvestorsParamsSchema = z.object({
  countryCodes: z.array(z.string()).optional(),
  fundingRoundIds: z.array(z.string()).optional(),
  subSectorIds: z.array(z.string()).optional(),
  thesisIds: z.array(z.string()).optional(),
  types: z.array(z.enum<InvestorType[]>(['angel', 'vc'])).optional()
});
