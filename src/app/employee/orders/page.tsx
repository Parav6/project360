"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type {Order} from "@/models/orders.model";
import axios from "axios";
import { useAppSelector } from "@/lib/hooks";

// Simulated data structures
// type Address = {
//   street: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   country: string;
// };

// type Order = {
//   _id: string;
//   createdAt: string;
//   deliveredAt?: string;
//   totalItems: number;
//   status: "Placed" | "Processing" | "Shipped" | "Delivered";
//   address: Address;
// };

// 🔁 Mock current + past orders
// const mockCurrentOrder: Order | null = {
//   _id: "orderLive123",
//   createdAt: "2025-07-02T10:00:00Z",
//   totalItems: 3,
//   status: "Shipped",
//   address: {
//     street: "42 MG Road",
//     city: "Pune",
//     state: "Maharashtra",
//     postalCode: "411001",
//     country: "India",
//   },
// };

// const mockPastOrders: Order[] = [
//   {
//     _id: "order789",
//     createdAt: "2025-06-30T12:00:00Z",
//     deliveredAt: "2025-07-01T15:00:00Z",
//     totalItems: 2,
//     status: "Delivered",
//     address: {
//       street: "DLF Cyber City",
//       city: "Gurgaon",
//       state: "Haryana",
//       postalCode: "122002",
//       country: "India",
//     },
//   },
//   {
//     _id: "order654",
//     createdAt: "2025-06-28T11:00:00Z",
//     deliveredAt: "2025-06-29T17:30:00Z",
//     totalItems: 4,
//     status: "Delivered",
//     address: {
//       street: "Indira Nagar",
//       city: "Lucknow",
//       state: "UP",
//       postalCode: "226016",
//       country: "India",
//     },
//   },
// ];

export default function WorkerOrdersPage() {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [pastOrders,setPastOrders] = useState<Order[] | null>(null);
  const[otpLoading,setOtpLoading] = useState(false)
  const router = useRouter();
  
  const user = useAppSelector((state)=>state.user.currentUser);

  useEffect(() => {
    const employeeId = user?._id;
    const fetchData = async()=>{
    try {
      const res = await axios.get(`/api/employee/${employeeId}`);
      const data = res.data.data
      console.log(data);
      const currentOrder = data.allPreviousOrders.filter((order)=>order.orderStatus==="shipped");
      const previousOrders = data.allPreviousOrders.filter((order)=>order.orderStatus!="shipped");
      setCurrentOrder(currentOrder[0]);
      setPastOrders(previousOrders);
    } catch (error) {
      console.log("error in loading data",error)
    }
  };  
  fetchData();
  }, [user]);

  const handleSendOtp = async() => {
    try{
      setOtpLoading(true)
      await axios.post("/api/delivery/send-otp",{orderId:currentOrder._id});
      router.push(`/employee/orders/verify-otp/${currentOrder._id}`);
      setOtpLoading(false)
    }catch(error){
      console.log("unable to send otp",error)
    }
  };



  if(!currentOrder&&!pastOrders){
    return(
      <h1>loading...</h1>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {/* Current Order */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Order</h2>
        {currentOrder ? (
          <div className="bg-white border rounded shadow p-4 space-y-2">
            <p>
              <span className="font-medium">Order ID:</span> {currentOrder._id}
            </p>
            <p>
              <span className="font-medium">Created At:</span>{" "}
              {new Date(currentOrder.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span className="text-blue-600">{currentOrder.orderStatus}</span>
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Address:</span> <br />
              {currentOrder.address.street}, {currentOrder.address.city},{" "}
              {currentOrder.address.state} - {currentOrder.address.postalCode},{" "}
              {currentOrder.address.country}
            </p>
            <p>
              <span className="font-medium">Total Items:</span>{" "}
              {currentOrder.products.length}
            </p>
            <button
              onClick={handleSendOtp}
              disabled={otpLoading}
              className="mt-3 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              {otpLoading?"Sending otp...":"Send OTP & Verify"}
            </button>
          </div>
        ) : (
          <p className="text-gray-600">No order live</p>
        )}
      </div>

      {/* Past Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Past Orders</h2>
        {pastOrders.length === 0 ? (
          <p className="text-gray-600">No past orders</p>
        ) : (
          <ul className="space-y-4">
            {pastOrders.map((order) => (
              <li
                key={order._id}
                className="bg-white border rounded shadow p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-500">
                    Delivered on:{" "}
                    {order.updatedAt
                      ? new Date(order.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <p className="text-sm text-gray-700">
                  Total Items: {order.products.length}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
