"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    price: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    priority: "medium",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Prepare data (Convert price to Integer here)
    const productPayload = {
      ...formData,
      price: parseInt(formData.price), // converting string to number
      createdAt: new Date(), // Adding timestamp for sorting in your GET api
    };

    try {
      const res = await fetch("https://e-comerce-server.vercel.app/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      });

      const data = await res.json();

      // Check if data.insertedId exists (MongoDB standard) or res.ok
      if (res.ok && (data.insertedId || data.success)) {
        toast.success("Product added successfully!");

        // Reset form
        setFormData({
          title: "",
          image: "",
          price: "",
          shortDescription: "",
          fullDescription: "",
          category: "",
          priority: "medium",
          date: "",
        });

        // Redirect
        setTimeout(() => {
          router.push("/manage-products");
        }, 1000);
      } else {
        toast.error("Failed to add product");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto w-full bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaCloudUploadAlt /> Add New Product
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Fill in the details to create a new listing.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title */}
          <div>
            <label className={labelClass}>Product Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Wireless Noise Cancelling Headphones"
              value={formData.title}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className={labelClass}>Image URL</label>
            <input
              type="text"
              name="image"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Grid for compact fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Price ($)</label>
              <input
                type="number"
                name="price"
                placeholder="0"
                value={formData.price}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Electronics, Fashion"
                value={formData.category}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Listing Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`${inputClass} bg-white`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Listing Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label className={labelClass}>Short Description</label>
            <textarea
              name="shortDescription"
              placeholder="Brief summary for card view..."
              value={formData.shortDescription}
              onChange={handleChange}
              rows={2}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Full Description</label>
            <textarea
              name="fullDescription"
              placeholder="Detailed product specifications and features..."
              value={formData.fullDescription}
              onChange={handleChange}
              rows={5}
              required
              className={inputClass}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg shadow-md transition-all 
                ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform active:scale-[0.98]"
                }`}
            >
              {loading ? "Adding Product..." : "Submit Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
