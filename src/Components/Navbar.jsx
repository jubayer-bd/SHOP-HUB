"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useContext } from "react";
import { usePathname } from "next/navigation";
import { AuthContext } from "@/providers/AuthProvider";
import Image from "next/image";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const { user, logOut } = useContext(AuthContext);
  const pathname = usePathname();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropdownRef = useRef(null);

  const handleSignOut = () => {
    logOut();
    setMobileMenu(false);
  };

  // Helper for active link styles (Desktop)
  const isActive = (route) =>
    pathname === route
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-600 transition-colors";

  // Helper for mobile link styles (Sleeker, smaller text)
  const mobileLinkStyle = (route) => 
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      pathname === route 
        ? "bg-blue-50 text-blue-600" 
        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
    }`;

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* --- Logo (Adjusted size for mobile/desktop) --- */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold text-blue-600 tracking-tight">
              ShopHub
            </span>
          </Link>

          {/* --- Desktop Nav (Hidden on Mobile/Tablet) --- */}
          <div className="hidden lg:flex items-center space-x-8 text-sm font-medium">
            <Link href="/" className={isActive("/")}>Home</Link>
            <Link href="/products" className={isActive("/products")}>Products</Link>
            <Link href="/about" className={isActive("/about")}>About</Link>
            <Link href="/contact" className={isActive("/contact")}>Contact</Link>

            {user && (
              <>
                <Link href="/wishlist" className={isActive("/wishlist")}>Wishlist</Link>
                <Link href="/cart" className={isActive("/cart")}>Cart</Link>
              </>
            )}
          </div>

          {/* --- Auth Section (Desktop) --- */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-1 pr-3 rounded-full border border-gray-200 hover:shadow-md transition cursor-pointer"
                >
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="User"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full text-xs font-bold">
                      {user?.displayName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user?.displayName || "User"}
                  </span>
                </button>

                {/* Desktop Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-xl py-2 border border-gray-100 z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-bold text-gray-900">{user?.displayName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>

                    <div className="py-2">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                      <Link href="/add-product" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Add Product</Link>
                      <Link href="/manage-products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Manage Products</Link>
                    </div>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <Link href="/login" className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition">
                  Login
                </Link>
                <Link href="/register" className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm transition">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* --- Mobile Menu Button --- */}
          <div className="lg:hidden flex items-center">
             {/* Show mini cart icon here if desired, otherwise just the burger */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile/Tablet Menu --- */}
      {mobileMenu && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 z-40 max-h-[90vh] overflow-y-auto">
          <div className="px-4 pt-2 pb-6 space-y-1">
            
            {/* 1. Main Navigation */}
            <Link href="/" onClick={() => setMobileMenu(false)} className={mobileLinkStyle("/")}>Home</Link>
            <Link href="/products" onClick={() => setMobileMenu(false)} className={mobileLinkStyle("/products")}>Products</Link>
            <Link href="/about" onClick={() => setMobileMenu(false)} className={mobileLinkStyle("/about")}>About</Link>
            <Link href="/contact" onClick={() => setMobileMenu(false)} className={mobileLinkStyle("/contact")}>Contact</Link>

            {/* 2. User Specific Links (Added Add/Manage here) */}
            {user && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account</p>
                <Link href="/profile" onClick={() => setMobileMenu(false)} className={mobileLinkStyle("/profile")}>Profile</Link>
                <Link href="/wishlist" onClick={() => setMobileMenu(false)} className={mobileLinkStyle("/wishlist")}>Wishlist</Link>
                <Link href="/cart" onClick={() => setMobileMenu(false)} className={mobileLinkStyle("/cart")}>Cart</Link>
                
                {/* --- ADDED MISSING ROUTES --- */}
                <Link href="/add-product" onClick={() => setMobileMenu(false)} className={mobileLinkStyle("/add-product")}>Add Product</Link>
                <Link href="/manage-products" onClick={() => setMobileMenu(false)} className={mobileLinkStyle("/manage-products")}>Manage Products</Link>
              </div>
            )}

            {/* 3. Auth Actions */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              {!user ? (
                <div className="grid grid-cols-2 gap-3 px-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenu(false)}
                    className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenu(false)}
                    className="flex justify-center items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="px-3 pb-2">
                   {/* User info snippet for mobile */}
                   <div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 rounded-lg">
                      {user?.photoURL && <Image src={user.photoURL} width={30} height={30} className="rounded-full" alt="nav-user"/>}
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                   </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex justify-center items-center px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </nav>
  );
}