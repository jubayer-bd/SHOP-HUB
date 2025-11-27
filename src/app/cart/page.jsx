"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { AuthContext } from "@/providers/AuthProvider";

// --- Icons ---
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);
const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
);

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useContext(AuthContext);

  useEffect(() => {
    if (!userLoading && user?.email) {
      fetchCart();
    }
  }, [userLoading, user]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`https://e-comerce-server.vercel.app/cart?email=${user?.email}`);
      const data = await res.json();
      setCart(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  // --- Optimistic Quantity Update ---
  const updateQty = async (id, change) => {
    const itemIndex = cart.findIndex((c) => c._id === id);
    if (itemIndex === -1) return;

    const item = cart[itemIndex];
    const newQty = item.quantity + change;

    if (newQty < 1) return; // Prevent going below 1

    // 1. Optimistic UI Update (Update local state immediately)
    const newCart = [...cart];
    newCart[itemIndex] = { ...item, quantity: newQty };
    setCart(newCart);

    // 2. API Call in Background
    try {
      await fetch(`https://e-comerce-server.vercel.app/cart?email=${user.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          quantity: newQty,
        }),
      });
      // Optional: toast.success("Updated"); // Removed to reduce noise
    } catch (error) {
      // Revert if failed
      setCart(cart); 
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (id) => {
    // Optimistic Remove
    const previousCart = [...cart];
    setCart(cart.filter((item) => item._id !== id));

    try {
      const res = await fetch(`https://e-comerce-server.vercel.app/cart/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Item removed");
    } catch {
      setCart(previousCart); // Revert
      toast.error("Failed to remove item");
    }
  };

  // --- Calculations ---
  const subtotal = cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.05; // Example 5% tax
  const total = subtotal + tax;

  // --- Loading State (Skeleton) ---
  if (userLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
          <div className="w-full lg:w-80 h-64 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  // --- Auth Guard ---
  if (!user?.email) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="text-gray-500 mb-6">You need to be logged in to view your cart.</p>
        <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">Shopping Cart ({cart.length})</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-800">Your cart is empty</h2>
          <p className="text-gray-500 mt-2 mb-8">Looks like you haven't added anything yet.</p>
          <Link href="/products" className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: Cart Items List */}
          <div className="flex-grow space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row gap-5 p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                {/* Image Wrapper */}
                <div className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.product?.image || "/placeholder.png"}
                    alt={item.product?.title || "Product"}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between flex-grow">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                        {item.product?.title}
                      </h3>
                      <p className="text-sm text-gray-500">{item.product?.category}</p>
                    </div>
                    <p className="font-bold text-lg text-gray-900">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex justify-between items-end mt-4 sm:mt-0">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                      <button
                        onClick={() => updateQty(item._id, -1)}
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-white rounded-md transition disabled:opacity-30 text-gray-600"
                      >
                        <MinusIcon />
                      </button>
                      <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item._id, 1)}
                        className="p-2 hover:bg-white rounded-md transition text-gray-600"
                      >
                        <PlusIcon />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition flex items-center gap-2 text-sm font-medium"
                    >
                      <TrashIcon />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                onClick={() => toast.success("Proceeding to checkout!")}
              >
                Checkout Now
              </button>

              <div className="mt-6 flex justify-center">
                 <p className="text-xs text-gray-400 flex items-center gap-1">
                   🔒 Secure Checkout
                 </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}