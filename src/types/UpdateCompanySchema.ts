import type * as z from 'zod';

import type { updateCompanySchema } from '../schemas/updateCompanySchema';

export type UpdateCompanySchema = z.infer<typeof updateCompanySchema>;
