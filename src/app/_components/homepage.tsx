"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Navbar from "./navbar";
import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { motion } from "framer-motion";
import productImage1 from "../../../public/assets/images/lebron-prime-93-removebg-preview.png";
import productImage2 from "../../../public/assets/images/LEBRON+XX.png-removebg-preview.png";
import productImage3 from "../../../public/assets/images/JA+3.png-removebg-preview.png";
import productImage4 from "../../../public/assets/images/GIANNIS+FREAK+7.png-removebg-preview.png";
import productImage5 from "../../../public/assets/images/SABRINA+3.png-removebg-preview.png";
import productImage6 from "../../../public/assets/images/WMNS+JORDAN+HEIR+SERIES+AS.png-removebg-preview.png";
import productImage7 from "../../../public/assets/images/JORDAN+HEIR.png-removebg-preview.png";
import productImage8 from "../../../public/assets/images/JORDAN+LUKA+.77.png-removebg-preview.png";
import productImage9 from "../../../public/assets/images/ZM+LEBRON+NXXT+GEN+AMPD+DT.png-removebg-preview.png";
import productImage10 from "../../../public/assets/images/ZM+SUPERFLY+10+ELITE+FG.png-removebg-preview.png";
import productImage11 from "../../../public/assets/images/ZM+SUPERFLY+10+ACAD+KM+FG-MG.png-removebg-preview.png";
import productImage12 from "../../../public/assets/images/ZM+VAPOR+16+ELITE+FG.png-removebg-preview.png";
import productImage13 from "../../../public/assets/images/LEGEND+10+ACADEMY+TF.png-removebg-preview.png";
import productImage14 from "../../../public/assets/images/NIKE+REACTGATO.png-removebg-preview.png";
import productImage15 from "../../../public/assets/images/PHANTOM+6+HIGH+ACAD+FG-MG.png-removebg-preview.png";
import productImage16 from "../../../public/assets/images/PHANTOM+6+HIGH+PRO+FG.png-removebg-preview.png";
import productImage17 from "../../../public/assets/images/PHANTOM+6+LOW+ACAD+IC.png-removebg-preview.png";
import productImage18 from "../../../public/assets/images/WMNS+AIR+JORDAN+4+RETRO+OG+SP-removebg-preview.png";
import productImage19 from "../../../public/assets/images/NIKE++AIR+VAPORMAX+PLUS-removebg-preview.png";
import productImage20 from "../../../public/assets/images/NIKE+GATO+LV8-removebg-preview.png";
import productImage21 from "../../../public/assets/images/NIKE+SHOX+TL-removebg-preview.png";
import productImage22 from "../../../public/assets/images/NIKE+P-6000+SE-removebg-preview.png";
import productImage23 from "../../../public/assets/images/AIR+FORCE+1+'07-removebg-preview.png";
import productImage24 from "../../../public/assets/images/NIKE+DUNK+LOW+RETRO-removebg-preview.png";
import productImage25 from "../../../public/assets/images/AIR+MAX+90+PRM-removebg-preview.png";
import productImage26 from "../../../public/assets/images/NIKE+SHOX+R4-removebg-preview.png";
import productImage27 from "../../../public/assets/images/NIKE+CALM+MULE+-+REALTREE+NA-removebg-preview.png";
import productImage28 from "../../../public/assets/images/AIR+JORDAN+4+RETRO-removebg-preview.png";
import productImage29 from "../../../public/assets/images/NIKE+AIR+MAX+PLUS-removebg-preview.png";
import productImage30 from "../../../public/assets/images/AIR+MAX+UPTEMPO+'95-removebg-preview.png";
import productImage31 from "../../../public/assets/images/AIR+VAPORMAX+2023+FK-removebg-preview.png";
import productImage32 from "../../../public/assets/images/AIR+JORDAN+1+LOW+SE-removebg-preview.png";
import productImage33 from "../../../public/assets/images/JORDAN+SPIZIKE+LOW-removebg-preview.png";
import productImage34 from "../../../public/assets/images/total-90-white-and-gym-red-hq2851-100-release-date-removebg-preview.png";
import productImage35 from "../../../public/assets/images/JORDAN+MAX+AURA+7-removebg-preview.png";
import productImage36 from "../../../public/assets/images/AAF88-removebg-preview.png";
import productImage37 from "../../../public/assets/images/air-tech-challenge-2-tart-and-stone-blue-fz9033-101-release-date-removebg-preview.png";
import productImage38 from "../../../public/assets/images/AIR+DT+MAX+_96-removebg-preview.png";
import productImage39 from "../../../public/assets/images/AIR+JORDAN+1+LOW+EASYON.png-removebg-preview.png";
import productImage40 from "../../../public/assets/images/AIR+JORDAN+12+RETRO.png-removebg-preview.png";
import productImage41 from "../../../public/assets/images/AIR+MAX+SOLO+MICHIGAN+STATE.png-removebg-preview.png";
import productImage42 from "../../../public/assets/images/AIR+MONARCH+IV.png-removebg-preview.png";
import productImage43 from "../../../public/assets/images/JORDAN+FLTCLB+_91.png-removebg-preview.png";
import productImage44 from "../../../public/assets/images/JORDAN+MVP.png-removebg-preview.png";
import productImage45 from "../../../public/assets/images/JORDAN+MVP+92-removebg-preview.png";
import productImage46 from "../../../public/assets/images/JORDAN+TRUE+FLIGHT-removebg-preview.png";
import productImage47 from "../../../public/assets/images/nike-sb-dunk-low-pro-dark-team-red-and-olive-flak-hq1625-600-release-date.jpg-removebg-preview.png";
import productImage48 from "../../../public/assets/images/NIKE+AIR+MAX+1+PREM.png-removebg-preview.png";
import productImage49 from "../../../public/assets/images/NIKE+AIR+MAX+PLUS+OG-removebg-preview.png";
import productImage50 from "../../../public/assets/images/NIKE+AIR+ZOOM+UPTURN+SC.png-removebg-preview.png";
import productImage51 from "../../../public/assets/images/NIKE+DUNK+LOW+NN+N7.png-removebg-preview.png";
import productImage52 from "../../../public/assets/images/NIKE+ZOOM+KD+IV-removebg-preview.png";
import productImage53 from "../../../public/assets/images/WMNS+AIR+JORDAN+1+MID+SE-removebg-preview.png";

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
    productImage13,
    productImage14,
    productImage15,
    productImage16,
    productImage17,
    productImage18,
    productImage19,
    productImage20,
    productImage21,
    productImage22,
    productImage23,
    productImage24,
    productImage25,
    productImage26,
    productImage27,
    productImage28,
    productImage29,
    productImage30,
    productImage31,
    productImage32,
    productImage33,
    productImage34,
    productImage35,
    productImage36,
    productImage37,
    productImage38,
    productImage39,
    productImage40,
    productImage41,
    productImage42,
    productImage43,
    productImage44,
    productImage45,
    productImage46,
    productImage47,
    productImage48,
    productImage49,
    productImage50,
    productImage51,
    productImage52,
    productImage53,
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
                className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-all hover:cursor-pointer duration-500 hover:-translate-y-1"
              >
                Shop Now
              </motion.button>
            </div>
          </div>

          <section className="py-16 px-8 bg-gray-50">
            <div className="mx-4 flex justify-between text-gray-800 mb-4">
              <button
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-indigo-700 hover:cursor-pointer hover:-translate-y-0.5 active:scale-95 transition-transform duration-500"
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
            <div className="grid grid-cols-1 custom-grid-520 custom-grid-820 lg:grid-cols-4 gap-10 px-4">
              {Array.from({ length: 60 }).map((_, idx) => {
                const categories = [
                  "Basketball",
                  "Football",
                  "Lifestyle",
                  "Running",
                ];
                const taglines = [
                  "High-performance shoes built for agility and comfort.",
                  "Designed for precision and speed on the court.",
                  "Engineered for elite-level footwork.",
                  "Sleek design meets responsive traction.",
                  "Dominate the pitch with explosive agility.",
                  "Everyday comfort with athletic edge.",
                  "Lightweight runners with bounce in every step.",
                  "Elite grip for game-changing moments.",
                  "Train harder, move faster, play better.",
                  "Iconic style with breathable materials.",
                  "Game-ready build with pro-level cushioning.",
                  "For ballers who never slow down.",
                  "Where lifestyle and sport collide.",
                  "Built for sprints, cuts, and sharp turns.",
                  "Cushioned support that lasts all day.",
                  "Style that performs beyond the court.",
                  "Minimalist look. Maximum output.",
                  "Get that street-ready, gym-capable feel.",
                  "Versatile kicks for sport and street.",
                  "Power your pace with performance mesh.",
                ];
                const category = categories[idx % categories.length];
                const tagline = taglines[idx % taglines.length];

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 1, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.03 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 p-4 flex flex-col justify-between min-w-[240px]"
                  >
                    <span className="text-xs bg-zinc-200 text-zinc-600 px-2 py-1 rounded-full w-max mb-3 font-medium">
                      {category}
                    </span>

                    <Image
                      src={images[idx % images.length]}
                      alt={`Product ${idx + 1}`}
                      width={295}
                      height={295}
                      className="rounded-xl object-cover aspect-square w-full mb-4"
                    />

                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        Nike Basketball Shoes
                      </h3>
                      <p className="text-sm text-slate-600">{tagline}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-semibold text-indigo-600">
                        $120
                      </div>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 hover:cursor-pointer hover:-translate-y-1 transition-all duration-500">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                );
              })}
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
  );
}

//TODO need to change this just to homepage component for the products, and to get products from MongoDB
