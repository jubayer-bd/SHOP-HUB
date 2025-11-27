"use client";

import Link from "next/link";
// import { useSession } from "next-auth/react";

export default function CTABanner() {
  // const { data: session } = useSession();
  const session = true;

  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {session
            ? `Ready to shop, ${session.user?.name || "User"}?`
            : "Ready to Start Shopping?"}
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          {session
            ? "Your cart is waiting for you."
            : "Join thousands of satisfied customers today"}
        </p>

        {session ? (
          <Link
            href="/products"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Browse Products
          </Link>
        ) : (
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Sign Up / Login
          </Link>
        )}
      </div>
    </section>
  );
}
