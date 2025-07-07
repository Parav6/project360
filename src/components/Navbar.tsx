"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState,useEffect } from "react";
import useUserHook from "@/hooks/userHook";
import { useAppSelector } from "@/lib/hooks";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
 
  const [navLinks, setNavLinks] = useState([]);

   const { user, loading, error } = useUserHook();
//  const user = useAppSelector((state) => state.user.currentUser);

// const navLinks = !user
//   ? [
//       { name: "Shop", href: "/user/shop" },
//       { name: "Login", href: "/auth/sign-in" },
//       { name: "Sign Up", href: "/auth/sign-up", isButton: true },
//     ]
//   : user.role === "admin"
//   ? [
//       { name: "Admin Panel", href: "/admin/admin-panel" },
//       { name: "Profile", href: "/admin/profile", isButton: true },
//     ]
//   : user.role === "customer"
//   ? [
//       { name: "Shop", href: "/user/shop" },
//       { name: "Cart", href: "/user/cart" },
//       { name: "Profile", href: "/user/profile", isButton: true },
//     ]
//   : user.role === "employee"
//   ? [
//       { name: "Orders", href: "/employee/orders" },
//       { name: "Profile", href: "/employee/profile" },
//     ]
//   : [];
  


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
    <nav className="w-full top-0 left-0 z-50 bg-[var(--color-bg)] shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 md:py-6 min-h-[72px] md:min-h-[88px]">
        <Link href="/" >
          {/* <Image src="/next.svg" alt="Logo" width={44} height={44} /> */}
          <span className="text-2xl  md:text-3xl font-bold text-[var(--color-primary)] tracking-tight">Project360</span>
        </Link>

        {/* Center: What We Do */}
        <div className="hidden md:flex flex-1 justify-center">
          <motion.div
            whileHover={{ scale: 1.08, color: "var(--color-accent)" }}
            className="text-lg font-medium text-[var(--color-text)] cursor-pointer transition-colors duration-200"
          >
            What We Do
          </motion.div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((link) =>
            link.isButton ? (
              <motion.a
                key={link.name}
                href={link.href}
                whileHover={{ scale: 1.09, backgroundColor: "white" }}
                className="px-6 py-2 rounded-lg bg-[var(--color-secondary)] text-white font-bold shadow-lg text-lg transition-all duration-200 "
              >
                {link.name}
              </motion.a>
            ) : (
              <motion.a
                key={link.name}
                href={link.href}
                whileHover={{ scale: 1.07, color: "var(--color-accent)" }}
                className="text-[var(--color-primary)] font-medium px-3 py-2 rounded transition-colors duration-200 hover:text-[var(--color-accent)] text-lg"
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
            <span className="block w-6 h-0.5 bg-[var(--color-bg)] mb-3 rounded"></span>
            <span className="block w-6 h-0.5 bg-[var(--color-bg)] mb-1 rounded"></span>
            <span className="block w-6 h-0.5 bg-[var(--color-bg)] rounded"></span>
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
            className="md:hidden bg-[var(--color-bg)] shadow-lg px-4 py-2"
          >
            <motion.div
              whileHover={{ color: "var(--color-accent)" }}
              className="text-lg font-medium text-[var(--color-text)] mb-2 cursor-pointer"
            >
              What We Do
            </motion.div>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) =>
                link.isButton ? (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    whileHover={{ scale: 1.07, backgroundColor: "var(--color-accent)" }}
                    className="px-6 py-2 rounded-lg bg-[var(--color-primary)] text-white font-bold shadow-lg text-lg transition-all duration-200 hover:bg-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                  >
                    {link.name}
                  </motion.a>
                ) : (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    whileHover={{ scale: 1.05, color: "var(--color-accent)" }}
                    className="text-[var(--color-primary)] font-medium px-3 py-2 rounded hover:text-[var(--color-accent)] transition-colors duration-200 text-lg"
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