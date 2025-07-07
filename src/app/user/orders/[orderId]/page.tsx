"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type {Order} from "@/models/orders.model";
import axios from "axios";



export default function OrderDetailPage() {
  const { orderId } = useParams(); 
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(()=>{
    const fetchOrder = async()=>{
        try {
        const res = await axios.get(`/api/order/${orderId}`)
        const data = res.data.data;
        setOrder(data);
    } catch (error) {
        console.log("error in fetching order",error)
    }
    }
    fetchOrder();
  },[orderId])

  if (!order) {
    return <div className="p-6 text-center text-gray-500">Loading order details...</div>;
  }

  const getPaymentColor = () => {
    switch (order.paymentStatus) {
      case "paid":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getOrderColor = () => {
    switch (order.orderStatus) {
      case "placed":
        return "text-yellow-500";
      case "processing":
        return "text-orange-500";
      case "shipped":
        return "text-blue-500";
      case "delivered":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Order ID */}
      <h1 className="text-2xl font-bold mb-2">Order ID: {order._id}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Placed on {new Date(order.createdAt).toLocaleDateString()}
      </p>

      {/* Products Section */}
      <div className="bg-white border rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <ul className="space-y-4">
          {order.products.map((product) => (
            <li
              key={product._id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {product.quantity}
                </p>
              </div>
              <div className="font-semibold text-right">
                ₹{product.price} each
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t mt-4 pt-4 flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white border rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Delivery Address</h2>
        <div className="text-gray-700 text-sm">
          <p className="font-semibold">{order.address.label}</p>
          <p>{order.address.street}</p>
          <p>
            {order.address.city}, {order.address.state} -{" "}
            {order.address.postalCode}
          </p>
          <p>{order.address.country}</p>
        </div>
      </div>

      {/* Order Meta Info */}
      <div className="bg-white border rounded shadow p-6 mb-6 grid sm:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-500 mb-1">Payment Status</p>
          <p className={`font-semibold ${getPaymentColor()}`}>
            {order.paymentStatus}
          </p>
        </div>

        <div>
          <p className="text-gray-500 mb-1">Order Status</p>
          <p className={`font-semibold ${getOrderColor()}`}>
            {order.orderStatus}
          </p>
        </div>

        <div>
          <p className="text-gray-500 mb-1">Delivery Agent</p>
          <p className="font-medium">{order.deliveryAgent}</p>
          {/* <p className="text-gray-600">{order.deliveryAgent.phone}</p> */}
        </div>
      </div>
    </div>
  );
}
