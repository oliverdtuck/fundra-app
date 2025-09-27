import type * as z from 'zod';

import type { updateCompanyThesesSchema } from '../schemas/updateCompanyThesesSchema';

export type UpdateCompanyThesesSchema = z.infer<
  typeof updateCompanyThesesSchema
>;
