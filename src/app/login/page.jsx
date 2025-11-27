"use client";

import React, { useContext, useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Next.js Navigation Hooks
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import auth from "@/Firebase/Firebase.config";
import { AuthContext } from "@/providers/AuthProvider";
import Loading from "@/Components/Loading";

// --- 1. Isolate Logic Component ---
const LoginForm = () => {
  const { signIn } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleProvider = new GoogleAuthProvider();

  // Get the callbackUrl from URL or default to home '/'
  const from = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  //  Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const userCredential = await signIn(email, password);

      // Manually set cookie for instant redirect speed
      const token = await userCredential.user.getIdToken();
      Cookies.set("firebase_token", token, { expires: 1, secure: true });

      toast.success("Login successful 🎉");
      router.push(from); // Next.js redirect
    } catch (error) {
      toast.error(error.message || "Invalid email or password!");
    } finally {
      setBtnLoading(false);
    }
  };

  //  Google Login
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const token = await result.user.getIdToken();
      Cookies.set("firebase_token", token, { expires: 1, secure: true });

      toast.success("Logged in with Google 🎉");
      router.push(from);
    } catch (error) {
      toast.error(error.message || "Google login failed!");
    }
  };

  return (
    <div className="w-full max-w-md bg-base-100 shadow-xl rounded-2xl p-8">
      <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Email</span>
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Password</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="input input-bordered w-full pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              type="button"
              className="absolute right-3 top-3 text-xl text-gray-500 cursor-pointer z-10"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <span
            type="button"
            className="text-sm text-primary hover:underline cursor-pointer"
            onClick={() => router.push(`/forget-password`)}
          >
            Forgot Password?
          </span>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={btnLoading}
          className="btn btn-primary w-full"
        >
          {btnLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="divider">or</div>

      {/* Google Sign In */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="btn btn-outline w-full flex items-center justify-center gap-2"
      >
        <FcGoogle className="text-2xl" /> Continue with Google
      </button>

      {/* Sign Up link */}
      <p className="text-center text-sm mt-4">
        Don’t have an account?{" "}
        <button
          className="text-primary hover:underline"
          onClick={() => router.push("/register")}
        >
          SignUp here
        </button>
      </p>
    </div>
  );
};

// --- 2. Main Component Wrapper (Fixes Build Error) ---
const Login = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      {/* Suspense is required when using useSearchParams in Next.js */}
      <Suspense fallback={<Loading />}>
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default Login;
