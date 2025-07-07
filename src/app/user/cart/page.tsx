"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);


  useEffect(()=>{
    const fetchCartItems = async () => {
      try {
        const res = await axios.get("/api/cart");
        console.log("Cart items fetched:", res.data.data);
        setCartItems(res.data.data.items || []); 
        const totalPrice = res.data.data.items.reduce(
    (sum, item) => sum + ((item.product.price)-((item.product.price)*(item.product.discount))/100) * item.quantity,
    0
  );
  setTotalPrice(totalPrice);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      }
    }
    fetchCartItems();
  },[]);

  useEffect(() => {
  if (!cartItems) return;
  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      ((item.product.price) - ((item.product.price) * (item.product.discount)) / 100) * item.quantity,
    0
  );
  setTotalPrice(total);
}, [cartItems]);

  const handleRemove = async(id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
    try {
      await axios.delete(`/api/cart/${id}`);
      console.log("Item removed successfully");
    } catch (error) {
      console.log("Failed to remove item:", error);
    }
  };

  const changeQuantity = async(id: string, delta: number) => {
    console.log("Changing quantity for item:", id, "by", delta);
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
            }
          : item
      )
    );
    try {
      await axios.put(`/api/cart/${id}`, {quantity:delta});
      console.log("Quantity updated successfully");
    } catch (error) {
      console.log("Failed to update quantity:", error);
    }
  };

  

  if(!cartItems) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">  
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <p className="text-gray-500">Loading cart items...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item._id}
                className="bg-white border rounded shadow-sm flex items-center justify-between p-4 hover:shadow-md transition"
              >
                {/* Clickable section */}
                <div
                  onClick={() => router.push(`shop/${item.product._id}`)}
                  className="flex items-center gap-4 cursor-pointer flex-1"
                >
                  <img
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">₹{(item.product.price)-((item.product.price)*(item.product.discount))/100} each</p>
                    <p className="text-sm font-bold">
                      Total: ₹{((item.product.price)-((item.product.price)*(item.product.discount))/100) * item.quantity}
                    </p>
                  </div>
                </div>

                {/* Quantity & Remove */}
                <div className="flex items-center gap-2 ml-4 sm:flex-row flex-col">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        changeQuantity(item._id, -1);
                      }}
                      className="px-2 py-1 text-lg font-bold hover:bg-gray-100"
                    >
                      {item.quantity <= 1 ? "Min" : "-"}
                    </button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button disabled={item.quantity >= item.product.stock}
                      onClick={(e) => {
                        e.stopPropagation();
                        changeQuantity(item._id, 1);
                      }}
                      className="px-2 py-1 text-lg font-bold hover:bg-gray-100"
                    >
                      {item.quantity >= item.product.stock ? "Max" : "+"}
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item._id);
                    }}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Summary */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center border-t pt-6">
            <p className="text-xl font-semibold">
              Total Cost: ₹{totalPrice.toLocaleString()}
            </p>
            <button className="mt-4 sm:mt-0 bg-black text-white px-6 py-3 rounded hover:bg-gray-800" onClick={() => router.push("/user/checkout")}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
