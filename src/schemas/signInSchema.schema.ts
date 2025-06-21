import {z} from "zod";


export const signInSchema = z.object({
    email: z.string().email({message:"invalid email address"}),
    password: z.string().min(6,{message:"password must be at 6 least characters"}),
    role: z.enum(["customer","employee","admin"])
})