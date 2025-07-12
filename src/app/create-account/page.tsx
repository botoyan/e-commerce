"use client";
import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const CreateAccountPage = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      form.username.trim().length === 0 ||
      !regexEmail.test(form.email) ||
      form.password.length < 8
    ) {
      alert("Please fill out all the forms correctly before submitting!");
      return clearFilters();
    }

    await fetch("/api/sign-up", {
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
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add product!");
        }
        return res.json();
      })
      .then((data) => {
        clearFilters();
        console.log(`User created: ${data._id}`);
        router.push("/sign-in?userCreated=true");
      })
      .catch((error) => {
        alert("Server Error");
        clearFilters();
        console.error(`Error: ${error}`);
      });
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-center mb-6">
          <FaUserPlus size={110} className="text-gray-600" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
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
            className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-800 text-white rounded-md transition-all ease-in-out duration-500 hover:cursor-pointer font-medium"
          >
            Create Account
          </button>

          <p className="text-center text-sm text-gray-600 hover:underline hover:cursor-pointer transition-all ease-in-out duration-500 hover:text-gray-800">
            <a href="/sign-in" className="text-gray-800">
              Already have an account? Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountPage;
