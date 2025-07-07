"use client";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { motion } from "framer-motion";
import {signInSchema} from "@/schemas/signInSchema.schema"
import { z } from "zod";
import axios from "axios";
import { useAppDispatch } from "@/lib/hooks";
import { addUser } from "@/lib/features/project360/userSlice";
import { useRouter } from "next/navigation";
import useUserHook from "@/hooks/userHook";





export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<z.infer<typeof signInSchema>>({
    defaultValues: {
      email: "",
      password: "",
      role: "customer"
    }
  });

  const { refetch } = useUserHook();

  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const res = await axios.post("/api/sign-in", data);
      dispatch(addUser(res.data.data)); 
      reset();
      await refetch();
      router.push("/"); 
      
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2">
              Welcome Back
            </h1>
            <p className="text-[var(--color-text)] text-lg">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-primary)] mb-2">
                Email 
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                id="email"
                {...register("email")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 ${
                  errors.email ? "border-red-500" : "border-[var(--color-secondary)]"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-primary)] mb-2">
                Password
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="password"
                id="password"
                {...register("password")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 ${
                  errors.password ? "border-red-500" : "border-[var(--color-secondary)]"
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Role Input */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-[var(--color-primary)] mb-2">
                Role
              </label>
              <motion.select
                whileFocus={{ scale: 1.02 }}
                id="role"
                {...register("role")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 bg-white ${
                  errors.role ? "border-red-500" : "border-[var(--color-secondary)]"
                }`}
              >
                <option value="customer">Customer</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </motion.select>
              {errors.role && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.role.message}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--color-primary)] text-white font-bold py-3 px-4 rounded-lg hover:bg-[var(--color-accent)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-[var(--color-text)]">
              Don&apos;t have an account?{" "}
              <Link 
                href="/auth/sign-up"
                className="text-[var(--color-primary)] font-semibold hover:text-[var(--color-accent)] transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
