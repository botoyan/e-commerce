"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

const ThankYouPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/");
    }, 7000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 sm:p-10 text-center border border-gray-200">
        <div className="flex items-center justify-center mb-6">
          <FaCheckCircle size={100} className="text-green-500 drop-shadow-sm" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Your order has been placed successfully. A confirmation email will be
          sent to you shortly.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-all duration-300"
        >
          Continue Shopping
        </Link>
        <p className="text-sm text-gray-400 mt-5">
          Redirecting to the homepage in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default ThankYouPage;
