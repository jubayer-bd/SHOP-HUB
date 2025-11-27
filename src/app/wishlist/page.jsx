"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { AuthContext } from "@/providers/AuthProvider";


export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, loading: userLoading } = useContext(AuthContext);

  useEffect(() => {
    if (!userLoading && user?.email) {
      fetchWishlist();
    }
  }, [user, userLoading]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://e-comerce-server.vercel.app/wishlist?email=${user.email}`
      );
      const data = await res.json();
      setItems(data);
    } catch (error) {
      toast.error("Failed to load wishlist");
    }
    setLoading(false);
  };

  const removeItem = async (id) => {
    await fetch(`https://e-comerce-server.vercel.app/wishlist/${id}`, {
      method: "DELETE",
    });
    toast.success("Removed from wishlist");
    fetchWishlist();
  };

  // Loading & user protection
  if (userLoading) return <p className="text-center py-10">Loading...</p>;
  if (!user?.email)
    return <p className="text-center py-10">Please login first.</p>;

  return (
   
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-800">
          ❤️ My Wishlist
        </h1>

        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading wishlist...</p>
        ) : items.length === 0 ? (
          <p className="text-center py-6 text-gray-600">No items in wishlist.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item._id}
                className="rounded-xl overflow-hidden border bg-white shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={item.product.image}
                  width={500}
                  height={350}
                  alt="product"
                  className="h-52 w-full object-cover"
                />

                <div className="p-5">
                  <h2 className="font-semibold text-lg mb-1 text-gray-800">
                    {item.product.title}
                  </h2>

                  <p className="text-blue-600 font-bold text-lg">
                    ${item.product.price}
                  </p>

                  <Link
                    href={`/products/${item.productId}`}
                    className="inline-block mt-3 text-blue-500 hover:text-blue-700 font-medium underline"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    
  );
}
