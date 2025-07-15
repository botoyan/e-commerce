"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Navbar from "./navbar";
import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { motion } from "framer-motion";
import productImage1 from "../../../public/assets/images/nike-pg-6.jpg";
import productImage2 from "../../../public/assets/images/nike-football.jpg";
import productImage3 from "../../../public/assets/images/nike-hypervenom.jpg";
import productImage4 from "../../../public/assets/images/nike-mercurial-cr7.jpg";
import productImage5 from "../../../public/assets/images/messi-f50.jpg";
import productImage6 from "../../../public/assets/images/nike-kyrie-3.jpg";
import productImage7 from "../../../public/assets/images/nike-ronaldinho.jpg";
import productImage8 from "../../../public/assets/images/nike-kobe.jpg";
import productImage9 from "../../../public/assets/images/puma-football.jpg";
import productImage10 from "../../../public/assets/images/adidas-predator.jpg";
import productImage11 from "../../../public/assets/images/nike-kd-16.jpg";
import productImage12 from "../../../public/assets/images/nike-hypervenom-phelon.jpg";
import "../globals.css";
import Sidebar from "./sidebar";
export default function HomePage() {
  const router = useRouter();
  const filteredSidebarRef = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [menSize, setMenSize] = useState<number[]>([]);
  const [womenSize, setWomenSize] = useState<number[]>([]);
  const [sortSelected, setSortSelected] = useState<string>("Recommended");
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

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
    if (brands.length > 0) params.set("brands", brands.join("+"));
    if (categories.length > 0) params.set("tags", categories.join("+"));

    const fullUrl = `/filteringOptions?${params.toString().toLowerCase()}`;

    router.push(fullUrl);
  };

  const images = [
    productImage1,
    productImage2,
    productImage3,
    productImage4,
    productImage5,
    productImage6,
    productImage7,
    productImage8,
    productImage9,
    productImage10,
    productImage11,
    productImage12,
  ];

  return (
    <SessionProvider>
      <div>
        <Navbar openMenu={openMenu} setOpenMenu={setOpenMenu} />
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
                className="text-5xl font-bold mb-4"
              >
                Step Into Style
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-lg mb-6"
              >
                Nike. Adidas. Puma. Your Choice, Your Style.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition hover:cursor-pointer"
              >
                Shop Now
              </motion.button>
            </div>
          </div>

          <section className="py-16 px-8 bg-gray-50">
            <h2 id="featured" className="text-3xl font-bold text-center mb-12">
              Featured Products
            </h2>
            <div className="mx-4 flex justify-between text-gray-800 mb-2">
              <button
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-gray-900 hover:cursor-pointer hover:-translate-y-0.5 active:scale-95 transition-transform duration-300"
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
                  Showing 24 products out of 120
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {Array.from({ length: 24 }).map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 1, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition"
                >
                  <Image
                    src={images[idx % images.length]}
                    alt="Product"
                    className="rounded-xl mb-4 w-full object-cover"
                    style={{ height: "295px", width: "100%" }}
                  />
                  <h3 className="text-xl font-semibold hover:cursor-pointer">
                    Brand Shoe #{idx + 1}
                  </h3>
                  <p className="text-gray-600">$99.99</p>
                  <button className="mt-4 w-full bg-black text-white py-2 rounded-xl transition hover:cursor-pointer">
                    View Details
                  </button>
                </motion.div>
              ))}
            </div>
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
          setBrands={setBrands}
          applyFilters={applyFilters}
          filteredSidebarRef={filteredSidebarRef}
        />
      </div>
    </SessionProvider>
  );
}

//TODO need to change this just to homepage component for the products, and to get products from MongoDB
