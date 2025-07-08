"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import useUserHook from "@/hooks/userHook";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { deleteUser } from "@/lib/features/project360/userSlice";

type Address = {
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type CustomerFormValues = {
  name: string;
  phone: string;
  addresses: Address[];
};

export default function DynamicAddressProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useUserHook();

  const router = useRouter();

 

  const dispatch = useAppDispatch();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormValues>({
    defaultValues: {
      name: user?.name,
      phone: user?.phone,
      addresses: user?.addresses
    },
  });

  useEffect(() => {
  if (user) {
    reset({
      name: user.name,
      phone: user.phone,
      addresses: user.addresses,
    });
  }
}, [user, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Submitted Data:", data);
      const res = await axios.put("/api/update-profile", data);
      console.log("Response:", res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogOut = async () => {
    try {
      await axios.post("/api/sign-out");  
        dispatch(deleteUser());
        router.push("/");
    } catch (error) {   
        console.error("Logout error:", error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-[var(--color-text-primary)]">Customer Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-[var(--color-bg-light)] shadow-md p-6 rounded-[1.5rem] space-y-6 border border-[var(--color-border)]">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Profile & Addresses</h3>

          <div className="flex gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-sm bg-[var(--color-accent-blue)] text-[var(--color-text-primary)] px-4 py-1 rounded-full hover:bg-[var(--color-accent-yellow)] font-bold"
              >
                Edit
              </button>
            )}
            {isEditing && (
              <button
                type="submit"
                className="text-sm bg-[var(--color-accent-pink)] text-[var(--color-text-primary)] px-4 py-1 rounded-full hover:bg-[var(--color-accent-yellow)] font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 ">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-[var(--color-border)] rounded-full bg-[var(--color-bg-light)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-pink)] transition-all"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Phone</label>
            <input
              {...register("phone", {
                required: "Phone is required",
                pattern: { value: /^\+\d{10,15}$/, message: "Invalid phone number" },
              })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-[var(--color-border)] rounded-full bg-[var(--color-bg-light)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-pink)] transition-all"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Addresses List */}
        <div className="space-y-8">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-[var(--color-bg-muted)] border border-[var(--color-border)] p-4 rounded-[1.5rem] relative">
              <h4 className="font-medium mb-3 text-[var(--color-text-primary)]">Address #{index + 1}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Label", key: "label" },
                  { label: "Street", key: "street" },
                  { label: "City", key: "city" },
                  { label: "State", key: "state" },
                  { label: "Postal Code", key: "postalCode" },
                  { label: "Country", key: "country" },
                ].map((fieldInfo) => (
                  <div key={fieldInfo.key}>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">{fieldInfo.label}</label>
                    <input
                      {...register(`addresses.${index}.${fieldInfo.key}` as const, {
                        required: `${fieldInfo.label} is required`,
                      })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-[var(--color-border)] rounded-full bg-[var(--color-bg-light)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-pink)] transition-all"
                    />
                    {errors?.addresses?.[index]?.[fieldInfo.key as keyof Address] && (
                      <p className="text-red-500 text-sm">
                        {errors.addresses[index]?.[fieldInfo.key as keyof Address]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Remove Address Button */}
              {isEditing && fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add New Address Button */}
        {isEditing && (
          <button
            type="button"
            onClick={() =>
              append({
                label: "",
                street: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
              })
            }
            className="mt-4 w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add New Address
          </button>
        )}
      </form>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <button className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-black px-5 py-2 rounded" onClick={()=>router.push("/user/wishlist")}>
          Wishlist
        </button>
        <button className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-black px-5 py-2 rounded"  onClick={()=>router.push("/user/orders")}>
          Orders
        </button>
        <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded" onClick={handleLogOut}>
          Log Out
        </button>
      </div>
    </div>
  );
}
