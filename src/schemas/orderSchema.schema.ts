import { z } from 'zod';
import { addressValidationSchema } from './signUpSchema.schema';

export const orderItemSchema = z.object({
  product: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  price: z.number().nonnegative('Price must be 0 or more'), // per-unit price
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
  address: addressValidationSchema,
  totalAmount: z.number().nonnegative(),
});