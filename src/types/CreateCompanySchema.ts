import type * as z from 'zod';

import type { createCompanySchema } from '../schemas/createCompanySchema';

export type CreateCompanySchema = z.infer<typeof createCompanySchema>;
