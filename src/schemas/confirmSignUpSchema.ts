import * as z from 'zod';

export const confirmSignUpSchema = z.object({
  confirmationCode: z.string()
});
