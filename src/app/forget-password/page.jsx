"use client";

import React, { useState, useEffect, Suspense } from "react";
import Loading from "@/Components/Loading";
import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPassword = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      {/* Suspense wrapper for useSearchParams */}
      <Suspense fallback={<Loading />}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
};

export default ForgotPassword;
