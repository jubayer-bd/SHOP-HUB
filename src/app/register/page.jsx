"use client";

import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import Cookies from "js-cookie";

import { app } from "@/Firebase/Firebase.config";
import { AuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const { createUser, setLoading, setUser } = useContext(AuthContext);
  const router = useRouter();
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  // States
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // Validate password
  const validatePassword = (pass) => {
    if (pass.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(pass)) return "Must include an uppercase letter";
    if (!/[a-z]/.test(pass)) return "Must include a lowercase letter";
    return "";
  };

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();

    const errorMsg = validatePassword(password);
    if (errorMsg) {
      setPasswordError(errorMsg);
      return;
    }

    setPasswordError("");
    setBtnLoading(true);
    setLoading(true);

    try {
      const res = await createUser(email, password);

      // Update profile
      await updateProfile(res.user, {
        displayName: name,
        photoURL: photo || "",
      });

      const updatedUser = {
        ...res.user,
        displayName: name,
        photoURL: photo || "",
      };

      setUser(updatedUser);

      // Save token in cookies
      const token = await res.user.getIdToken();
      Cookies.set("firebase_token", token, { expires: 1, secure: true });

      toast.success("🎉 Registration successful!");
      router.push("/");
    } catch (error) {
      let msg = error.message;
      if (error.code === "auth/email-already-in-use") {
        msg = "This email is already registered.";
      }
      toast.error(msg);
    } finally {
      setBtnLoading(false);
      setLoading(false);
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);

      setUser(res.user);

      const token = await res.user.getIdToken();
      Cookies.set("firebase_token", token, { expires: 1, secure: true });

      toast.success("🎉 Logged in with Google!");
      router.push("/");
    } catch (error) {
      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Full Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Photo URL</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter profile picture URL"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Email Address</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="Enter email address"
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
                className="input input-bordered w-full pr-12"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span
                className="absolute right-3 top-3 text-xl cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={btnLoading}
            className="btn btn-primary w-full"
          >
            {btnLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="divider">or</div>

        {/* Google Login */}
        <button
          onClick={handleGoogleSignIn}
          className="btn btn-outline w-full flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-primary cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
