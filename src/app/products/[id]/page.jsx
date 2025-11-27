"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PrivateRoute from "@/Routes/PrivateRoute";
import { AuthContext } from "@/providers/AuthProvider";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI states
  const [wishlisted, setWishlisted] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const id = params?.id; // FIXED

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(
        `https://e-comerce-server.vercel.app/products/${id}`
      );

      if (!res.ok) {
        router.push("/products");
        return;
      }

      const result = await res.json();
      const data = result.data || result;

      setProduct(data);
      setQuantity(1);

      // Only check wishlist/cart if user is logged in
      if (user) {
        checkWishlist(data._id);
        checkCart(data._id);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      router.push("/products");
    } finally {
      setLoading(false);
    }
  };

  // ---------- CHECK WISHLIST ----------
  const checkWishlist = async (id) => {
    if (!user) return;

    const res = await fetch(
      `https://e-comerce-server.vercel.app/wishlist?email=${user.email}`
    );
    const data = await res.json();
    const exists = data.find((item) => item.productId === id);

    if (exists) setWishlisted(true);
  };

  // ---------- CHECK CART ----------
  const checkCart = async (id) => {
    if (!user) return;

    const res = await fetch(
      `https://e-comerce-server.vercel.app/cart?email=${user.email}`
    );
    const data = await res.json();
    const exists = data.find((item) => item.productId === id);

    if (exists) {
      setInCart(true);
      setQuantity(exists.quantity);
    }
  };

  // ---------- WISHLIST TOGGLE ----------
  const toggleWishlist = async () => {
    if (!user) return router.push("/login");

    await fetch(
      `https://e-comerce-server.vercel.app/wishlist/toggle?email=${user.email}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      }
    );

    setWishlisted(!wishlisted);
  };

  // ---------- CART ADD ----------
  const handleCart = async () => {
    if (!user) return router.push("/login");

    await fetch(
      `https://e-comerce-server.vercel.app/cart?email=${user.email}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity,
        }),
      }
    );

    setInCart(true);
  };

  // ---------- PAGE LOADING ----------
  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        
        <div className="flex-grow flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
      </div>
    );
  }

  if (!product) return null;

  return (
    <PrivateRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
       

        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Back Button */}
            <Link
              href="/products"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Products
            </Link>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                
                {/* Product Image */}
                <div className="relative h-96 lg:h-full bg-gray-200 rounded-lg overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div>
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {product.category}
                    </span>
                  </div>

                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {product.title}
                  </h1>

                  <p className="text-3xl font-bold text-blue-600 mb-6">
                    ${product.price}
                  </p>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 text-black">
                      Description
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {product.fullDescription || product.shortDescription}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="border-t border-gray-200 pt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800 font-bold">Category:</span>
                      <span className="font-semibold text-gray-600">
                        {product.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-800 font-bold">
                        Date Added:
                      </span>
                      <span className="font-semibold text-gray-600">
                        {product.date
                          ? new Date(product.date).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="mt-6 flex items-center gap-4">
                    <button
                      onClick={() =>
                        setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                      }
                      className="px-3 py-1 border rounded"
                    >
                      -
                    </button>

                    <span className="text-xl font-semibold">{quantity}</span>

                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="px-3 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex gap-4">
                    {/* Add to Cart */}
                    <button
                      onClick={handleCart}
                      className={`flex-1 py-3 rounded-lg text-white font-semibold transition ${
                        inCart
                          ? "bg-green-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {inCart ? "Added to Cart" : "Add to Cart"}
                    </button>

                    {/* Wishlist Button */}
                    <button
                      onClick={toggleWishlist}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className={`w-6 h-6 ${
                          wishlisted ? "text-red-500 fill-red-500" : ""
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          fill={wishlisted ? "red" : "none"}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </main>

        
      </div>
    </PrivateRoute>
  );
}
