"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  rating: number;
  category: string;
};

const DUMMY_PRODUCTS: Product[] = new Array(80).fill(0).map((_, i) => ({
  id: `p${i + 1}`,
  name: `Product ${i + 1}`,
  image: "https://via.placeholder.com/150",
  price: 1000 + i * 100,
  discountPrice: i % 2 === 0 ? 900 + i * 100 : undefined,
  rating: 4 + (i % 2),
  category: i % 2 === 0 ? "clothing" : "electronics",
}));

const ITEMS_PER_PAGE = 20;

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchPrice, setSearchPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // Fetch all products initially (simulate API)
    setProducts(DUMMY_PRODUCTS);
    setFiltered(DUMMY_PRODUCTS.slice(0, ITEMS_PER_PAGE));
  }, []);

  const handleSearch = () => {
    let result = [...products];

    if (searchCategory) {
      result = result.filter((p) =>
        p.category.toLowerCase().includes(searchCategory.toLowerCase())
      );
    }

    if (searchPrice) {
      result = result.filter((p) => p.price <= parseInt(searchPrice));
    }

    setFiltered(result.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
  };

  const handlePageClick = (page: number) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setFiltered(products.slice(start, end));
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search category"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="input"
        />
        <input
          type="number"
          placeholder="Max price"
          value={searchPrice}
          onChange={(e) => setSearchPrice(e.target.value)}
          className="input"
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Search
        </button>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <div
            key={product.id}
            onClick={() => router.push(`/product/${product.id}`)}
            className="cursor-pointer border rounded-md shadow-sm p-4 hover:shadow-md transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-yellow-500 text-sm mb-1">⭐ {product.rating} / 5</p>
            <div className="flex items-center gap-2">
              {product.discountPrice ? (
                <>
                  <p className="text-red-600 font-bold">₹{product.discountPrice}</p>
                  <p className="line-through text-gray-500">₹{product.price}</p>
                </>
              ) : (
                <p className="font-bold">₹{product.price}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageClick(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
