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
  setBrands: React.Dispatch<React.SetStateAction<string[]>>;
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
  setBrands,
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
                        ? "px-2.5 py-1 border border-gray-300 rounded hover:bg-gray-300 bg-gray-800 text-white"
                        : "px-2.5 py-1 border border-gray-300 rounded hover:bg-gray-100"
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
                        : "px-2.5 py-1 border border-gray-300 rounded hover:bg-gray-100"
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
            <div className="flex justify-between text-sm text-gray-600">
              <span>{price}</span>
              <span>$2000</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Brands</h3>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            {[
              "Nike",
              "Adidas",
              "Puma",
              "New Balance",
              "Converse",
              "Reebok",
            ].map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="accent-black"
                  onChange={() => {
                    setBrands((prev) => {
                      if ([...prev].includes(brand)) {
                        return [...prev].filter((item) => {
                          return item !== brand;
                        });
                      } else {
                        return [...prev, brand];
                      }
                    });
                  }}
                />
                <span>{brand}</span>
              </label>
            ))}
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
              "Running",
              "Casual",
              "Training & Gym",
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
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-400 hover:cursor-pointer transition delay-100 duration-300 ease-in-out"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
        <button className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-300 hover:cursor-pointer transition delay-100 duration-300 ease-in-out">
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
