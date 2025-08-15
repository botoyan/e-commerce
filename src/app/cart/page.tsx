"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Loader from "../_components/loaderProduct";
import CartEmpty from "../_components/cartEmpty";

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

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [productRemoveMessage, setProductRemoveMessage] =
    useState<boolean>(false);

  const getCartItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();
      setCartItems(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCartItems();
  }, []);

  useEffect(() => {
    if (productRemoveMessage) {
      setTimeout(() => {
        setProductRemoveMessage(false);
      }, 5000);
    }
  }, [productRemoveMessage]);

  const updateQuantity = async (
    productId: string,
    sizeCategory: string,
    shoeSize: number,
    newQuantity: number
  ) => {
    try {
      const response = await fetch("http://localhost:3000/api/cart", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          productId,
          newQuantity,
          sizeCategory,
          shoeSize,
        }),
      });
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      setCartItems((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          products: prev.products.map((item) => {
            if (item.product._id !== productId) return item;
            if (
              item.shoeSize === shoeSize &&
              item.sizeCategory === sizeCategory
            ) {
              return {
                ...item,
                quantity: newQuantity,
              };
            }
            return item;
          }),
          total: data.data.total,
        };
      });
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const removeItem = async (
    productId: string,
    sizeCategory: string,
    shoeSize: number
  ) => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          sizeCategory: sizeCategory,
          shoeSize: shoeSize,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      setCartItems((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          products: prev.products.filter(
            (item) =>
              !(
                item.product._id === productId &&
                item.shoeSize === shoeSize &&
                item.sizeCategory === sizeCategory
              )
          ),
          total: data.data.total,
        };
      });

      setProductRemoveMessage(true);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const calculatedTotal = cartItems?.products.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const toCheckout = async () => {};

  if (loading) {
    return <Loader />;
  }

  if (!cartItems || cartItems.products.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="bg-gray-50 px-4 py-8 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-indigo-600 mb-8 text-center">
        Your Shopping Cart
      </h1>
      {productRemoveMessage && (
        <div className="p-3 rounded-full bg-green-200 border-green-400 font-medium text-sm text-green-600 text-center mb-2">
          The item was successfully removed from the cart!
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow bg-white rounded-xl shadow-md p-4 max-h-[60vh] overflow-y-auto">
          {cartItems.products.map((item, index) => (
            <div
              key={item.product._id + index}
              className="flex items-center gap-4 py-4 border-b"
            >
              <Image
                src={item.product.imageURI}
                alt={item.product.name}
                width={100}
                height={100}
                className="rounded-md object-cover flex-shrink-0"
              />
              <div className="flex-grow min-w-0">
                <h2 className="text-lg font-semibold truncate">
                  {item.product.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Size:{" "}
                  <span className="font-medium">
                    {item.shoeSize} ({item.sizeCategory})
                  </span>
                </p>

                <div className="flex items-center space-x-2 mt-2 max-w-max">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product._id,
                        item.sizeCategory,
                        item.shoeSize,
                        item.quantity - 1
                      )
                    }
                    disabled={item.quantity <= 1}
                    aria-label={`Decrease quantity of ${item.product.name}`}
                    className="w-8 h-8 flex justify-center items-center rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    &minus;
                  </button>

                  <span className="w-8 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product._id,
                        item.sizeCategory,
                        item.shoeSize,
                        item.quantity + 1
                      )
                    }
                    aria-label={`Increase quantity of ${item.product.name}`}
                    className="w-8 h-8 flex justify-center items-center rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  >
                    +
                  </button>

                  <button
                    onClick={() =>
                      removeItem(
                        item.product._id,
                        item.sizeCategory,
                        item.shoeSize
                      )
                    }
                    aria-label={`Remove ${item.product.name} from cart`}
                    className="ml-4 text-red-600 hover:text-red-800 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="text-indigo-600 font-semibold text-right w-[90px] flex-shrink-0 text-lg">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full md:w-72 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 text-gray-700 text-sm">
            <div className="flex justify-between">
              <span>Total Items</span>
              <span>
                {cartItems.products.reduce(
                  (acc, item) => acc + item.quantity,
                  0
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-gray-500">Free</span>
            </div>
            <div className="flex justify-between border-t pt-3 font-bold text-indigo-600 text-lg">
              <span>Total</span>
              <span>${calculatedTotal?.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={toCheckout}
            className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
