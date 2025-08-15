"use client";
import React, { useState, useEffect } from "react";
import { IoIosLock } from "react-icons/io";
import LoadingFetch from "../_components/loadingFetch";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPassword() {
  const router = useRouter();
  const token = useSearchParams()?.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(""), 5000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8 || password !== confirmPassword) {
      return setErrorMessage(
        "Password should be at least 8 characters, and they should match!"
      );
    }
    if (!token) {
      return setErrorMessage(
        "The token is undefined, please check your email for URI."
      );
    }

    setLoading(true);
    fetch("/api/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        password: password,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Something went wrong");
        }
        return res.json();
      })
      .then((data) => {
        if (
          data.message ===
          "New password cannot be the same as the old password."
        ) {
          setErrorMessage("New password cannot be the same as the old one.");
          return;
        }
        router.push("/sign-in");
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
        setConfirmPassword("");
        setPassword("");
        setErrorMessage("Failed to reset password. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8 relative">
        <div className="flex items-center justify-center mb-6">
          <IoIosLock size={95} color="#4f46e5" />
        </div>

        {errorMessage && (
          <div className="p-3 rounded-md bg-red-100 border border-red-400 font-medium text-sm text-red-700 text-center mb-2">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <label className="block text-sm text-gray-600 mb-1">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              placeholder="At least 8 characters..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[35px] text-sm text-gray-500 cursor-pointer select-none"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {password !== confirmPassword && confirmPassword.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                Passwords do not match.
              </p>
            )}
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[35px] text-sm text-gray-500 cursor-pointer select-none"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-500 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Reset Password
          </button>

          <div className="text-center mt-2">
            <a
              href="/sign-in"
              className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
            >
              Changed your mind? Back to Sign In
            </a>
          </div>
        </form>
      </div>

      <LoadingFetch
        loading={loading}
        text="Processing your request. Please wait..."
        inputText="********"
      />
    </div>
  );
}

export default ResetPassword;
