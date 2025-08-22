"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingFetch from "@/app/_components/loadingFetch";
import createKeyDownHandler from "../../_components/handleKeyDown";
import ShippingAndPaymentForm from "../../_components/CheckoutForm";

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
  params: { id: string };
};

export default function CheckoutPage({ params }: Props) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    })();
  }, [params]);
  const router = useRouter();
  const [items, setItems] = useState<CheckoutResponse | null>(null);
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const expiryRegex = /^(0[1-9]|1[0-2])\/?\d{2}$/;
  const [errorMessage, setErrorMessage] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [expiryError, setExpiryError] = useState("");
  const [cardType, setCardType] = useState("Unknown");
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

  const detectCardType = (number: string): string => {
    const cleaned = number.replace(/\s/g, "");

    if (/^4/.test(cleaned)) {
      return "Visa";
    }

    if (
      /^5[1-5]/.test(cleaned) ||
      /^2(2[2-9][1-9]|2[3-9]\d|[3-6]\d{2}|7[01]\d|720)/.test(cleaned)
    ) {
      return "MasterCard";
    }

    if (/^3[47]/.test(cleaned)) {
      return "Amex";
    }

    return "Unknown";
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "expiry") {
      const cleaned = value.replace(/[^\d]/g, "");
      if (cleaned.length <= 2) {
        newValue = cleaned;
      } else {
        newValue = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      }

      const mmYYRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

      if (newValue.length === 5 && mmYYRegex.test(newValue)) {
        const [inputMonthStr, inputYearStr] = newValue.split("/");
        const inputMonth = parseInt(inputMonthStr, 10);
        const inputYear = parseInt("20" + inputYearStr, 10);

        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();

        if (
          inputYear < currentYear ||
          (inputYear === currentYear && inputMonth < currentMonth)
        ) {
          setExpiryError("Card has expired");
        } else {
          setExpiryError("");
        }
      } else if (newValue.length === 5) {
        setExpiryError("Invalid expiry date format (MM/YY)");
      } else {
        setExpiryError("");
      }
    }
    if (name === "cardNumber") {
      const cleaned = value.replace(/[^\d]/g, "");
      newValue = cleaned.replace(/(.{4})/g, "$1 ").trim();
      console.log(detectCardType(cleaned));
      setCardType(detectCardType(cleaned));
    }
    setForm((prev) => ({ ...prev, [name]: newValue }));
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
    const isEmailValid = regexEmail.test(form.email);
    const isZipValid = form.zip.length === 5;
    const isCardValid =
      form.cardNumber.length === 18 || form.cardNumber.length === 19;
    const isCvcValid = form.cvc.length === 3 || form.cvc.length === 4;
    const isExpiryValid = expiryRegex.test(form.expiry);
    const isStateSelected = form.state !== "";
    const isNameFilled = form.fullName.trim() !== "";
    const isStreetFilled = form.street.trim() !== "";
    const isCityFilled = form.city.trim() !== "";

    if (
      isEmailValid &&
      isZipValid &&
      isCardValid &&
      isCvcValid &&
      isExpiryValid &&
      isStateSelected &&
      isNameFilled &&
      isStreetFilled &&
      isCityFilled
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage, form]);

  const checkout = async () => {
    const isAmex = cardType === "Amex";
    const validCvcLength = isAmex ? 4 : 3;

    if (
      !regexEmail.test(form.email) ||
      form.zip.length !== 5 ||
      (form.cardNumber.length !== 18 && form.cardNumber.length !== 19) ||
      form.cvc.length !== validCvcLength ||
      !expiryRegex.test(form.expiry) ||
      form.state === "" ||
      form.fullName.trim() === "" ||
      form.street.trim() === "" ||
      form.city.trim() === ""
    ) {
      setErrorMessage(true);
      return;
    }
    try {
      setProcessing(true);
      const response = await fetch(`/api/checkout/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          streetAddress: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zip,
        }),
      });
      const data = await response.json();

      if (response.ok && data.data?.orderId) {
        router.replace(`/thank-you/${data.data.orderId}`);
      } else {
        console.error("Checkout failed:", data.message || "Unknown error");
        setErrorMessage(true);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setErrorMessage(true);
    } finally {
      setProcessing(false);
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
        <ShippingAndPaymentForm
          form={form}
          handleChange={handleChange}
          createKeyDownHandler={createKeyDownHandler}
          cardType={cardType}
          expiryError={expiryError}
        />

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
