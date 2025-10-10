import type * as z from 'zod';

import type { readInvestorsParamsSchema } from '../schemas/readInvestorsParamsSchema';

export type ReadInvestorsParamsSchema = z.infer<
  typeof readInvestorsParamsSchema
>;
