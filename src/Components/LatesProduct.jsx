"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBolt, FaBoxOpen, FaArrowRight } from "react-icons/fa";

export default function LatestProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://e-comerce-server.vercel.app/products-latest"
        );
        const data = await res.json();
        setProducts(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error("Error fetching latest products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded-xl">
        <FaBoxOpen className="text-5xl text-gray-300 mb-4" />
        <p>No latest products found.</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-semibold mb-2">
              <FaBolt className="text-yellow-500" />
              <span className="uppercase tracking-wider text-sm">
                New Arrivals
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Latest Products
            </h2>
          </div>

          <Link
            href="/products"
            className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            View All Products
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaBoxOpen className="text-4xl" />
                  </div>
                )}

                {/* Optional: 'New' Badge since this is Latest Products */}
                <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md uppercase tracking-wide">
                  New
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-700 shadow-sm uppercase tracking-wide">
                  {product.category || "General"}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2 h-10 leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    Details
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
