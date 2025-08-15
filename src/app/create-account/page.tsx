"use client";
import React, { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import LoadingFetch from "../_components/loadingFetch";
import Link from "next/link";

const CreateAccount = () => {
  const [loading, setLoading] = useState(false);
  const [userExists, setUserExists] = useState("");
  const [submitError, setSubmitError] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    username: false,
    email: false,
    password: false,
  });

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (userExists) {
      const timeout = setTimeout(() => setUserExists(""), 5000);
      return () => clearTimeout(timeout);
    }
    if (submitError) {
      const timeout = setTimeout(() => setSubmitError(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [userExists, submitError]);

  const clearFilters = () => {
    setForm({
      username: "",
      email: "",
      password: "",
    });
    setError({
      username: false,
      email: false,
      password: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      form.username.trim().length === 0 ||
      !regexEmail.test(form.email) ||
      form.password.length < 8
    ) {
      setSubmitError(true);
      return clearFilters();
    }

    setLoading(true);

    fetch("/api/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: form.username,
        email: form.email,
        password: form.password,
      }),
    })
      .then(async (res) => {
        if (res.status === 409) {
          const data = await res.json();
          if (data.message.includes("Email")) {
            setUserExists("email");
          } else if (data.message.includes("Username")) {
            setUserExists("username");
          }
          setLoading(false);
          return null;
        }
        if (!res.ok) {
          throw new Error("Failed to create an user!");
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        clearFilters();
        router.replace("/sign-in?userCreated=true");
      })
      .catch((error) => {
        clearFilters();
        console.error(`Error: ${error}`);
      });
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-center mb-6">
          <FaUserPlus size={110} color="#4f46e5" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            {userExists === "email" && (
              <div className="p-3 rounded-md bg-red-100 border border-red-400 font-medium text-sm text-red-700 text-center mb-2">
                Account already exists with this email. Please log in instead.
              </div>
            )}
            {userExists === "username" && (
              <div className="p-3 rounded-md bg-red-100 border border-red-400 font-medium text-sm text-red-700 text-center mb-2">
                Username is already taken. Please Try another one.
              </div>
            )}
            {submitError && (
              <div className="p-3 rounded-md bg-red-100 border border-red-400 font-medium text-sm text-red-700 text-center mb-2">
                Please fill out all the forms correctly before submitting!
              </div>
            )}
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input
              autoComplete="off"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              placeholder="e.g. sneakerfan"
              value={form.username}
              onChange={(e) => {
                setForm({ ...form, username: e.target.value });
                if (e.target.value.trim()) {
                  setError({ ...error, username: false });
                }
              }}
              onBlur={() => {
                setError({
                  ...error,
                  username: form.username.trim().length === 0,
                });
              }}
            />
            {error.username && (
              <p className="mt-1 text-sm text-red-600">Username is required.</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (regexEmail.test(e.target.value)) {
                  setError({ ...error, email: false });
                }
              }}
              onBlur={() => {
                setError({
                  ...error,
                  email: !regexEmail.test(form.email),
                });
              }}
            />
            {error.email && (
              <p className="mt-1 text-sm text-red-600">
                Please enter a valid email.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                if (e.target.value.length >= 8) {
                  setError({ ...error, password: false });
                }
              }}
              onBlur={() => {
                setError({
                  ...error,
                  password: form.password.length < 8,
                });
              }}
            />
            {error.password && (
              <p className="mt-1 text-sm text-red-600">
                Password must be at least 8 characters.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all ease-in-out duration-500 font-semibold"
          >
            Create Account
          </button>

          <p className="text-center text-sm text-gray-500 hover:underline transition-all ease-in-out duration-500 hover:text-gray-800">
            <Link href="/sign-in" className="text-gray-500">
              Already have an account? Sign in
            </Link>
          </p>
        </form>
      </div>
      <LoadingFetch
        loading={loading}
        text="Processing your request. You will be redirected to the login page shortly."
        inputText={form.email}
      />
    </div>
  );
};

export default CreateAccount;
