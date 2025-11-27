"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { AuthContext } from "@/providers/AuthProvider";

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
    setLoading(true);
    try {
      const res = await fetch(
        `https://e-comerce-server.vercel.app/cart?email=${user.email}`
      );
      const data = await res.json();
      setCart(data);
    } catch {
      toast.error("Failed to load cart ❌");
    }
    setLoading(false);
  };

  const updateQty = async (id, value) => {
    const item = cart.find((c) => c._id === id);
    if (!item) return;

    const qty = Math.max(1, item.quantity + value);

    await fetch(
      `https://e-comerce-server.vercel.app/cart?email=${user.email}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          quantity: qty,
        }),
      }
    );

    toast.success("Quantity updated");

    fetchCart();
  };

  const removeItem = async (id) => {
    await fetch(`https://e-comerce-server.vercel.app/cart/${id}`, {
      method: "DELETE",
    });

    toast.success("Item removed from cart 🗑️");

    fetchCart();
  };

  // ---------- UI Loading States ----------
  if (userLoading) return <p className="text-center py-10">Loading user...</p>;
  if (!user?.email)
    return <p className="text-center py-10">Please login first.</p>;
  if (loading) return <p className="text-center py-10">Loading cart...</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800">🛒 My Cart</h1>

      {cart.length === 0 && (
        <p className="text-center text-gray-600 py-10">Your cart is empty.</p>
      )}

      <div className="flex flex-col gap-6">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex gap-5 p-5 rounded-xl shadow-md bg-white border hover:shadow-xl transition duration-300"
          >
            {/* Product Image */}
            <Image
              src={item.product.image}
              width={150}
              height={120}
              alt="product"
              className="rounded-lg object-cover"
            />

            {/* Product Text */}
            <div className="flex-grow">
              <h2 className="font-semibold text-xl text-gray-800">
                {item.product.title}
              </h2>

              <p className="text-blue-600 font-bold text-lg">
                ${item.product.price}
              </p>

              {/* Qty Buttons */}
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => updateQty(item._id, -1)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-lg font-bold transition"
                >
                  -
                </button>

                <span className="text-xl font-semibold">{item.quantity}</span>

                <button
                  onClick={() => updateQty(item._id, +1)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-lg font-bold transition"
                >
                  +
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item._id)}
                className="mt-4 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
