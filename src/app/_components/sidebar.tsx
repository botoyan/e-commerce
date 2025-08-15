"use-client";
import React from "react";

type Sidebar = {
  filtersOpen: boolean;
  setSortSelected: React.Dispatch<React.SetStateAction<string>>;
  menSize: number[];
  setMenSize: React.Dispatch<React.SetStateAction<number[]>>;
  womenSize: number[];
  setWomenSize: React.Dispatch<React.SetStateAction<number[]>>;
  price: number;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  applyFilters: () => void;
  filteredSidebarRef: React.RefObject<HTMLDivElement | null>;
};

function Sidebar({
  filtersOpen,
  setSortSelected,
  menSize,
  setMenSize,
  womenSize,
  setWomenSize,
  price,
  setPrice,
  categories,
  setCategories,
  applyFilters,
  filteredSidebarRef,
}: Sidebar) {
  return (
    <div
      ref={filteredSidebarRef}
      className={
        filtersOpen
          ? "fixed top-0 left-0 h-full w-80 bg-white shadow-lg border-r border-gray-200 p-6 overflow-y-auto"
          : "hidden"
      }
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>

      <div className="space-y-10 text-sm text-gray-700 mb-5">
        <div className="w-64">
          <label
            htmlFor="sort"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Sort by
          </label>
          <select
            id="sort"
            className="w-full appearance-none bg-gray-100 border border-gray-300 text-gray-800 text-sm rounded-lg px-4 py-2.5 pr-8 shadow-sm
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400
          cursor-pointer"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              return setSortSelected(e.currentTarget.value);
            }}
          >
            <option>Recommended</option>
            <option>Price: low to high</option>
            <option>Best Discount</option>
            <option>Price: high to low</option>
          </select>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Size</h3>
          <div className="space-y-5 max-h-48 overflow-y-auto pr-1">
            <div>
              <h4 className="font-medium mb-2">US Men&apos;s </h4>
              <div className="flex flex-wrap gap-2">
                {[
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
                ].map((size) => (
                  <button
                    key={`us-men-${size}`}
                    className={
                      menSize.includes(Number(size))
                        ? "px-2.5 py-1 border border-gray-300 rounded hover:bg-gray-500 bg-gray-800 text-white"
                        : "px-2.5 py-1 border border-gray-300 rounded hover:bg-gray-300"
                    }
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
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">US Women&apos;s</h4>
              <div className="flex flex-wrap gap-2">
                {[
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
                  "11.5",
                  "12",
                  "13",
                ].map((size) => (
                  <button
                    key={`us-women-${size}`}
                    className={
                      womenSize.includes(Number(size))
                        ? "px-2.5 py-1 border border-gray-300 rounded hover:bg-gray-500 bg-gray-800 text-white"
                        : "px-2.5 py-1 border border-gray-300 rounded hover:bg-gray-300"
                    }
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
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Price Range</h3>
          <div className="flex flex-col gap-3">
            <input
              type="range"
              min="0"
              max="2000"
              step="5"
              onChange={(e) => setPrice(Number(e.target.value))}
              value={price}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-sm text-gray-700 font-semibold">
              <span>{price}</span>
              <span>$2000</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Basketball",
              "Football",
              "Golf",
              "Lifestyle",
              "Gym & Running",
            ].map((tag) => (
              <span
                key={tag}
                className={
                  categories.includes(tag)
                    ? "px-3 py-1 bg-gray-800 rounded-full text-gray-200 hover:bg-gray-500 cursor-pointer"
                    : "px-3 py-1 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300 cursor-pointer"
                }
                onClick={() => {
                  setCategories((prev) => {
                    if ([...prev].includes(tag)) {
                      return [...prev].filter((item) => {
                        return item !== tag;
                      });
                    } else {
                      return [...prev, tag];
                    }
                  });
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-2">
        <button
          onClick={applyFilters}
          className="relative flex items-center justify-center gap-2 w-full bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-95 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0014 13v4.586a1 1 0 01-.293.707l-2 2A1 1 0 0110 20v-7a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          Apply Filters
          <span className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md overflow-hidden">
            3
          </span>
        </button>

        <button className="flex items-center justify-center w-full gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium border border-gray-300 shadow-sm hover:bg-gray-200 hover:text-black transition-all duration-300 ease-in-out">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
