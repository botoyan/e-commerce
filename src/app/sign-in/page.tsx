"use client";
import React, { useState, FormEvent, useEffect } from "react";
import { FaUserLarge } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignInPage = () => {
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
          <FaUserLarge size={90} className="text-gray-600" />
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
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full space-y-6">
            <h2 className="text-2xl font-semibold mb-2 text-blue-700">
              In process
            </h2>
            <input
              type="text"
              value={form.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 cursor-not-allowed"
              aria-label="Email"
            />
            <p className="text-gray-600">
              Processing your request. You will be redirected to the login page
              shortly.
            </p>
            <div className="flex justify-center">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInPage;

//TODO need to implement sign-in functionality and backend logic for user
//TODO need to implement forgot-password functionality and backend logic for user
//TODO need to implement create-account functionality and backend logic for user
