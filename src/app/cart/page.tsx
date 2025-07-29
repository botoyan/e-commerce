"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  selectedSizes: number[];
  quantity: number;
};

const initialCart: CartItem[] = [
  {
    id: "1",
    name: "Nike PG 6",
    price: 99.99,
    image: "/assets/images/nike-pg-6.jpg",
    selectedSizes: [8, 9],
    quantity: 2,
  },
  {
    id: "2",
    name: "Nike Mercurial CR7",
    price: 129.99,
    image: "/assets/images/nike-mercurial-cr7.jpg",
    selectedSizes: [7.5],
    quantity: 1,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity * item.selectedSizes.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 flex flex-col max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-indigo-600 mb-10 text-center">
        Your Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600">
          Your cart is empty.{" "}
          <Link
            href="/"
            className="text-indigo-600 underline hover:text-indigo-800"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-grow bg-white rounded-xl shadow-md p-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 border-b last:border-none py-4 items-center"
              >
                <div className="flex-shrink-0 w-28 h-28 relative rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col flex-grow justify-between h-full">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Sizes: {item.selectedSizes.join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <label className="text-gray-700 font-medium">Qty:</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                      className="w-16 border rounded-md px-2 py-1 text-center focus:outline-indigo-500"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-indigo-600 font-bold text-lg min-w-[90px] text-right">
                  $
                  {(
                    item.price *
                    item.quantity *
                    item.selectedSizes.length
                  ).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full md:w-80 bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Order Summary</h3>
              <div className="flex justify-between text-gray-700 mb-4">
                <span>Items:</span>
                <span>
                  {cartItems.reduce(
                    (acc, item) =>
                      acc + item.quantity * item.selectedSizes.length,
                    0
                  )}
                </span>
              </div>
              <div className="flex justify-between text-indigo-600 font-bold text-xl mb-8">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
              onClick={() => alert("Proceeding to checkout...")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
