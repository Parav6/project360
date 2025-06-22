import { z } from 'zod';

export const updateCartSchema = z.object({
  product: z.string().min(1),
});