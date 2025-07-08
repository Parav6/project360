"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { addressValidationSchema } from "@/schemas/signUpSchema.schema";
import { z } from "zod";
import axios from "axios";
import { useAppSelector } from "@/lib/hooks";
import Script from "next/script";
import { useRouter } from "next/navigation";

// Add Razorpay type to window
declare global {
  interface Window {
    Razorpay: any;
  }
}


type UserInfo = {
  name: string;
  phone: string;
};

export default function CheckoutPage() {
  const user = useAppSelector((state) => state.user.currentUser);

  const [userInfo, setUserInfo] = useState(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [addresses, setAddresses] = useState<
    z.infer<typeof addressValidationSchema>[] | null
  >(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const Router = useRouter();

  useEffect(() => {
    setUserInfo({ name: user?.name, phone: user?.phone });
    setAddresses(user?.addresses || []);
    const fetchCartItems = async () => {
      try {
        const res = await axios.get("/api/cart");
        setCartItems(res.data.data.items || []);
        const totalPrice = res.data.data.items.reduce(
          (sum, item) =>
            sum +
            (item.product.price -
              (item.product.price * item.product.discount) / 100) *
              item.quantity,
          0
        );
        setTotalPrice(totalPrice);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      }
    };
    fetchCartItems();
  }, [user]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof addressValidationSchema>>();

  const {
    register: userRegister,
    handleSubmit: handleUserSubmit,
    formState: { errors: userErrors },
  } = useForm<UserInfo>({ defaultValues: userInfo });

  const handleUserSave = (data: UserInfo) => {
    setUserInfo(data);
    setIsEditingUser(false);
  };

  const handleAddAddress = (data) => {
    setAddresses((prev) => [...prev, data]);
    reset();
    setShowAddForm(false);
    setSelectedIndex(addresses.length);
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    if (selectedIndex === null) return;
    const address = addresses[selectedIndex];
    const totalAmount = totalPrice;
    const items = cartItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price:
        item.product.price - (item.product.price * item.product.discount) / 100,
    }));

    console.log(items, totalAmount, address);

    try {
      const res = await axios.post("/api/order", { items, totalAmount, address });
      
      console.log("order created******************************")
       // Razorpay integration would go here
    const dataForOrderCreation = {
      orderId:res.data.data._id, 
      totalAmount: totalAmount,
    };

    const orderCreationResponse = await axios.post("/api/payments/create-order", dataForOrderCreation);
    const orderCreationData = orderCreationResponse.data.data;
    console.log("razorpay order created******************************")

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY, 
      amount: Math.round(totalAmount * 100), 
      currency: "INR",
      name: "Clothes Store",
      description: "Order Payment",
      image:"https://example.com/logo.png",
      order_id: orderCreationData.order.id,
      handler: async (response:any) => {
        console.log("verify payment called ******************************")
        const res = await axios.post("/api/payments/verify", {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          orderId: orderCreationData.orderId, 
          paymentLog_orderId:orderCreationData.logId
        });
        const data = res.data.data;
        if (data) {
          setLoading(false);
          alert("Payment successful!");
          Router.push("/user/orders"); 
        } else {
          setLoading(false);
          alert("Payment verification failed. Please try again.");
        }
      },

    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();


    } catch (error) {
      console.log("Payment failed:", error.response.data.errors.itemsOutOfStock);
      console.log(error.status)
      if(error.status==408){
        const errData = error.response.data.errors.itemsOutOfStock;
        const alertMessages = errData.map((data)=>{
          return `the updated stock of product ${data.item.product} is ${data.originalStock}`
        })
        alert(alertMessages.join('\n'));
        setLoading(false);
        return;
      }
    }

    

   
  };

  if (!userInfo || !addresses || cartItems.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Script type="text/javascript" src="https://checkout.razorpay.com/v1/checkout.js" />
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <p className="text-gray-500">Loading user and address information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* User Info */}
      <section className="mb-8 bg-white border rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          <button
            onClick={() => setIsEditingUser((prev) => !prev)}
            className="text-blue-600 text-sm hover:underline"
          >
            {isEditingUser ? "Cancel" : "Edit"}
          </button>
        </div>

        {isEditingUser ? (
          <form
            onSubmit={handleUserSubmit(handleUserSave)}
            className="grid sm:grid-cols-2 gap-4"
          >
            <input
              {...userRegister("name", { required: "Name is required" })}
              className="input"
              placeholder="Full Name"
            />
            <input
              {...userRegister("phone", {
                required: "Phone is required",
                pattern: {
                  value: /^\+[1-9]\d{1,14}$/,
                  message: "Invalid phone format",
                },
              })}
              className="input"
              placeholder="Phone (+91...)"
            />
            <div className="sm:col-span-2">
              <button className="bg-black text-white w-full py-2 rounded mt-2 hover:bg-gray-800">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-gray-700 space-y-1">
            <p>
              <strong>Name:</strong> {userInfo.name}
            </p>
            <p>
              <strong>Phone:</strong> {userInfo.phone}
            </p>
          </div>
        )}
      </section>

      {/* Address Section */}
      <section className="mb-8 bg-white border rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Select Delivery Address</h2>
        <div className="space-y-3">
          {addresses.map((address, i) => (
            <div
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`border p-4 rounded cursor-pointer hover:shadow transition ${
                selectedIndex === i
                  ? "border-black bg-gray-50"
                  : "border-gray-300"
              }`}
            >
              <p className="font-semibold">{address.label}</p>
              {selectedIndex === i && (
                <div className="text-sm text-gray-700 mt-2">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} - {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowAddForm((p) => !p)}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          {showAddForm ? "Cancel" : "+ Add New Address"}
        </button>

        {showAddForm && (
          <form
            onSubmit={handleSubmit(handleAddAddress)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6"
          >
            <input
              {...register("label", { required: true })}
              placeholder="Label"
              className="input"
            />
            {errors.label && (
              <p className="text-red-500 text-sm">{errors.label.message}</p>
            )}
            <input
              {...register("street", { required: true })}
              placeholder="Street"
              className="input"
            />
            {errors.street && (
              <p className="text-red-500 text-sm">{errors.street.message}</p>
            )}
            <input
              {...register("city", { required: true })}
              placeholder="City"
              className="input"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city.message}</p>
            )}
            <input
              {...register("state", { required: true })}
              placeholder="State"
              className="input"
            />
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state.message}</p>
            )}
            <input
              {...register("postalCode", { required: true })}
              placeholder="Postal Code"
              className="input"
            />
            {errors.postalCode && (
              <p className="text-red-500 text-sm">
                {errors.postalCode.message}
              </p>
            )}
            <input
              {...register("country", { required: true })}
              placeholder="Country"
              className="input"
            />
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country.message}</p>
            )}
            <div className="sm:col-span-2">
              <button className="bg-black text-white w-full py-2 rounded mt-2 hover:bg-gray-800">
                {isSubmitting ? "Adding..." : "Add Address"}
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Order Summary */}
      <section className="bg-white border rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <p className="text-gray-700 mb-4">Items Total: {totalPrice}</p>

        <button
          disabled={selectedIndex === null}
          onClick={handleRazorpayPayment}
          className={`w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition ${
            selectedIndex === null ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing Payment..." : "Pay with Razorpay"}
        </button>
      </section>
    </div>
  );
}
