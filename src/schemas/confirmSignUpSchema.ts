import * as z from 'zod';

export const confirmSignUpSchema = z.object({
  code: z.string()
});
