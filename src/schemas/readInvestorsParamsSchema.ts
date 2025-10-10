import * as z from 'zod';

import type { InvestorType } from '../types/InvestorType';

export const readInvestorsParamsSchema = z.object({
  countryCode: z.string().optional(),
  fundingRoundId: z.string().optional(),
  subSectorId: z.string().optional(),
  thesisId: z.string().optional(),
  type: z.enum<InvestorType[]>(['angel', 'vc']).optional()
});
