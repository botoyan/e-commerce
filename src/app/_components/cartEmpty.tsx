import Link from "next/link";

export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-28 w-28 text-indigo-500 mb-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 6h12m-6-6v6"
        />
      </svg>

      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Your cart is empty
      </h2>
      <p className="text-gray-500 mb-6">
        Looks like you haven’t added anything yet.
      </p>

      <Link
        href="/"
        className="px-6 py-3 bg-indigo-600 text-white rounded-md text-sm font-medium shadow hover:bg-indigo-700 transition duration-300"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
