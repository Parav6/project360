"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ratingSchema } from "@/schemas/productsSchema.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams } from "next/navigation";
import type { Products } from "@/models/products.model";



export default function ProductDetailPage() {
  const [product, setProduct] = useState<Products | null>(null);
  const [selectedImg, setSelectedImg] = useState("");
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWish, setLoadingWish] = useState(false);
  // const [newRating, setNewRating] = useState(0);
  // const [newComment, setNewComment] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof ratingSchema>>({
    resolver:zodResolver(ratingSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  })


  const params = useParams();
  const productId = params.productId as string;

 useEffect(() => {
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${productId}`);
      console.log("Product response:", res.data.data);
      if (res.data) {
        setProduct(res.data.data);
        setSelectedImg(res.data.data.images[0]);
        setFeedbacks(res.data.data.rating);
        setSelectedImg(res.data.data.images[0]?.url || "");
      }
    } catch (error) {
      console.log("Error fetching product:", error);
    }
  };
  fetchProduct();
}, [productId]);

if (!product) {
  return <div>Loading...</div>;
}

  const onSubmit = async (data: z.infer<typeof ratingSchema>) => {
    console.log("Feedback submitted:", data);
    setFeedbacks([
      ...feedbacks,
      { name: "You", rating: data.rating, comment: data.comment },
    ]);
    try {
      const res = await axios.post("/api/rate",{...data,productId:product._id});
      console.log("Feedback response:", res.data);
    } catch (error) {
      console.log("Error submitting feedback:", error);
    }finally{
      reset();
    }
  };

  const handleAddToCart = async() => {
    setLoadingCart(true);
    try {
      await axios.put("/api/cart", { productId: product._id, quantity: 1 });
      console.log("Product added to cart successfully");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }finally{
      setLoadingCart(false);
    }
  };

  const handleAddToWishlist = async() => {
    setLoadingWish(true);
    try {
      await axios.post("/api/wishlist", { product: product._id });
      console.log("Product added to wishlist successfully");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }finally{
      setLoadingWish(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Product Detail Heading */}
      <h1 className="text-3xl font-bold mb-6">{product.name}</h1>

      {/* Product Images + Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Image Gallery */}
        <div>
          <img
            src={selectedImg}
            alt="Selected"
            className="w-full h-96 object-cover rounded"
          />
          <div className="flex mt-4 gap-3">
            {Array.isArray(product.images) &&
              product.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={`Thumb ${i}`}
                  onClick={() => setSelectedImg(img.url)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer ${
                    selectedImg === img.url ? "ring-2 ring-black" : ""
                  }`}
                />
              ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <p className="text-gray-700">{product.description}</p>

          <div className="flex items-center gap-3 text-xl font-semibold">
            {product.discountPrice ? (
              <>
                <span className="text-red-600">₹{product.discountPrice}</span>
                <span className="line-through text-gray-500 text-lg">
                  ₹{product.price}
                </span>
              </>
            ) : (
              <span>₹{product.price}</span>
            )}
          </div>

          <p className="text-sm text-gray-600">
            <strong>Category:</strong> {product.category}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Stock:</strong>{" "}
            {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800" onClick={handleAddToCart}>
              {loadingCart ? "Adding..." : "Add to Cart"}
            </button>
            <button className="bg-gray-200 text-black px-5 py-2 rounded hover:bg-gray-300" onClick={handleAddToWishlist}>
              {loadingWish ? "Adding..." : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Customer Feedback</h2>

        {/* Feedback List */}
        <div className="space-y-4 mb-8">
          {feedbacks?.map((f, i) => (
            <div key={i} className="border rounded-md p-4 bg-gray-50 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{f.user}</span>
                <span className="text-yellow-500">⭐ {f.rating} / 5</span>
              </div>
              <p className="text-gray-700 text-sm">{f.comment}</p>
            </div>
          ))}
        </div>

        {/* Add Feedback Form */}
        <div className="bg-white shadow p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Add Your Feedback</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="number"
                {...register("rating", { valueAsNumber: true })}
              />
              {errors.rating && (
                <p className="text-red-500 text-sm">{errors.rating.message}</p>
              )}
              <input
                type="text"
                placeholder="Your comment"
                {...register("comment")}
                className="input"
              />
              {errors.comment && (
                <p className="text-red-500 text-sm">{errors.comment.message}</p>
              )}
              <button
                type="submit"
                className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                {isSubmitting ? "Loading..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
