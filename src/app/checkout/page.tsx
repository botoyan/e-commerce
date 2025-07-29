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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="min-h-screen bg-gray-50 px-6 py-10 max-w-6xl mx-auto overflow-auto">
      <h1 className="text-4xl font-bold text-indigo-600 mb-10 text-center">
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-h-[90vh] overflow-y-auto pb-8">
        {/* Shipping + Payment Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md space-y-6">
          <h2 className="text-xl font-semibold">Shipping Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="border border-gray-300 rounded-md px-4 py-2"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              type="email"
              className="border border-gray-300 rounded-md px-4 py-2"
            />
            <input
              name="street"
              value={form.street}
              onChange={handleChange}
              placeholder="Street Address"
              className="col-span-2 border border-gray-300 rounded-md px-4 py-2"
            />
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="border border-gray-300 rounded-md px-4 py-2"
            />
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="border border-gray-300 rounded-md px-4 py-2"
            />
            <input
              name="zip"
              value={form.zip}
              onChange={handleChange}
              placeholder="ZIP Code"
              className="border border-gray-300 rounded-md px-4 py-2"
            />
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Country"
              className="border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <h2 className="text-xl font-semibold pt-4">Payment Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="cardNumber"
              value={form.cardNumber}
              onChange={handleChange}
              placeholder="Card Number"
              className="col-span-2 border border-gray-300 rounded-md px-4 py-2"
            />
            <input
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              placeholder="MM/YY"
              className="border border-gray-300 rounded-md px-4 py-2"
            />
            <input
              name="cvc"
              value={form.cvc}
              onChange={handleChange}
              placeholder="CVC"
              className="border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between h-fit">
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 border-b pb-4"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={70}
                    height={70}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Sizes: {item.sizes.join(", ")}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        –
                      </button>
                      <span className="font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 text-sm mt-1 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-indigo-600 font-semibold">
                    $
                    {(item.price * item.quantity * item.sizes.length).toFixed(
                      2
                    )}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-semibold text-lg mt-6">
              <span>Total:</span>
              <span className="text-indigo-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={processing || !isFormValid || items.length === 0}
            className={`mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold transition duration-300 ${
              processing || !isFormValid || items.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-indigo-700 hover:cursor-pointer"
            }`}
          >
            {processing ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link href="/cart" className="text-sm text-gray-500 hover:underline">
          ← Back to Cart
        </Link>
      </div>
    </div>
  );
}
