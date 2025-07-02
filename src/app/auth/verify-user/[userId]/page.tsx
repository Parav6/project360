"use client";
import { useForm } from "react-hook-form";
import { verifySchema } from "@/schemas/verifySchema.schema";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function VerifyUser (){

const {
    register,
    handleSubmit,
    formState: { errors,isSubmitting },
    reset
  } = useForm<z.infer<typeof verifySchema>>();

  const router = useRouter();

  const params = useParams();
  const userId = params.userId; // or params['userId']

  const onSubmit = async(data: z.infer<typeof verifySchema>) => {
    console.log("Submitted OTP:", data);
    try {
        const res = await axios.post(`/api/verify-code/${userId}`, data);
        console.log("Verify response:", res.data);
        reset(); 
        router.push("/auth/sign-in"); 
    } catch (error) {
        console.error("verify error:", error);
    }
    // Call your API to verify OTP here
  };

    return(
        <>
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 m-4">
      <h2 className="text-2xl font-bold text-center mb-4 mt-4">Verify your email</h2>
      <p className="text-sm text-gray-600 text-center mb-6 mt-4">
        Please enter the 6-digit code sent to your email.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 mb-4">
        {/* OTP Input */}
        <div className="mb-4">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
            Enter OTP
          </label>
          <input
            id="code"
            type="text"
            maxLength={6}
            {...register("code", {
              required: "OTP is required",
              minLength: { value: 6, message: "OTP must be 6 digits" },
              maxLength: { value: 6, message: "OTP must be 6 digits" },
            })}
            className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-black text-center tracking-widest text-xl mt-2 mb-2"
            placeholder="------"
          />
          {errors.code && <p className="text-red-500 text-sm mt-1 mb-2">{errors.code.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-all mt-4 mb-4"
        >
          {isSubmitting ? "Loading..." : "Verify"}
        </button>
      </form>
      </div>
    </div>
        </>
    )
}
