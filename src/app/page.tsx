"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Navbar from "./_components/navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Sidebar from "./_components/sidebar";
import ProductSkeleton from "./_components/productSkeleton";
import LoadingFetch from "./_components/loadingFetch";

type Product = {
  name: string;
  category: string;
  imageURI: string;
  price: number;
  features: string[];
  _id: string;
};

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filteredSidebarRef = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [menSize, setMenSize] = useState<number[]>([]);
  const [womenSize, setWomenSize] = useState<number[]>([]);
  const [sortSelected, setSortSelected] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [allProducts, setAllProducts] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [searched, setSearched] = useState<string>("");

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

  useEffect(() => {
    if (!searchParams || searchParams.toString() === "") return;
    const sorting = searchParams?.get("sorting") || "Recommended";
    const menSizes =
      searchParams?.get("mensizes")?.split("+").map(Number) || [];
    const womenSizes =
      searchParams?.get("womensizes")?.split("+").map(Number) || [];
    const priceRange = searchParams?.get("prices");
    const priceMin = priceRange ? parseInt(priceRange.split("-")[0]) : 0;
    const categoryList = searchParams?.get("categories")?.split("+") || [];
    const searchedQuery = searchParams?.get("searched") || "";
    setSortSelected(sorting);
    setMenSize(menSizes);
    setWomenSize(womenSizes);
    setPrice(priceMin);
    setCategories(categoryList);
    setSearched(searchedQuery);
  }, [searchParams]);

  const applyFilters = async () => {
    if (loading) return;

    const params = new URLSearchParams();
    if (sortSelected) params.set("sorting", sortSelected);
    if (menSize.length > 0) params.set("menSizes", menSize.join("+"));
    if (womenSize.length > 0) params.set("womenSizes", womenSize.join("+"));
    if (price > 0) params.set("prices", `${price}-2000`);
    if (categories.length > 0) params.set("categories", categories.join("+"));
    if (searched) params.set("searched", searched);

    const fullUrl = `/?${params.toString().toLowerCase()}`;
    router.push(fullUrl);
    await getProducts(fullUrl);
    setFiltersOpen(false);
  };

  const getProducts = async (url: string) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(url.split("?")[1]);
      const searchedText = query.get("searched");

      let apiEndpoint = "/api/products";
      let fetchOptions: RequestInit = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (searchedText) {
        apiEndpoint = "/api/searched";
        fetchOptions = {
          ...fetchOptions,
          method: "POST",
          body: JSON.stringify({ searched: searchedText }),
        };
        apiEndpoint += `?${query.toString()}`;
      } else {
        apiEndpoint += `?${query.toString()}`;
      }

      const response = await fetch(apiEndpoint, fetchOptions);
      if (!response.ok) {
        setErrorMessage(true);
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

  const getTotalCount = async () => {
    try {
      const response = await fetch("/api/products-count", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      const data = await response.json();
      if (data.data) {
        return setAllProducts(data.data);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const toProductDetails = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const fullUrl = `/?${searchParams?.toString()}`;
    getProducts(fullUrl);
    getTotalCount();
  }, []);

  const onSearch = async (searchedText: string) => {
    setLoadingFetch(true);
    setSearched(searchedText);
    try {
      const params = new URLSearchParams();
      if (sortSelected) params.set("sorting", sortSelected);
      if (menSize.length > 0) params.set("menSizes", menSize.join("+"));
      if (womenSize.length > 0) params.set("womenSizes", womenSize.join("+"));
      if (price > 0) params.set("prices", `${price}-2000`);
      if (categories.length > 0) params.set("categories", categories.join("+"));
      if (searchedText) params.set("searched", searchedText);

      const fullUrl = `/?${params.toString().toLowerCase()}`;

      router.push(fullUrl);

      await getProducts(fullUrl);
    } catch (error) {
      console.error(`Error: ${error}`);
    } finally {
      setLoadingFetch(false);
    }
  };

  const clearFilters = async () => {
    setSortSelected("Recommended");
    setMenSize([]);
    setWomenSize([]);
    setPrice(0);
    setCategories([]);
    setSearched("");

    router.push("/");

    await getProducts("/");
    setFiltersOpen(false);
  };

  return (
    <>
      <div>
        <Navbar
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          onSearch={onSearch}
        />
        <div className={filtersOpen ? "opacity-70" : "bg-white text-black"}>
          <div className="relative h-screen w-full overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center">
              <div className="absolute inset-0 bg-gray-50" />
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-black text-center px-4">
              {errorMessage && (
                <div className="p-3 rounded-md bg-red-100 border border-red-400 font-medium text-sm text-red-700 text-center mb-2">
                  Something went wrong on our side, please refresh the page!
                </div>
              )}
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
                  {products.length === 0
                    ? "No products matched your search criteria!"
                    : `Showing ${products.length} products out of ${
                        allProducts ? allProducts : "100"
                      }`}
                </div>
              </div>
            </div>
            {loading ? (
              [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              <div
                id="products"
                className="grid grid-cols-1 custom-grid-520 custom-grid-820 lg:grid-cols-4 gap-10 px-4"
              >
                {products.map((product, index) => {
                  return (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 1, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.03 }}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 p-4 flex flex-col justify-between min-w-[240px]"
                    >
                      <span className="text-xs bg-zinc-200 text-zinc-600 px-2 py-1 rounded-full w-max mb-3 font-medium">
                        {product.category.charAt(0).toUpperCase() +
                          product.category.slice(1).toLowerCase()}
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
                          {product.name.charAt(0).toUpperCase() +
                            product.name.slice(1).toLowerCase()}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {product.features[0] ||
                            product.features[1] ||
                            product.features[2] ||
                            "No features"}
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
          sortSelected={sortSelected}
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
          clearFilters={clearFilters}
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
      <LoadingFetch
        loading={loadingFetch}
        inputText={searched}
        text="Processing your request..."
      />
    </>
  );
}
