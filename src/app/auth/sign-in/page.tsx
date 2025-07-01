"use client";
import {z} from "zod";
import {  useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { signInSchema } from "@/schemas/signInSchema.schema";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function SignIn (){

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

     
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
        email: "",
        password: "",
        role: "customer", 
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsLoading(true);
        try {
            const res = await axios.post("/api/sign-in", data);
            setIsLoading(false);
            if (res.status === 200) {
                // Handle successful sign-in, e.g., redirect or show a success message
                console.log("Sign-in successful:", res.data);
            } else {
                // Handle unexpected response status
                setError(`Unexpected response status: ${res.status}`);
            }
        } catch (error) {
            setError(`An error occurred while signing in -> ${error}`);
        }
    }

  
    return(
        <>
<div className="flex flex-col items-center justify-center min-h-150 p-4 border-5 border-white w-100 max-w-md mx-auto bg-black rounded-lg  mt-20">
    <h1 className="text-white text-center">Sign in to your account</h1>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input className="text-white" placeholder="Enter a valid email address" {...field} />
              </FormControl>
              <FormDescription>
                Enter your email address to sign in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input className="text-white" placeholder="Enter password" {...field} />
              </FormControl>
              <FormDescription>
                Enter your password to sign in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input className="text-white" placeholder="customer | employee | admin" {...field} />
              </FormControl>
              <FormDescription>
                Specify your role in the system (customer, employee, admin).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>{isLoading?"Loading":"Submit"}</Button>
      </form>
    </Form>
    <h3 className="text-white text-center">{error}</h3>
</div>
        </>
    )
}
