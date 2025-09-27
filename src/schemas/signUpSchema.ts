import * as z from 'zod';

export const signUpSchema = z.object({
  email: z.email(),
  name: z.string().min(1, 'Name is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
      (password) => /[a-z]/.test(password),
      'Password must contain at least one lowercase letter'
    )
    .refine(
      (password) => /[A-Z]/.test(password),
      'Password must contain at least one uppercase letter'
    )
    .refine(
      (password) => /\d/.test(password),
      'Password must contain at least one number'
    )
    .refine(
      (password) => /\W/.test(password),
      'Password must contain at least one special character'
    )
});
