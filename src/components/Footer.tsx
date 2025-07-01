"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white rounded-full px-6 py-15 shadow-lg mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-white p-2 rounded-md">
            <img
        src="https://assets.aceternity.com/logo-dark.png"
        alt="logo"
        width={30}
        height={30}
      />
          </div>
          <span className="text-lg font-semibold">Startup</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-sm">
          <Link href="/what-we-do" className="hover:text-gray-300 transition">What we do</Link>
          <Link href="/shop" className="hover:text-gray-300 transition">Shop</Link>
          <Link href="/contact" className="hover:text-gray-300 transition">Contact</Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex space-x-4">
          <Link href="/login" className="font-semibold hover:text-gray-300 transition">
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-white text-black px-4 py-1.5 rounded-md font-semibold hover:bg-gray-200 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </footer>
  );
}
