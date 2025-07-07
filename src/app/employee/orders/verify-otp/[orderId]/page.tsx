"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {z} from "zod";
import{ verifySchema}from "@/schemas/verifySchema.schema";
import axios from "axios";
import { useParams } from "next/navigation";



export default function VerifyOtpPage() {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof verifySchema>>();

   const params = useParams();
    const orderId = params.orderId as string;

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { success: boolean; message: string }>(null);

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setLoading(true);
    setResult(null);

    try {
      // 👇 Replace this with your actual backend endpoint
      const res =await axios.post("/api/delivery/verify-otp",{...data,orderId:orderId});

      console.log(res.data.data)

      if (res.data.success) {
        setResult({ success: true, message: res.message || "OTP verified successfully!" });
        reset();
      } else {
        setResult({ success: false, message: res.message || "Invalid OTP!" });
      }
    } catch (err) {
      setResult({ success: false, message: "Server error. Try again later."});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Verify OTP</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 shadow rounded">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
          <input
            type="text"
            {...register("otp")}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="e.g. 1234"
          />
          {errors.otp && <p className="text-sm text-red-500 mt-1">{errors.otp.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Result Message */}
        {result && (
          <p
            className={`text-sm font-medium text-center ${
              result.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {result.message}
          </p>
        )}
      </form>
    </div>
  );
}
