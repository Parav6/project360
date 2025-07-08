"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState,useEffect } from "react";
import useUserHook from "@/hooks/userHook";



const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
 const { user, loading, error } = useUserHook();
  console.log("user", user);
  console.log("loading", loading);
  console.log("error", error);
  const [navLinks, setNavLinks] = useState([]);

   

  


useEffect(() => {
  let links = [];
  if (loading || error) {
    links = [
      { name: "Shop", href: "/user/shop" },
      { name: "Login", href: "/auth/sign-in" },
      { name: "Sign Up", href: "/auth/sign-up", isButton: true },
    ];
  } else if (user && user.role === "admin") {
    links = [
      { name: "Admin Panel", href: "/admin/admin-panel" },
      { name: "Profile", href: "/admin/profile", isButton: true },
    ];
  } else if (user && user.role === "customer") {
    links = [
      { name: "Shop", href: "/user/shop" },
      { name: "Cart", href: "/user/cart" },
      { name: "Profile", href: "/user/profile", isButton: true },
    ];
  } else if (user && user.role === "employee") {
    links = [
      { name: "Orders", href: "/employee/orders" },
      { name: "Profile", href: "/employee/profile" },
    ];
  }
  setNavLinks(links);
}, [user, error, loading]);

  return (
    <nav className="w-full top-0 left-0 z-50 sticky bg-[var(--color-accent-purple)] shadow-md rounded-[2rem] px-8 py-4" style={{fontFamily: 'Inter, sans-serif', borderRadius: '2rem', background: 'var(--color-accent-purple)', height: '4rem'}}>
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-0 py-0 min-h-[4rem]" style={{padding: '0 2rem'}}>
        <Link href="/" >
          <span className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">Project360</span>
        </Link>
        {/* Center: What We Do */}
        <div className="hidden md:flex flex-1 justify-center">
          <motion.div
            whileHover={{ scale: 1.05, color: "var(--color-accent-pink)" }}
            className="text-lg font-medium text-[var(--color-text-primary)] cursor-pointer transition-colors duration-200 px-8"
            style={{alignItems: 'center'}}
          >
            What We Do
          </motion.div>
        </div>
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-[2rem]" style={{alignItems: 'center'}}>
          {navLinks.map((link) =>
            link.isButton ? (
              <motion.a
                key={link.name}
                href={link.href}
                whileHover={{ scale: 1.09, backgroundColor: "var(--color-accent-pink)" }}
                className="px-6 py-2 rounded-full bg-[var(--color-accent-pink)] text-[var(--color-text-primary)] font-bold shadow-lg text-lg transition-all duration-200 hover:bg-[var(--color-accent-yellow)]"
                style={{fontWeight: 700, borderRadius: '9999px'}}
              >
                {link.name}
              </motion.a>
            ) : (
              <motion.a
                key={link.name}
                href={link.href}
                whileHover={{ scale: 1.07, color: "var(--color-accent-pink)" }}
                className="text-[var(--color-text-primary)] font-medium px-3 py-2 rounded-full transition-colors duration-200 hover:text-[var(--color-accent-pink)] text-lg"
                style={{borderRadius: '9999px'}}
              >
                {link.name}
              </motion.a>
            )
          )}
        </div>
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="focus:outline-none"
            aria-label="Toggle menu"
          >
            <span className="block w-6 h-0.5 bg-[var(--color-text-primary)] mb-3 rounded-full"></span>
            <span className="block w-6 h-0.5 bg-[var(--color-text-primary)] mb-1 rounded-full"></span>
            <span className="block w-6 h-0.5 bg-[var(--color-text-primary)] rounded-full"></span>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[var(--color-accent-purple)] shadow-lg px-4 py-2 rounded-b-[2rem]"
          >
            <motion.div
              whileHover={{ color: "var(--color-accent-pink)" }}
              className="text-lg font-medium text-[var(--color-text-primary)] mb-2 cursor-pointer px-8"
              style={{alignItems: 'center'}}
            >
              What We Do
            </motion.div>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) =>
                link.isButton ? (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    whileHover={{ scale: 1.07, backgroundColor: "var(--color-accent-pink)" }}
                    className="px-6 py-2 rounded-full bg-[var(--color-accent-pink)] text-[var(--color-text-primary)] font-bold shadow-lg text-lg transition-all duration-200 hover:bg-[var(--color-accent-yellow)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-pink)] focus:ring-offset-2"
                    style={{fontWeight: 700, borderRadius: '9999px'}}
                  >
                    {link.name}
                  </motion.a>
                ) : (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    whileHover={{ scale: 1.05, color: "var(--color-accent-pink)" }}
                    className="text-[var(--color-text-primary)] font-medium px-3 py-2 rounded-full hover:text-[var(--color-accent-pink)] transition-colors duration-200 text-lg"
                    style={{borderRadius: '9999px'}}
                  >
                    {link.name}
                  </motion.a>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;