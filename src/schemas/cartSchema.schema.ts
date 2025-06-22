import { z } from 'zod';

export const updateCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1)
});