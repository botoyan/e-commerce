"use client";
import React, { useState } from "react";
import { FaKey } from "react-icons/fa6";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!regexEmail.test(email)) {
      setError(true);
      return;
    }

    setError(false);
    setSubmitted(true);

    alert(`Password reset link sent to ${email}`);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-center mb-6">
          <FaKey size={90} className="text-gray-600" />
        </div>

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
                }
              }}
              onBlur={() => {
                if (!regexEmail.test(email)) {
                  setError(true);
                }
              }}
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
          >
            Send Reset Link
          </button>

          {submitted && (
            <p className="text-center text-sm text-green-600 mt-2">
              If that email exists, a reset link has been sent.
            </p>
          )}

          <div className="text-center mt-2">
            <a
              href="/sign-in"
              className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
            >
              Back to Sign In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
