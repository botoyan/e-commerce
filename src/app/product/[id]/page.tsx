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

const menSizes = ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5"];
const womenSizes = ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5"];

export default function ProductPage({ params }: Props) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [menSize, setMenSize] = useState<number[]>([]);
  const [womenSize, setWomenSize] = useState<number[]>([]);

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
    const totalPrice = Number(product.price.toFixed(2));
    if (menSize.length === 0 && womenSize.length === 0) {
      return totalPrice;
    }
    if (menSize.length === 0) {
      return totalPrice * womenSize.length;
    }
    if (womenSize.length === 0) {
      return totalPrice * menSize.length;
    }
    return totalPrice * (womenSize.length + menSize.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 flex flex-col items-center shadow-md hover:shadow-lg transition-shadow">
      <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow max-w-5xl w-full flex flex-col md:flex-row gap-12">
        <div className="flex-shrink-0 w-full md:w-[400px] flex justify-center">
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
            <h1 className="text-3xl font-semibold mb-8">{product.name}</h1>

            <div className="mb-8">
              <p className="text-gray-600 mb-3 font-semibold">
                Men&apos;s Sizes
              </p>
              <div className="grid grid-cols-5 gap-3">
                {menSizes.map((size) => (
                  <div
                    onClick={() => {
                      setMenSize((prev) => {
                        if ([...prev].includes(Number(size))) {
                          return [...prev].filter((item) => {
                            return item !== Number(size);
                          });
                        } else {
                          return [...prev, Number(size)];
                        }
                      });
                    }}
                    key={`men-${size}`}
                    className={
                      menSize.includes(Number(size))
                        ? "border border-gray-300 rounded-md py-2 text-center text-white cursor-pointer hover:bg-gray-700 transition bg-gray-900"
                        : "border border-gray-200 rounded-md py-2 text-center text-gray-800 cursor-pointer hover:bg-gray-100 transition"
                    }
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-gray-600 mb-3 font-semibold">
                Women&apos;s Sizes
              </p>
              <div className="grid grid-cols-5 gap-3">
                {womenSizes.map((size) => (
                  <div
                    onClick={() => {
                      setWomenSize((prev) => {
                        if ([...prev].includes(Number(size))) {
                          return [...prev].filter((item) => {
                            return item !== Number(size);
                          });
                        } else {
                          return [...prev, Number(size)];
                        }
                      });
                    }}
                    key={`women-${size}`}
                    className={
                      womenSize.includes(Number(size))
                        ? "border border-gray-300 rounded-md py-2 text-center text-white cursor-pointer hover:bg-gray-700 transition bg-gray-900"
                        : "border border-gray-200 rounded-md py-2 text-center text-gray-800 cursor-pointer hover:bg-gray-100 transition"
                    }
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 duration-500 transition mb-8 w-full md:w-auto max-w-xs self-center md:self-start hover:cursor-pointer">
            Add to Cart - ${updatePrice().toFixed(2)}
          </button>

          <div className="text-gray-600 leading-relaxed">
            <h2 className="text-xl font-semibold mb-2">Product Features</h2>
            <p>{product.description}</p>
          </div>
        </div>
      </div>

      <Link
        href="/"
        className="block text-sm text-gray-500 mt-10 hover:underline hover:text-gray-800"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
