"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Navbar from "./_components/navbar";
import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { motion } from "framer-motion";
import Sidebar from "./_components/sidebar";
import ProductSkeleton from "./_components/productSkeleton";

type Product = {
  name: string;
  category: string;
  imageURI: string;
  price: number;
  features: string[];
  _id: string;
};

type CartProduct = {
  quantity: number;
};

export default function HomePage() {
  const router = useRouter();
  const filteredSidebarRef = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [menSize, setMenSize] = useState<number[]>([]);
  const [womenSize, setWomenSize] = useState<number[]>([]);
  const [sortSelected, setSortSelected] = useState<string>("Recommended");
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<string>("0");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filtersOpen &&
        filteredSidebarRef.current &&
        !filteredSidebarRef.current.contains(event.target as Node)
      ) {
        setFiltersOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filtersOpen]);

  const applyFilters = () => {
    const params = new URLSearchParams();

    params.set("sorting", sortSelected);

    if (menSize.length > 0) params.set("menSizes", menSize.join("+"));
    if (womenSize.length > 0) params.set("womenSizes", womenSize.join("+"));
    if (price > 0) params.set("prices", `${price}-2000`);
    if (categories.length > 0) params.set("tags", categories.join("+"));

    const fullUrl = `/filteringOptions?${params.toString().toLowerCase()}`;

    router.push(fullUrl);
  };

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/products", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return setProducts(data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getCartInfo = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cart", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      const data = await response.json();
      const sum = data.data.products.reduce(
        (acc: number, item: CartProduct) => {
          const quantity = item.quantity ?? 0;
          return acc + quantity;
        },
        0
      );
      setCartItems(sum.toString());
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const toProductDetails = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  useEffect(() => {
    getProducts();
    getCartInfo();
  }, []);
  return (
    <>
      <SessionProvider>
        <div>
          <Navbar
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            cartItems={cartItems}
          />
          <div className={filtersOpen ? "opacity-70" : "bg-white text-black"}>
            <div className="relative h-screen w-full overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center">
                <div className="absolute inset-0 bg-gray-50" />
              </div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-black text-center px-4">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-indigo-600 text-5xl font-bold mb-4"
                >
                  Step Into Style
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-lg text-zinc-600 mb-6 font-semibold"
                >
                  Nike. Adidas. Puma. Your Choice, Your Style.
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-all duration-500 hover:-translate-y-1"
                >
                  Shop Now
                </motion.button>
              </div>
            </div>

            <section className="py-16 px-8 bg-gray-50">
              <div className="mx-4 flex justify-between text-gray-800 mb-4">
                <button
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-95 transition-transform duration-500"
                  onClick={() => {
                    setFiltersOpen(true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 transition-transform group-hover:rotate-12"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 10.117V15l4-2.5V10.12l4.606-5.72A1 1 0 0 0 13.894 3H2.106a1 1 0 0 0-.712 1.4L6 10.117z" />
                  </svg>
                  Filter & Sort
                </button>
                <div className="flex">
                  <div className="hidden md:flex text-gray-400 md:mt-2">
                    Showing 3 products out of 120
                  </div>
                </div>
              </div>
              {loading ? (
                [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
              ) : (
                <div className="grid grid-cols-1 custom-grid-520 custom-grid-820 lg:grid-cols-4 gap-10 px-4">
                  {products.map((product, index) => {
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 1, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.03 }}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 p-4 flex flex-col justify-between min-w-[240px]"
                      >
                        <span className="text-xs bg-zinc-200 text-zinc-600 px-2 py-1 rounded-full w-max mb-3 font-medium">
                          {product.category}
                        </span>
                        <Image
                          src={product.imageURI}
                          alt={`Product ${index + 1}`}
                          width={295}
                          height={295}
                          className="rounded-xl object-cover aspect-square w-full mb-4"
                        />
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-gray-900">
                            {product.name}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {product.features[0 || 1 || 2]}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-semibold text-indigo-600">
                            ${product.price}
                          </div>
                          <button
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500"
                            onClick={() => toProductDetails(product._id)}
                          >
                            View Details
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
          <Sidebar
            filtersOpen={filtersOpen}
            setSortSelected={setSortSelected}
            menSize={menSize}
            setMenSize={setMenSize}
            womenSize={womenSize}
            setWomenSize={setWomenSize}
            price={price}
            setPrice={setPrice}
            categories={categories}
            setCategories={setCategories}
            applyFilters={applyFilters}
            filteredSidebarRef={filteredSidebarRef}
          />
        </div>
        <style jsx>{`
          @media (min-width: 820px) and (max-width: 1080px) {
            .custom-grid-820 {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
          }
          @media (min-width: 520px) and (max-width: 819px) {
            .custom-grid-520 {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }
        `}</style>
      </SessionProvider>
    </>
  );
}
