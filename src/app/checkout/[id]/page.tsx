"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingFetch from "@/app/_components/loadingFetch";

type CartItem = {
  product: {
    _id: string;
    name: string;
    price: number;
    imageURI: string;
  };
  quantity: number;
  sizeCategory: "men" | "women";
  shoeSize: number;
};

type CartResponse = {
  products: CartItem[];
  total: number;
};

type Props = {
  params: Promise<{ id: string }>;
};

export default function CheckoutPage({ params }: Props) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const [items, setItems] = useState<CartResponse | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = Object.values(form).every((val) => val.trim() !== "");

  const getCheckoutInfo = async () => {
    try {
      setProcessing(true);
      const response = await fetch("api/checkout", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      const data = await response.json();
      if (data.data) {
        setItems(data.data.items);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-indigo-600 mb-10 text-center">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="md:col-span-2 bg-white p-6 rounded-xl shadow-md space-y-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="space-y-4">
            <input
              autoCapitalize="off"
              autoCorrect="off"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            />
            <input
              autoCapitalize="off"
              autoCorrect="off"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              type="email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            />
            <input
              autoCapitalize="off"
              autoCorrect="off"
              name="street"
              value={form.street}
              onChange={handleChange}
              placeholder="Street Address"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            />
            <input
              autoCapitalize="off"
              autoCorrect="off"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            />
            <div className="flex gap-4">
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-1/2 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 hover:border-indigo-600 transition duration-200"
              >
                <option value="">State</option>
                {[
                  "AL",
                  "AK",
                  "AZ",
                  "AR",
                  "CA",
                  "CO",
                  "CT",
                  "DE",
                  "FL",
                  "GA",
                  "HI",
                  "ID",
                  "IL",
                  "IN",
                  "IA",
                  "KS",
                  "KY",
                  "LA",
                  "ME",
                  "MD",
                  "MA",
                  "MI",
                  "MN",
                  "MS",
                  "MO",
                  "MT",
                  "NE",
                  "NV",
                  "NH",
                  "NJ",
                  "NM",
                  "NY",
                  "NC",
                  "ND",
                  "OH",
                  "OK",
                  "OR",
                  "PA",
                  "RI",
                  "SC",
                  "SD",
                  "TN",
                  "TX",
                  "UT",
                  "VT",
                  "VA",
                  "WA",
                  "WV",
                  "WI",
                  "WY",
                ].map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <input
                autoCapitalize="off"
                autoCorrect="off"
                name="zip"
                value={form.zip}
                onChange={handleChange}
                placeholder="ZIP Code"
                className="w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>
          </div>

          <h2 className="text-xl font-semibold pt-4 mb-4">Payment Details</h2>
          <div className="space-y-4">
            <input
              autoCapitalize="off"
              autoCorrect="off"
              name="cardNumber"
              value={form.cardNumber}
              onChange={handleChange}
              placeholder="Card Number"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            />
            <div className="flex gap-4">
              <input
                autoCapitalize="off"
                autoCorrect="off"
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                className="w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              />
              <input
                autoCapitalize="off"
                autoCorrect="off"
                name="cvc"
                value={form.cvc}
                onChange={handleChange}
                placeholder="CVC"
                className="w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-md flex flex-col md:max-h-[75vh]">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

          <div className="flex-grow overflow-auto space-y-4 pr-2">
            {!items && (
              <p className="text-gray-600 text-center">No items in order.</p>
            )}
            {items?.products.map((item) => (
              <div
                key={item.product._id}
                className="flex items-start gap-4 border-b pb-4 last:border-none"
              >
                <Image
                  src={item.product.imageURI}
                  alt={item.product.name}
                  width={70}
                  height={70}
                  className="rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <p className="font-semibold truncate">{item.product.name}</p>
                  <p className="text-sm text-gray-600 truncate">
                    Size: {item.shoeSize}{" "}
                    {item.sizeCategory.slice(0, 1).toUpperCase()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label={`Decrease quantity of ${item.product.name}`}
                    >
                      –
                    </button>
                    <span className="font-medium min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label={`Increase quantity of ${item.product.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button className="text-red-500 text-sm mt-1 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400">
                    Remove
                  </button>
                </div>
                <p className="text-indigo-600 font-semibold whitespace-nowrap">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold text-lg mt-6 border-t pt-4">
            <span>Total:</span>
            <span className="text-indigo-600">${items?.total.toFixed(2)}</span>
          </div>

          <button
            className={`mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold transition duration-300 ${
              processing
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-indigo-700"
            }`}
          >
            {processing ? "Processing..." : "Place Order"}
          </button>
        </section>
      </div>

      <div className="text-center mt-8">
        <Link href="/cart" className="text-sm text-gray-500 hover:underline">
          ← Back to Cart
        </Link>
      </div>
      <LoadingFetch
        loading={processing}
        text="Processing your request. You will be redirected to the checkout page shortly."
        inputText="Please wait..."
      />
    </div>
  );
}
