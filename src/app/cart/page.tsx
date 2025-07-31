"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  selectedSize: number;
  quantity: number;
};

const initialCart: CartItem[] = [
  {
    id: "1",
    name: "Nike PG 6",
    price: 99.99,
    image: "/assets/images/nike-pg-6.jpg",
    selectedSize: 8,
    quantity: 2,
  },
  {
    id: "2",
    name: "Nike Mercurial CR7",
    price: 129.99,
    image: "/assets/images/nike-mercurial-cr7.jpg",
    selectedSize: 7.5,
    quantity: 1,
  },
  {
    id: "3",
    name: "Adidas Predator",
    price: 119.99,
    image: "/assets/images/adidas-predator.jpg",
    selectedSize: 9,
    quantity: 1,
  },
  {
    id: "4",
    name: "Nike PG 6",
    price: 99.99,
    image: "/assets/images/nike-pg-6.jpg",
    selectedSize: 10,
    quantity: 1,
  },
  {
    id: "5",
    name: "Nike PG 6",
    price: 99.99,
    image: "/assets/images/nike-pg-6.jpg",
    selectedSize: 8,
    quantity: 2,
  },
  {
    id: "6",
    name: "Nike Mercurial CR7",
    price: 129.99,
    image: "/assets/images/nike-mercurial-cr7.jpg",
    selectedSize: 7.5,
    quantity: 1,
  },
  {
    id: "7",
    name: "Adidas Predator",
    price: 119.99,
    image: "/assets/images/adidas-predator.jpg",
    selectedSize: 9,
    quantity: 1,
  },
  {
    id: "8",
    name: "Nike PG 6",
    price: 99.99,
    image: "/assets/images/nike-pg-6.jpg",
    selectedSize: 10,
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
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-gray-50 px-4 py-8 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-indigo-600 mb-8 text-center">
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
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-grow bg-white rounded-xl shadow-md p-4 max-h-[60vh] md:max-h-[75vh] overflow-y-auto">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 border-b last:border-none py-4"
              >
                <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0 shadow-sm">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Size: {item.selectedSize}
                  </p>

                  <select
                    value={
                      item.quantity > 11 ? "remove" : item.quantity.toString()
                    }
                    onChange={(e) => {
                      if (e.target.value === "remove") {
                        removeItem(item.id);
                      } else {
                        updateQuantity(item.id, parseInt(e.target.value));
                      }
                    }}
                    className="mt-3 w-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 hover:border-indigo-600 transition duration-200"
                    aria-label={`Select quantity or remove ${item.name}`}
                  >
                    {[...Array(11)].map((_, i) => (
                      <option key={i + 1} value={(i + 1).toString()}>
                        Qty: {i + 1}
                      </option>
                    ))}
                    <option
                      value="remove"
                      className="text-red-600 font-semibold"
                    >
                      Remove
                    </option>
                  </select>
                </div>

                <div className="text-indigo-600 font-semibold min-w-[80px] text-right ml-auto">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full md:w-72 bg-white rounded-xl shadow-md p-6 self-start">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

            <div className="space-y-4 text-gray-700 text-sm">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span>
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-gray-500">Free</span>
              </div>

              <div className="flex justify-between border-t pt-3 font-bold text-indigo-600 text-lg">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              onClick={() => alert("Proceeding to checkout...")}
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="text-center mt-10">
          <Link href="/" className="text-sm text-gray-500 hover:underline">
            ← Back to Homepage
          </Link>
        </div>
      )}
    </div>
  );
}

//TODO need to add max-width, and adjust the design
