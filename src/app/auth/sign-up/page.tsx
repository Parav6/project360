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
        <>
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 py-12">
      
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input {...register("name")} className="input" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" {...register("email")} className="input" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" {...register("password")} className="input" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Phone (+country code)</label>
            <input {...register("phone")} className="input" />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Role</label>
            <select {...register("role")} className="input">
              <option value="customer">Customer</option>
              <option value="employee">Employee</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>
        </div>

        {/* Address Info */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Label</label>
            <input {...register("addresses.label")} className="input" />
            {errors.addresses?.label && <p className="text-red-500 text-sm">{errors.addresses.label.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Street</label>
            <input {...register("addresses.street")} className="input" />
            {errors.addresses?.street && <p className="text-red-500 text-sm">{errors.addresses.street.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">City</label>
            <input {...register("addresses.city")} className="input" />
            {errors.addresses?.city && <p className="text-red-500 text-sm">{errors.addresses.city.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">State</label>
            <input {...register("addresses.state")} className="input" />
            {errors.addresses?.state && <p className="text-red-500 text-sm">{errors.addresses.state.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Country</label>
            <input {...register("addresses.country")} className="input" />
            {errors.addresses?.country && <p className="text-red-500 text-sm">{errors.addresses.country.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Postal Code</label>
            <input {...register("addresses.postalCode")} className="input" />
            {errors.addresses?.postalCode && <p className="text-red-500 text-sm">{errors.addresses.postalCode.message}</p>}
          </div>
        </div> */}

        {/* Submit */}
        <button type="submit" className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-all">
          {isSubmitting ? "Loading..." : "Sign Up"}
        </button>

        {/* Link to Sign In */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-black font-semibold hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
    </>
       
    )
}
