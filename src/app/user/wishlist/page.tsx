"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Products } from "@/models/products.model";
import axios from "axios";


export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<Products[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const fetchWishlist = async () => {
      try {
        const res = await axios.get("/api/wishlist");
        const data = res.data.data || [];
        setWishlist(data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    }
    fetchWishlist();
  },[]);

  const addToCart = async(productId: string) => {
    setLoading(true);
    try {
      await axios.put("/api/cart", {productId, quantity: 1});
    } catch (error) {
      console.error("Error adding to cart:", error);
    }finally{
      setLoading(false);
    }
  };

  if(!wishlist) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-[var(--color-text-primary)]">My Wishlist</h1>
        <p className="text-[var(--color-text-muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-[var(--color-text-primary)]">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">Your wishlist is empty.</p>
      ) : (
        <ul className="space-y-4">
          {wishlist.map((product, idx) => {
            // Pick pastel background variant
            const bgVariants = [
              'var(--color-accent-blue)',
              'var(--color-accent-peach)',
              'var(--color-accent-yellow)',
              'var(--color-accent-green)',
              'var(--color-accent-pink)',
              'var(--color-accent-purple)'
            ];
            const cardBg = bgVariants[idx % bgVariants.length];
            return (
              <li
                key={product._id}
                className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-[2rem] shadow flex items-center justify-between p-4 hover:shadow-md transition"
                style={{background: cardBg}}
              >
                {/* Clickable Item except button */}
                <div
                  onClick={() => router.push(`shop/product/${product._id}`)}
                  className="flex items-center gap-4 cursor-pointer flex-1"
                >
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-[1rem] border border-[var(--color-border)] bg-[var(--color-bg-light)]"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{product.name}</h3>
                    {product.discountPrice ? (
                      <div className="text-sm text-red-600 font-semibold">
                        9{product.discountPrice}{" "}
                        <span className="line-through text-[var(--color-text-muted)] text-xs ml-2">
                          9{product.price}
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm font-semibold text-[var(--color-text-primary)]">
                        9{product.price}
                      </div>
                    )}
                  </div>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={(e) => {
                    // e.stopPropagation();
                    addToCart(product._id);
                  }}
                  className="ml-4 bg-[var(--color-accent-pink)] text-[var(--color-text-primary)] px-4 py-2 rounded-full font-bold shadow hover:bg-[var(--color-accent-yellow)] transition-all"
                >
                  {loading ? "Adding..." : "Add to Cart"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
