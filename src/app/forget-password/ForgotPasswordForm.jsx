"use client";

import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const ForgotPasswordForm = () => {
  const { resetPassword } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read ?email= from URL if passed
  const passedEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(passedEmail);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (passedEmail) setEmail(passedEmail);
  }, [passedEmail]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Please enter your email.");

    setSending(true);

    try {
      await resetPassword(email);

      toast.success("Password reset email sent! 📧");

      setTimeout(() => {
        window.location.href = "https://mail.google.com";
      }, 1200);
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-base-100 shadow-xl rounded-2xl p-8">
      <h2 className="text-3xl font-bold text-center mb-6">Forgot Password</h2>

      <form onSubmit={handleReset} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Email</span>
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <small className="text-red-700 block mt-1">
            ⚠️ Check your Spam folder if you don’t see the reset email
          </small>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={sending}
          className="btn btn-primary w-full"
        >
          {sending ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {/* Back to Login */}
      <p className="text-center text-sm mt-4">
        Remember your password?{" "}
        <button
          onClick={() => router.push("/login")}
          className="text-primary hover:underline"
        >
          Back to Login
        </button>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
