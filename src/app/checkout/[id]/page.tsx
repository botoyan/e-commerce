"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingFetch from "@/app/_components/loadingFetch";

type CheckoutItem = {
  product: {
    _id: string;
    name: string;
    price: number;
    imageURI: string;
  };
  sizeCategory: "men" | "women";
  shoeSize: number;
  quantity: number;
};

type CheckoutResponse = {
  user: string;
  items: CheckoutItem[];
  total: number;
};

type Props = {
  params: Promise<{ id: string }>;
};

export default function CheckoutPage({ params }: Props) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  const [items, setItems] = useState<CheckoutResponse | null>(null);
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const expiryRegex = /^(0[1-9]|1[0-2])\/?\d{2}$/;
  const [errorMessage, setErrorMessage] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [processing, setProcessing] = useState(false);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchCheckout = async () => {
    try {
      setProcessing(true);
      const res = await fetch(`/api/checkout/${id}`);
      if (!res.ok) {
        throw new Error("Failed to load checkout");
      }

      const data = await res.json();
      setItems(data.data);
      if (Number(data.data.total) === 0) {
        router.replace("/cart");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (id) fetchCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Enter",
    ];

    if (
      allowedKeys.includes(e.key) ||
      (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
    ) {
      return;
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const removeItem = async (
    productId: string,
    shoeSize: number,
    sizeCategory: string
  ) => {
    try {
      setProcessing(true);
      const response = await fetch(`/api/checkout/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify({
          productId,
          shoeSize,
          sizeCategory,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to load checkout");
      }
      const data = await response.json();
      if (data.data) {
        await fetchCheckout();
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const updateQuantity = async (
    productId: string,
    sizeCategory: string,
    shoeSize: number,
    newQuantity: number
  ) => {
    try {
      setProcessing(true);
      const response = await fetch(`/api/checkout/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          productId,
          shoeSize,
          sizeCategory,
          newQuantity,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to load checkout");
      }
      const data = await response.json();
      if (data.data) {
        fetchCheckout();
        setItems(data.data);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(false);
      }, 5000);
    }
    if (
      regexEmail.test(form.email) &&
      form.zip.length === 5 &&
      (form.cardNumber.length === 15 || form.cardNumber.length === 16) &&
      (form.cvc.length === 3 || form.cvc.length === 4) &&
      expiryRegex.test(form.expiry)
    ) {
      setDisabled(false);
      return;
    } else {
      setDisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage, form]);

  const checkout = async () => {
    if (
      !regexEmail.test(form.email) ||
      form.zip.length !== 5 ||
      (form.cardNumber.length !== 15 && form.cardNumber.length !== 16) ||
      (form.cvc.length !== 3 && form.cvc.length !== 4) ||
      !expiryRegex.test(form.expiry)
    ) {
      setErrorMessage(true);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-indigo-600 mb-10 text-center">
        Checkout
      </h1>
      {errorMessage && (
        <div className="p-3 rounded-md bg-red-100 border border-red-400 font-medium text-sm text-red-700 text-center mb-2">
          Please fill out all the forms correctly before submitting!
        </div>
      )}
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
                maxLength={5}
                value={form.zip}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
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
              type="string"
              inputMode="numeric"
              value={form.cardNumber}
              maxLength={16}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
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
                maxLength={4}
                value={form.cvc}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
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
            {items?.items.map((item, index) => (
              <div
                key={`${item.product._id}+${index}`}
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
                    {item.sizeCategory.slice(0, 1).toLocaleUpperCase()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
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
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label={`Decrease quantity of ${item.product.name}`}
                    >
                      &minus;
                    </button>
                    <span className="font-medium min-w-[20px] text-center">
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
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label={`Increase quantity of ${item.product.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      removeItem(
                        item.product._id,
                        item.shoeSize,
                        item.sizeCategory
                      )
                    }
                    className="text-red-500 text-sm mt-1 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
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
            onClick={checkout}
            className={`mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold transition duration-300 ${
              disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
            }`}
          >
            Place Order
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
        text="Processing your request..."
        inputText="Please wait..."
      />
    </div>
  );
}
