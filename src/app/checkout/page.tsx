"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sizes: number[];
};

const initialItems: CheckoutItem[] = [
  {
    id: "1",
    name: "Nike PG 6",
    price: 99.99,
    image: "/assets/images/nike-pg-6.jpg",
    quantity: 1,
    sizes: [8.5],
  },
  {
    id: "2",
    name: "Adidas Predator",
    price: 119.99,
    image: "/assets/images/adidas-predator.jpg",
    quantity: 2,
    sizes: [7],
  },
  {
    id: "3",
    name: "Nike PG 6",
    price: 99.99,
    image: "/assets/images/nike-pg-6.jpg",
    quantity: 1,
    sizes: [8.5],
  },
  {
    id: "4",
    name: "Adidas Predator",
    price: 119.99,
    image: "/assets/images/adidas-predator.jpg",
    quantity: 2,
    sizes: [7],
  },
];

export default function CheckoutPage() {
  const [items, setItems] = useState(initialItems);
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
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity * item.sizes.length,
    0
  );

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = Object.values(form).every((val) => val.trim() !== "");

  const handleCheckout = () => {
    if (!isFormValid || items.length === 0) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      router.push("/thank-you");
    }, 1500);
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
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              type="email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            />
            <input
              name="street"
              value={form.street}
              onChange={handleChange}
              placeholder="Street Address"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            />
            <input
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
              name="cardNumber"
              value={form.cardNumber}
              onChange={handleChange}
              placeholder="Card Number"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            />
            <div className="flex gap-4">
              <input
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                className="w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              />
              <input
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
            {items.length === 0 && (
              <p className="text-gray-600 text-center">No items in order.</p>
            )}
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 border-b pb-4 last:border-none"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={70}
                  height={70}
                  className="rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <p className="font-semibold truncate">{item.name}</p>
                  <p className="text-sm text-gray-600 truncate">
                    Sizes: {item.sizes.join(", ")}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      –
                    </button>
                    <span className="font-medium min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 text-sm mt-1 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-indigo-600 font-semibold whitespace-nowrap">
                  ${(item.price * item.quantity * item.sizes.length).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold text-lg mt-6 border-t pt-4">
            <span>Total:</span>
            <span className="text-indigo-600">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={processing || !isFormValid || items.length === 0}
            className={`mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold transition duration-300 ${
              processing || !isFormValid || items.length === 0
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
    </div>
  );
}
