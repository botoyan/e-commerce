"use client";

import React from "react";

type Form = {
  fullName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

type Props = {
  form: Form;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
  createKeyDownHandler: (
    type: "letters" | "numbers"
  ) => (e: React.KeyboardEvent<HTMLInputElement>) => void;
  cardType: string;
  expiryError: string;
};

export default function ShippingAndPaymentForm({
  form,
  handleChange,
  createKeyDownHandler,
  cardType,
  expiryError,
}: Props) {
  return (
    <>
      <section className="md:col-span-2 bg-white p-6 rounded-xl shadow-md space-y-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
        <div className="space-y-4">
          <input
            autoCapitalize="off"
            autoCorrect="off"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            onKeyDown={createKeyDownHandler("letters")}
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
            onKeyDown={createKeyDownHandler("letters")}
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
              onKeyDown={createKeyDownHandler("numbers")}
              placeholder="ZIP Code"
              className="w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold pt-4 mb-4">Payment Details</h2>
        <div className="space-y-4 relative">
          <input
            autoCapitalize="off"
            autoCorrect="off"
            name="cardNumber"
            type="string"
            inputMode="numeric"
            value={form.cardNumber}
            maxLength={19}
            onChange={handleChange}
            onKeyDown={createKeyDownHandler("numbers")}
            placeholder="Card Number"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
          />
          {cardType !== "Unknown" && (
            <span className="absolute right-3 top-5 transform -translate-y-1/2 text-sm text-gray-400 font-medium">
              {cardType}
            </span>
          )}
          <div className="flex gap-4">
            <input
              autoCapitalize="off"
              autoCorrect="off"
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              placeholder="MM/YY"
              className={`w-1/2 border ${
                expiryError ? "border-red-500" : "border-gray-300"
              } rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                expiryError ? "focus:ring-red-500" : "focus:ring-indigo-600"
              }`}
            />
            {expiryError && (
              <p className="text-red-500 text-sm mt-1">{expiryError}</p>
            )}
            <input
              autoCapitalize="off"
              autoCorrect="off"
              name="cvc"
              maxLength={4}
              value={form.cvc}
              onChange={handleChange}
              onKeyDown={createKeyDownHandler("numbers")}
              placeholder="CVC"
              className="w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            />
          </div>
        </div>
      </section>
    </>
  );
}
