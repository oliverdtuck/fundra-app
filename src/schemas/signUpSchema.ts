import * as z from 'zod';

export const signUpSchema = z.object({
  email: z.email(),
  name: z.string().min(1, 'Name is required'),
  password: z.string().superRefine((password, ctx) => {
    const failed: string[] = [];

    if (password.length < 8) {
      failed.push('at least 8 characters');
    }

    if (!/[a-z]/.test(password)) {
      failed.push('a lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      failed.push('an uppercase letter');
    }

    if (!/\d/.test(password)) {
      failed.push('a number');
    }

    if (!/\W/.test(password)) {
      failed.push('a special character');
    }

    if (failed.length > 0) {
      let message = 'Password must contain ';

      if (failed.length === 1) {
        message += failed[0];
      } else if (failed.length === 2) {
        message += failed.join(' and ');
      } else {
        message +=
          failed.slice(0, -1).join(', ') + ', and ' + failed[failed.length - 1];
      }

      ctx.addIssue({
        code: 'custom',
        message
      });
    }
  })
});
