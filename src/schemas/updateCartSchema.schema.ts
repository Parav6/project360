
import { z } from 'zod';

export const updateCartSchema = z.object({
  quantity: z.number().int().min(0, "Quantity must be at least 0"),
});