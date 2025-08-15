"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Loader from "../../_components/loaderProduct";
import LoadingFetch from "@/app/_components/loadingFetch";

type Product = {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  features: string[];
  menSizes: string[];
  womenSizes: string[];
  imageURI: string;
};

type Props = {
  params: Promise<{ id: string }>;
};

const menSizes = [
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
  "12.5",
  "13",
  "14",
];

const womenSizes = [
  "5",
  "5.5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "12",
  "13",
];

export default function ProductPage({ params }: Props) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingForCart, setLoadingForCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState<{
    type: "men" | "women";
    value: number;
  } | null>(null);

  const getProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/products");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: { data: Product[] } = await response.json();
      const found = data.data.find((prod) => prod._id === id);
      return setProduct(found || null);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToCart = async () => {
    if (selectedSize === null) return;

    setLoadingForCart(true);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          shoeSize: selectedSize.value,
          sizeCategory: selectedSize.type,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add product to cart!");
      }

      const data = await res.json();
      if (!data) return;

      router.replace("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("There was a problem adding the item to your cart.");
    } finally {
      setLoadingForCart(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : !product ? (
        <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
          Product not found.
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 px-4 py-10 flex flex-col items-center">
          <div className="bg-white p-6 rounded-xl shadow-md max-w-5xl w-full flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-[400px] flex justify-center">
              <Image
                src={product.imageURI}
                alt={product.name}
                width={400}
                height={400}
                className="object-cover rounded-md"
              />
            </div>

            <div className="flex flex-col justify-between flex-grow">
              <div>
                <h1 className="text-3xl font-semibold mb-6">{product.name}</h1>

                <div className="mb-6">
                  <p className="text-gray-600 mb-3 font-semibold">
                    Men&apos;s Sizes
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {menSizes.map((size) => {
                      const isAvailable = product.menSizes.includes(size);
                      const isSelected =
                        selectedSize?.type === "men" &&
                        selectedSize.value === Number(size);

                      return (
                        <button
                          key={`men-${size}`}
                          onClick={() =>
                            isAvailable &&
                            setSelectedSize({
                              type: "men",
                              value: Number(size),
                            })
                          }
                          disabled={!isAvailable}
                          className={`py-2 rounded-md text-sm border transition ${
                            isAvailable
                              ? isSelected
                                ? "bg-gray-900 text-white border-gray-300"
                                : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
                              : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-3 font-semibold">
                    Women&apos;s Sizes
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {womenSizes.map((size) => {
                      const isAvailable = product.womenSizes.includes(size);
                      const isSelected =
                        selectedSize?.type === "women" &&
                        selectedSize.value === Number(size);

                      return (
                        <button
                          key={`women-${size}`}
                          onClick={() =>
                            isAvailable &&
                            setSelectedSize({
                              type: "women",
                              value: Number(size),
                            })
                          }
                          disabled={!isAvailable}
                          className={`py-2 rounded-md text-sm border transition ${
                            isAvailable
                              ? isSelected
                                ? "bg-gray-900 text-white border-gray-300"
                                : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
                              : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={addToCart}
                disabled={!selectedSize || loadingForCart}
                className={`px-6 py-3 rounded-lg text-white transition mb-6 w-full md:w-auto max-w-xs self-center md:self-start ${
                  selectedSize
                    ? "bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Add to Cart - ${product.price.toFixed(2)}
              </button>

              <div className="text-gray-600 leading-relaxed">
                <h2 className="text-xl font-semibold mb-2">Product Features</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {product.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="block text-sm text-gray-500 mt-4 hover:underline hover:text-gray-800"
          >
            ← Back to Home
          </Link>
        </div>
      )}
      <LoadingFetch
        loading={loadingForCart}
        text="Processing your request. You will be redirected to the cart page shortly."
        inputText={product?.name || "Product Name"}
      />
    </>
  );
}
