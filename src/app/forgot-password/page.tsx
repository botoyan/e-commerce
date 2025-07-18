"use client";
import React, { useEffect, useState } from "react";
import { FaKey } from "react-icons/fa6";
import LoadingFetch from "../_components/loadingFetch";
import Link from "next/link";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(""), 5000);
      return () => clearTimeout(timeout);
    }
    if (successMessage) {
      const timeout = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage, successMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!regexEmail.test(email)) {
      setError(true);
      setErrorMessage("");
      setSuccessMessage("");
      return;
    }

    setLoading(true);
    setError(false);
    setErrorMessage("");
    setSuccessMessage("");

    fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            setErrorMessage(
              "User not found. Please check your email and try again."
            );
            throw new Error("User not found");
          } else {
            throw new Error("Failed to process request");
          }
        }
        return res.json();
      })
      .then(() => {
        setEmail("");
        setSuccessMessage("Password reset link sent! Check your email.");
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-center mb-6">
          <FaKey size={90} className="text-gray-600" />
        </div>

        {errorMessage && (
          <div className="p-3 rounded-md bg-red-100 border border-red-400 font-medium text-sm text-red-700 text-center mb-2">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-md bg-green-100 border border-green-400 font-medium text-sm text-green-700 text-center mb-2">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Enter your email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error && regexEmail.test(e.target.value)) {
                  setError(false);
                  setErrorMessage("");
                }
              }}
              onBlur={() => {
                if (!regexEmail.test(email)) {
                  setError(true);
                }
              }}
              autoComplete="email"
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">
                Please enter a valid email address.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-800 text-white rounded-md transition-all duration-500 font-medium hover:cursor-pointer"
            disabled={loading}
          >
            Send Reset Link
          </button>

          <div className="text-center mt-2">
            <Link
              href="/sign-in"
              className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>

      <LoadingFetch
        loading={loading}
        text="Processing your request. You will receive the password reset email!"
        inputText={email}
      />
    </div>
  );
};

export default ForgotPassword;
