"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const API_URL = "https://e-comerce-server.vercel.app/products";

// --- SVG Icons Components ---
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for actions
  const [deletingId, setDeletingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const result = await res.json();
      const data = result.data || result;
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    setDeletingId(id);

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (response.ok) {
        toast.success("Product deleted successfully!");
        setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setDeletingId(null);
    }
  };

  // Handle Edit
  const handleEditClick = (product) => {
    setEditingProduct({ ...product });
  };

  const closeModal = () => {
    setEditingProduct(null);
    setIsUpdating(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Update PATCH
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const id = editingProduct._id || editingProduct.id;
    const { _id, id: tempId, ...rawPayload } = editingProduct;
    const payload = {
      ...rawPayload,
      price: parseFloat(rawPayload.price),
    };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success || response.ok) {
        toast.success("Product updated successfully!");
        setProducts((prev) =>
          prev.map((p) => ((p._id || p.id) === id ? { ...p, ...payload } : p))
        );
        closeModal();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 max-w-7xl mx-auto space-y-4">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-20 w-full bg-gray-200 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  const inputClass =
    "mt-1 block w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all";

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your inventory efficiently
            </p>
          </div>

          <Link
            href="/add-product"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-transform active:scale-95 font-medium"
          >
            <span>+</span> Add New Product
          </Link>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="bg-white p-12 shadow-sm border border-gray-100 rounded-2xl text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">
              📦
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              No products found
            </h3>
            <p className="text-gray-500 mb-6 mt-2 max-w-sm">
              It looks like you haven't added any products to your inventory
              yet.
            </p>
            <Link
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              href="/add-product"
            >
              Add Product
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => {
                    const id = product._id || product.id;
                    return (
                      <tr
                        key={id}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="p-4 flex items-center gap-4">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200"
                            onError={(e) =>
                              (e.target.src =
                                "https://via.placeholder.com/150?text=No+Image")
                            }
                          />
                          <span
                            className="font-medium text-gray-900 truncate max-w-xs"
                            title={product.title}
                          >
                            {product.title}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            {product.category || "Uncategorized"}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-gray-900">
                          ${parseFloat(product.price).toFixed(2)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-xs font-bold uppercase ${
                              product.priority === "high"
                                ? "text-red-500"
                                : "text-gray-500"
                            }`}
                          >
                            {product.priority || "low"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/products/${id}`}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View"
                            >
                              <EyeIcon />
                            </Link>
                            <button
                              onClick={() => handleEditClick(product)}
                              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Edit"
                            >
                              <EditIcon />
                            </button>
                            <button
                              onClick={() => handleDelete(id)}
                              disabled={deletingId === id}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                              title="Delete"
                            >
                              {deletingId === id ? (
                                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <TrashIcon />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="md:hidden divide-y divide-gray-100">
              {products.map((product) => {
                const id = product._id || product.id;
                return (
                  <div key={id} className="p-4 flex flex-col gap-4">
                    <div className="flex gap-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-20 h-20 rounded-lg object-cover bg-gray-100 border border-gray-200"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/150?text=No+Image")
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-gray-900 truncate">
                          {product.title}
                        </h2>
                        <p className="text-sm text-gray-500 mb-1">
                          {product.category}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-600">
                            ${product.price}
                          </span>
                          <span className="text-xs text-gray-400 uppercase">
                            {product.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Link
                        href={`/products/${id}`}
                        className="flex items-center justify-center py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleEditClick(product)}
                        className="flex items-center justify-center py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        className="flex items-center justify-center py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 z-50 transition-opacity">
          {/* ADDED: max-h-[90vh] and overflow-y-auto below */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Edit Product
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={editingProduct.image}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editingProduct.title}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  rows="2"
                  value={editingProduct.shortDescription}
                  onChange={handleInputChange}
                  className={inputClass}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleInputChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={editingProduct.category}
                    onChange={handleInputChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={editingProduct.priority}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Description
                </label>
                {/* FIXED: name changed from shortDescription to fullDescription */}
                <textarea
                  name="fullDescription"
                  rows="4"
                  value={editingProduct.fullDescription}
                  onChange={handleInputChange}
                  className={inputClass}
                ></textarea>
              </div>

              <div className="flex gap-3 mt-8 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isUpdating ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
