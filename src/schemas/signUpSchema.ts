import * as z from 'zod';

export const signUpSchema = z.object({
  email: z.email(),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});
