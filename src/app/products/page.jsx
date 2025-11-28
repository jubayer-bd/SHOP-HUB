"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaBoxOpen,
} from "react-icons/fa";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch("https://e-comerce-server.vercel.app/products");
      const data = await res.json();

      // Ensure we access the array correctly based on your API response structure
      const productsArray = Array.isArray(data.data) ? data.data : [];

      setProducts(productsArray);
      setFilteredProducts(productsArray);

      // Generate unique categories
      const unique = [
        "all",
        ...new Set(productsArray.map((p) => p.category || "uncategorized")),
      ];
      setCategories(unique);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = [...products];

    if (searchTerm.trim()) {
      filtered = filtered.filter((p) => {
        const title = p.title || "";
        const desc = p.shortDescription || "";
        return (
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          desc.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [searchTerm, selectedCategory, products]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Scroll to top when page changes
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Our Collection
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl">
            Browse our curated list of top-quality products designed just for
            you.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {currentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <FaBoxOpen className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">
              No products found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems.map((product) => (
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
                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-700 shadow-sm uppercase tracking-wide">
                    {product.category}
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
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <span className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-900">
                {indexOfFirstItem + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-900">
                {Math.min(indexOfLastItem, filteredProducts.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              results
            </span>

            <div className="inline-flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-2 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              >
                <FaChevronLeft size={16} />
              </button>

              {/* Simple logic to show current page context */}
              <div className="flex items-center px-4 font-medium text-gray-900">
                Page {currentPage} of {totalPages}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              >
                <FaChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
