"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {useDebounceCallback} from "usehooks-ts"
import { useAppDispatch } from "@/lib/hooks";
import { addProducts, deleteProducts } from "@/lib/features/project360/productSlice";
import type { Products } from "@/models/products.model";


const ITEMS_PER_PAGE = 20;

export default function ProductPage() {
  const [products, setProducts] = useState<Products[]>([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchPrice, setSearchPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchPriceInput, setSearchPriceInput] = useState("");
//   const [searchClicked, setSearchClicked] = useState(false);
//   const [pageClicked, setPageClicked] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const router = useRouter();

  const debounced = useDebounceCallback(setSearchPrice,900)
  const dispatch = useAppDispatch();

  const categoryOptions = [
    "jeans",
    "shirts",
    "hoodies",
    "jackets",
    "shorts",
    "sweatshirts",
    "t-shirts",
  ];

  useEffect(() => {
    //fetch products with page 1 and limit 20
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/products", {
                params: {
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,      
                    category: searchCategory==="" ? undefined : searchCategory,
                    price: searchPrice ? parseInt(searchPrice) : undefined,
            }});
            setProducts(res.data.data.products);
            dispatch(deleteProducts());
            dispatch(addProducts(res.data.data.products));
            setTotalPages(Math.ceil(res.data.data.productCount / ITEMS_PER_PAGE));
            setLoading(false);
            // searchClicked && setSearchClicked(false);
            // pageClicked && setPageClicked(false);
           
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    fetchProducts();    

  }, [currentPage, searchCategory, searchPrice]);



  if (loading) {
    return <div className="text-center text-[var(--color-text-muted)]">Loading products...</div>;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-[var(--color-text-primary)]">Products</h1>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={searchCategory}
          onChange={(e) => { setSearchCategory(e.target.value); setCurrentPage(1); }}
          className="w-full sm:w-auto px-4 py-3 border border-[var(--color-border)] rounded-full bg-[var(--color-bg-light)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-pink)] transition-all"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Max price"
          value={searchPriceInput}
          onChange={(e) => { setSearchPriceInput(e.target.value); debounced(e.target.value); setCurrentPage(1); }}
          className="w-full sm:w-auto px-4 py-3 border border-[var(--color-border)] rounded-full bg-[var(--color-bg-light)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-pink)] transition-all"
        />
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product, idx) => {
          // Calculate average rating
          let avgRating = 0;
          if (product.ratings && product.ratings.length > 0) {
            const sum = product.ratings.reduce((acc, r) => acc + r.rating, 0);
            avgRating = Number((sum / product.ratings.length).toFixed(1));
          }
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
            <div
              key={product._id}
              onClick={() => router.push(`/user/shop/${product._id}`)}
              className="cursor-pointer border border-[var(--color-border)] rounded-[2rem] shadow p-4 hover:shadow-lg transition flex flex-col items-center"
              style={{background: cardBg}}
            >
              <img
                src={product.images[0]?.url || "/placeholder.png"}
                alt={product.name}
                className="w-full h-40 object-cover rounded-[1rem] mb-4 border border-[var(--color-border)] bg-[var(--color-bg-light)]"
              />
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{product.name}</h3>
              <p className="text-yellow-500 text-sm mb-1"> 50 {avgRating} / 5</p>
              <div className="flex items-center gap-2">
                {product.discount ? (
                  <>
                    <p className="text-red-600 font-bold"> 9{(product.price)-((product.price)*(product.discount))/100}</p>
                    <p className="line-through text-[var(--color-text-muted)]"> 9{product.price}</p>
                  </>
                ) : (
                  <p className="font-bold text-[var(--color-text-primary)]"> 9{product.price}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border border-[var(--color-border)] rounded-full transition-colors duration-200 font-bold ${
              currentPage === i + 1
                ? "bg-[var(--color-accent-pink)] text-[var(--color-text-primary)] border-[var(--color-accent-pink)]"
                : "bg-[var(--color-bg-light)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent-yellow)] border-[var(--color-border)]"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
