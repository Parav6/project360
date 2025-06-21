import {z} from "zod";



export const addressValidationSchema = z.object({
    label: z.string()
    .min(2,"label must contain at least two characters") 
    .max(100, "label cannot exceed 100 characters"),
    street: z.string().min(1,"Street is required"),
    city: z.string().min(1,"city is required"),
    state : z.string().min(1,"state is required"),
    country: z.string().min(1,"country is required"),
    postalCode: z.string().min(1,"pin code is required"),
});


export const signUpSchema = z.object({
    name: z.string()
          .min(2,"username is too short")
          .max(100, "username is too long"),
    email: z.string().email({message:"invalid email address"}),
    password: z.string().min(6,{message:"password must be at 6 least characters"}),
    role: z.string(),
    phone: z.string().regex(/^\+[1-9]\d{1,14}$/,"Invalid Number"),
    addresses: addressValidationSchema,
});