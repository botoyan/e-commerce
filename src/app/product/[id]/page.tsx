"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
};

const products: Product[] = [
  {
    id: "1",
    name: "Nike PG 6",
    price: 99.99,
    description: "Perfect for fast breaks and sharp cuts.",
    image: "/assets/images/nike-pg-6.jpg",
  },
  {
    id: "2",
    name: "Nike Mercurial CR7",
    price: 129.99,
    description: "Engineered for speed and control.",
    image: "/assets/images/nike-mercurial-cr7.jpg",
  },
  {
    id: "3",
    name: "Adidas Predator",
    price: 119.99,
    description: "Unleash power and precision on the pitch.",
    image: "/assets/images/adidas-predator.jpg",
  },
];

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
  const [selectedSize, setSelectedSize] = useState<{
    type: "men" | "women";
    value: number;
  } | null>(null);

  useEffect(() => {
    const found = products.find((p) => p.id === id);
    if (!found) {
      router.replace("/not-found");
    } else {
      setProduct(found);
    }
  }, [id, router]);

  if (!product) return null;

  const updatePrice = () => {
    return selectedSize ? product.price : product.price;
  };
  const addToCart = () => {
    router.replace("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex flex-col items-center">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-5xl w-full flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-[400px] flex justify-center">
          <Image
            src={product.image}
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
                  const isSelected =
                    selectedSize?.type === "men" &&
                    selectedSize.value === Number(size);
                  return (
                    <button
                      key={`men-${size}`}
                      onClick={() =>
                        setSelectedSize({ type: "men", value: Number(size) })
                      }
                      className={`py-2 rounded-md text-sm border ${
                        isSelected
                          ? "bg-gray-900 text-white border-gray-300"
                          : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
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
                  const isSelected =
                    selectedSize?.type === "women" &&
                    selectedSize.value === Number(size);
                  return (
                    <button
                      key={`women-${size}`}
                      onClick={() =>
                        setSelectedSize({ type: "women", value: Number(size) })
                      }
                      className={`py-2 rounded-md text-sm border ${
                        isSelected
                          ? "bg-gray-900 text-white border-gray-300"
                          : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
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
            disabled={!selectedSize}
            className={`px-6 py-3 rounded-lg text-white transition mb-6 w-full md:w-auto max-w-xs self-center md:self-start ${
              selectedSize
                ? "bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add to Cart - ${updatePrice().toFixed(2)}
          </button>

          <div className="text-gray-600 leading-relaxed">
            <h2 className="text-xl font-semibold mb-2">Product Features</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>{product.description}</li>
              <li>Material: Lightweight breathable mesh</li>
              <li>Weight: Approx. 0.8 kg</li>
              <li>Best for: Running, Training, Casual Wear</li>
              <li>Durability: High-traction rubber outsole</li>
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
  );
}
