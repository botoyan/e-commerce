"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaBan } from "react-icons/fa";
import Link from "next/link";

const Unauthorized = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/");
    }, 5000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <FaBan size={110} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-all font-medium ease-in-out duration-500"
        >
          Go Home
        </Link>
        <p className="text-sm text-gray-400 mt-4">
          Redirecting in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
