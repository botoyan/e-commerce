"use client";
import React, { useState, FormEvent, useEffect } from "react";
import { FaUserLarge } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingFetch from "../_components/loadingFetch";

const SignIn = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userCreated = searchParams?.get("userCreated") === "true";
  const [accountCreated, setAccountCreated] = useState(userCreated);
  const [loading, setLoading] = useState(false);
  const [handleError, setHandleError] = useState("none");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: false, password: false });
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (handleError === "wrongSubmit" || handleError === "wrongCredentials") {
      const timeout = setTimeout(() => setHandleError("none"), 5000);
      return () => clearTimeout(timeout);
    }
    if (accountCreated) {
      setAccountCreated(true);
      const timeout = setTimeout(() => setAccountCreated(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [handleError, accountCreated]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!regexEmail.test(form.email) || form.password.length < 8) {
      return setHandleError("wrongSubmit");
    }
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      setLoading(false);
      setHandleError("wrongCredentials");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-center mb-6">
          <FaUserLarge size={90} color="#4f46e5" />
        </div>
        {accountCreated && (
          <div className="p-3 rounded-full bg-green-200 border-green-400 font-medium text-sm text-green-600 text-center mb-2">
            Account was created successfully! Please log in
          </div>
        )}
        {handleError === "wrongSubmit" && (
          <div className="p-3 rounded-md bg-red-100 border border-red-400 font-medium text-sm text-red-700 text-center mb-2">
            Please fill out all the forms correctly before submitting!
          </div>
        )}
        {handleError === "wrongCredentials" && (
          <div className="p-3 rounded-md bg-red-100 border border-red-400 font-medium text-sm text-red-700 text-center mb-2">
            Invalid email or password. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (regexEmail.test(e.target.value)) {
                  setError({ ...error, email: false });
                } else {
                  setError({ ...error, email: true });
                }
              }}
              onBlur={(e) => {
                if (!regexEmail.test(e.target.value)) {
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
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                if (e.target.value.length > 7) {
                  setError({ ...error, password: false });
                } else {
                  setError({ ...error, password: false });
                }
              }}
              onBlur={(e) => {
                if (e.target.value.length > 7) {
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
            <Link
              href="/forgot-password"
              className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition hover:cursor-pointer ease-in-out duration-500 font-semibold"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray-500 hover:underline hover:cursor-pointer hover:text-gray-800">
            <Link
              href="/create-account"
              className="text-center text-sm text-gray-500 hover:underline hover:text-gray-800"
            >
              Don&apos;t have an account? Create one
            </Link>
          </p>
        </form>
      </div>
      <LoadingFetch
        loading={loading}
        text="Processing your request. You will be redirected to the main page shortly."
        inputText={form.email}
      />
    </div>
  );
};

export default SignIn;
