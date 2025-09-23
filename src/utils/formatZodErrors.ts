import * as z from 'zod';

export const formatZodErrors = (error: z.ZodError) => {
  const { fieldErrors } = z.flattenError(error);

  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : ''
    ])
  );
};
