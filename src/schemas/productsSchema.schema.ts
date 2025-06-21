import {z} from "zod";

export const ratingSchema = z.object({
    rating:z.number().min(1).max(5),
     comment: z.string().max(500,"words limit exceeds").optional(),
});

export const productsInfoSchema = z.object({
    name: z
    .string({ required_error: "Product name is required" })
    .min(2, "Name must be at least 2 characters"),

  description: z
    .string({ required_error: "Description is required" })
    .min(10, "Description must be at least 10 characters"),

  price: z
    .number({ required_error: "Price is required" })
    .positive("Price must be a positive number"),

  discount: z
    .number()
    .min(0, "Discount can't be negative")
    .max(100, "Discount must be ≤ 100")
    .optional(),

  stock: z
    .number({ required_error: "Stock is required" })
    .int("Stock must be an integer")
    .nonnegative("Stock must be 0 or more"),

  category: z
    .string({ required_error: "Category is required" })
    .min(2, "Category name too short"),

  tags: z.array(z.string()).optional(),

  images: z
    .array(z.string().url("Image must be a valid URL"))
    .min(1, "At least one image is required"),

})