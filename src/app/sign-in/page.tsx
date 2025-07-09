"use client";
import React, { useState } from "react";
import { FaUserLarge } from "react-icons/fa6";

const SignInPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: false, password: false });
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert("Signed in (placeholder)");
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-center mb-6">
          <FaUserLarge size={90} className="text-gray-600" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (regexEmail.test(form.email)) {
                  setError({ ...error, email: false });
                } else {
                  setError({ ...error, email: true });
                }
              }}
              onBlur={() => {
                if (!regexEmail.test(form.email)) {
                  setError({ ...error, email: true });
                } else {
                  setError({ ...error, email: false });
                }
              }}
            />
            {error.email && (
              <p className="mt-1 text-sm text-red-600">
                Please provide a valid email address
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                if (form.password.length > 7) {
                  setError({ ...error, password: false });
                } else {
                  setError({ ...error, password: false });
                }
              }}
              onBlur={() => {
                if (form.password.length > 7) {
                  setError({ ...error, password: false });
                } else {
                  setError({ ...error, password: true });
                }
              }}
            />
            {error.password && (
              <p className="mt-1 text-sm text-red-600">Password is required.</p>
            )}
          </div>

          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-800 text-white rounded-md transition-all ease-in-out duration-500 hover:cursor-pointer font-medium"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray-600 hover:underline hover:cursor-pointer hover:text-gray-800">
            <a href="/create-account">Don&apos;t have an account? Create one</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;

//TODO need to implement sign-in functionality and backend logic for user
//TODO need to implement forgot-password functionality and backend logic for user
//TODO need to implement create-account functionality and backend logic for user
