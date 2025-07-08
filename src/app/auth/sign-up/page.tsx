"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schemas/signUpSchema.schema";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";





export default function SignUp (){
    
    const {
    register,
    handleSubmit,
    formState: { errors,isSubmitting},
    reset
    } = useForm< z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    });

    const router = useRouter();

     const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        try {
            const res = await axios.post("/api/sign-up", data);
            console.log("Sign up response:", res.data);
            reset(); 
            router.push(`/auth/verify-user/${res.data.data._id}`); 
      
    } catch (error) {
      console.error("Sign up error:", error);
    }
        
     }

    return(
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-default)] px-4 py-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-lg bg-[var(--color-bg-light)] rounded-[1.5rem] shadow-xl p-8">
            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Name</label>
                <input {...register("name")} className="w-full px-4 py-3 border border-[var(--color-border)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-pink)] focus:border-transparent transition-all duration-200 bg-[var(--color-bg-light)] text-[var(--color-text-primary)]" />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Email</label>
                <input type="email" {...register("email")} className="w-full px-4 py-3 border border-[var(--color-border)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-pink)] focus:border-transparent transition-all duration-200 bg-[var(--color-bg-light)] text-[var(--color-text-primary)]" />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Password</label>
                <input type="password" {...register("password")} className="w-full px-4 py-3 border border-[var(--color-border)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-pink)] focus:border-transparent transition-all duration-200 bg-[var(--color-bg-light)] text-[var(--color-text-primary)]" />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Phone (+country code)</label>
                <input {...register("phone")} className="w-full px-4 py-3 border border-[var(--color-border)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-pink)] focus:border-transparent transition-all duration-200 bg-[var(--color-bg-light)] text-[var(--color-text-primary)]" />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Role</label>
                <select {...register("role")} className="w-full px-4 py-3 border border-[var(--color-border)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-pink)] focus:border-transparent transition-all duration-200 bg-[var(--color-bg-light)] text-[var(--color-text-primary)]">
                  <option value="customer">Customer</option>
                  <option value="employee">Employee</option>
                </select>
                {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
              </div>
            </div>
            {/* Submit */}
            <button type="submit" className="w-full bg-[var(--color-accent-pink)] text-[var(--color-text-primary)] py-3 rounded-full font-bold text-lg shadow-lg hover:bg-[var(--color-accent-yellow)] transition-all" style={{fontWeight: 700, borderRadius: '9999px'}}>
              {isSubmitting ? "Loading..." : "Sign Up"}
            </button>
            {/* Link to Sign In */}
            <p className="text-center text-sm text-[var(--color-text-secondary)] mt-4">
              Already have an account?{" "}
              <a href="/auth/sign-in" className="text-[var(--color-accent-pink)] font-semibold hover:text-[var(--color-accent-yellow)] transition-colors duration-200">
                Sign In
              </a>
            </p>
          </form>
        </div>
    )
}
