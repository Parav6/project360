"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type {Order} from "@/models/orders.model";
import axios from "axios";



// const mockOrders = [
//   {
//     _id: "order123",
//     createdAt: "2025-06-30T13:45:00Z",
//     products: 3,
//     totalAmount: 3498,
//     status: "Placed",
//   },
//   {
//     _id: "order456",
//     createdAt: "2025-06-29T10:00:00Z",
//     products: 2,
//     totalAmount: 2499,
//     status: "Processing",
//   },
//   {
//     _id: "order789",
//     createdAt: "2025-06-28T08:30:00Z",
//     products: 1,
//     totalAmount: 1199,
//     status: "Shipped",
//   },
//   {
//     _id: "order101",
//     createdAt: "2025-06-20T14:10:00Z",
//     products: 4,
//     totalAmount: 4999,
//     status: "Delivered",
//   },
//   {
//     _id: "order111",
//     createdAt: "2025-06-18T12:00:00Z",
//     products: 2,
//     totalAmount: 1599,
//     status: "Cancelled",
//   },
// ];

const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "placed":
      return "bg-yellow-400";
    case "processing":
      return "bg-orange-500";
    case "shipped":
      return "bg-blue-500";
    case "delivered":
      return "bg-green-600";
    case "cancelled":
      return "bg-red-600";
    default:
      return "bg-gray-400";
  }
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/order");
        const data = res.data.data;
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching orders:", error);
      }
    }
    fetchOrders();
  },[]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-[var(--color-text-primary)]">My Orders</h1>
        <p className="text-[var(--color-text-muted)]">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[var(--color-text-primary)]">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              href={`/user/orders/${order._id}`}
              key={order._id}
              className="block border border-[var(--color-border)] rounded-[2rem] shadow hover:shadow-lg transition p-4 bg-[var(--color-bg-light)]"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                {/* Order Info */}
                <div className="mb-2 sm:mb-0">
                  <p className="text-lg font-semibold text-[var(--color-text-primary)]">Order ID: {order._id}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Placed on {new Date(order.createdAt)?.toLocaleDateString()}
                  </p>
                </div>

                {/* Summary Info */}
                <div className="flex flex-wrap gap-4 text-sm sm:text-base text-[var(--color-text-secondary)] items-center">
                  <span> 6d2 {order.products.length} items</span>
                  <span> 4b5 9{order.totalAmount}</span>
                  <span
                    className={`px-3 py-1 text-white text-xs font-semibold rounded-full ${getStatusBadgeColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
