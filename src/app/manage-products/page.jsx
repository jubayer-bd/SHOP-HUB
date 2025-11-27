"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Swal from "sweetalert2"; // Ensure you installed sweetalert2

const API_URL = "https://e-comerce-server.vercel.app/products";

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // --- FETCH FUNCTION ---
  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      const data = result.data || result;
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- DELETE LOGIC ---
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setDeletingId(id);
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

        if (response.ok) {
          toast.success("Product successfully deleted! 🗑️");
          setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
        } else {
          toast.error("Failed to delete product.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred during deletion.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  // --- EDIT MODAL LOGIC ---
  const handleEditClick = (product) => setEditingProduct({ ...product });
  const closeEditModal = () => setEditingProduct(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const id = editingProduct._id || editingProduct.id;

    try {
      const { _id, id: tempId, ...updatePayload } = editingProduct;

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH", // or "PUT" depending on your backend
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      const data = await response.json();
      console.log("Update response:", data);

      if (response.ok) {
        toast.success("Product updated successfully! 🎉");

        // Update local state UI
        setProducts((prev) =>
          prev.map((p) => {
            const pId = p._id || p.id;
            return pId === id ? { ...p, ...updatePayload, _id: id } : p;
          })
        );
        closeEditModal();
      } else {
        toast.error(data?.message || "Failed to update product.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred while updating.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const modalInputClass =
    "mt-1 block w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 transition-all";
  const modalLabelClass = "block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen flex flex-col relative bg-gray-50">
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Product Inventory
            </h1>
            <Link
              href="/add-product"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition shadow-lg"
            >
              + Add New Product
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-lg text-center border border-gray-100">
              <p className="text-gray-500 mb-4 text-lg">
                No products found in your inventory.
              </p>
              <Link
                href="/add-product"
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
              {/* TABLE FOR DESKTOP */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase w-20">
                        Image
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Title / Desc
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase w-28">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase w-24">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase w-24">
                        Priority
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase w-36">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => {
                      const id = product._id || product.id;
                      return (
                        <tr
                          key={id}
                          className="hover:bg-blue-50/50 transition duration-150"
                        >
                          <td className="px-6 py-4">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-14 h-14 rounded-lg object-cover bg-gray-200 shadow-sm"
                            />
                          </td>
                          <td className="px-6 py-4 max-w-sm">
                            <p className="font-semibold text-gray-900 line-clamp-1">
                              {product.title}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {product.shortDescription}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-800">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-800">
                            ${parseFloat(product.price).toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-bold uppercase ${
                                product.priority === "high"
                                  ? "bg-red-100 text-red-700"
                                  : product.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {product.priority || "medium"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right flex gap-3 justify-end items-center">
                            <button
                              onClick={() => handleEditClick(product)}
                              className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-50 transition"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(id)}
                              disabled={deletingId === id}
                              className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition disabled:opacity-50"
                              title="Delete"
                            >
                              {deletingId === id ? "⏳" : "🗑️"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE VIEW */}
              <div className="md:hidden divide-y divide-gray-200">
                {products.map((product) => {
                  const id = product._id || product.id;
                  return (
                    <div
                      key={id}
                      className="p-4 bg-white hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-16 h-16 rounded-lg object-cover bg-gray-200 flex-shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                          <h3 className="font-bold text-gray-900 line-clamp-1">
                            {product.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {product.shortDescription}
                          </p>
                          <p className="font-extrabold text-lg text-blue-600 mt-1">
                            ${parseFloat(product.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 justify-end">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-bold uppercase self-center ${
                            product.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {product.priority || "medium"}
                        </span>
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          disabled={deletingId === id}
                          className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                        >
                          {deletingId === id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- EDIT MODAL WITH LIVE IMAGE PREVIEW --- */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  Editing: {editingProduct.title}
                </h2>
                <button
                  onClick={closeEditModal}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-5">
                {/* Image URL & Live Preview */}
                <div className="flex items-center gap-4">
                  {editingProduct.image && (
                    <img
                      src={editingProduct.image}
                      alt="Product Preview"
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  )}
                  <div className="flex-grow">
                    <label className={modalLabelClass}>Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={editingProduct.image || ""}
                      onChange={handleInputChange}
                      className={modalInputClass}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <label className={modalLabelClass}>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editingProduct.title || ""}
                    onChange={handleInputChange}
                    className={modalInputClass}
                    required
                  />
                </div>

                <div>
                  <label className={modalLabelClass}>Short Description</label>
                  <textarea
                    name="shortDescription"
                    value={editingProduct.shortDescription || ""}
                    onChange={handleInputChange}
                    className={modalInputClass}
                    rows="2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={modalLabelClass}>Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={editingProduct.price || 0}
                      onChange={handleInputChange}
                      className={modalInputClass}
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className={modalLabelClass}>Category</label>
                    <input
                      type="text"
                      name="category"
                      value={editingProduct.category || ""}
                      onChange={handleInputChange}
                      className={modalInputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={modalLabelClass}>Priority</label>
                  <select
                    name="priority"
                    value={editingProduct.priority || "medium"}
                    onChange={handleInputChange}
                    className={modalInputClass}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
