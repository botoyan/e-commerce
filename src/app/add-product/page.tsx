"use client";
import React, { useEffect, useState, useRef } from "react";

const AddProductForm = () => {
  const menDropdown = useRef<HTMLDivElement>(null);
  const womenDropdown = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryDropdown = useRef<HTMLDivElement>(null);

  const menSizes: string[] = [
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
  const womenSizes: string[] = [
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
  ];
  const categories = [
    "Basketball",
    "Football",
    "Golf",
    "Lifestyle",
    "Running",
    "Casual",
    "Training & Gym",
  ];
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedMenSizes, setSelectedMenSizes] = useState<string[]>([]);
  const [menDropdownOpen, setMenDropdownOpen] = useState<boolean>(false);
  const [selectedWomenSizes, setSelectedWomenSizes] = useState<string[]>([]);
  const [womenDropdownOpen, setWomenDropdownOpen] = useState<boolean>(false);

  const toggleMenSize = (size: string) => {
    setSelectedMenSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };
  const toggleWomenSize = (size: string) => {
    setSelectedWomenSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    size: "",
  });
  const [errorMessage, setErrorMessage] = useState({
    name: false,
    brand: false,
    category: false,
    price: false,
    size: false,
    image: false,
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menDropdownOpen &&
        menDropdown.current &&
        !menDropdown.current.contains(event.target as Node)
      ) {
        setMenDropdownOpen(false);
      }
      if (
        womenDropdownOpen &&
        womenDropdown.current &&
        !womenDropdown.current.contains(event.target as Node)
      ) {
        setWomenDropdownOpen(false);
      }
      if (
        categoryDropdown &&
        categoryDropdown.current &&
        !categoryDropdown.current.contains(event.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menDropdownOpen, womenDropdownOpen]);

  const clearFilters = (message: string) => {
    setTimeout(() => {
      setProduct({
        name: "",
        brand: "",
        category: "",
        price: "",
        size: "",
      });
      setSelectedMenSizes([]);
      setSelectedWomenSizes([]);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setErrorMessage({
        name: false,
        brand: false,
        category: false,
        price: false,
        size: false,
        image: false,
      });
    }, 50);
    alert(message);
  };

  const addProduct = async () => {
    if (
      product.name.length > 0 &&
      product.brand.length > 0 &&
      product.category.length > 0 &&
      product.price.length > 0 &&
      imageFile !== null &&
      (selectedMenSizes.length > 0 || selectedWomenSizes.length > 0)
    ) {
      const base64Image = await fileToBase64(imageFile);
      await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: Number(product.price),
          imageURI: base64Image,
          menSizes: selectedMenSizes,
          womenSizes: selectedWomenSizes,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to add product!");
          }
          return res.json();
        })
        .then((data) => {
          clearFilters("Product was added successfully!");
          console.log(`Product added: ${data._id}`);
        })
        .catch((error) => {
          clearFilters("Server Error");
          console.error(`Error: ${error}`);
        });
    } else {
      clearFilters("Please fill out all the forms before submitting!");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-2 md:px-4 py-12 md:py-20 lg:py-32">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Add Product
        </h2>
        <form className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Product Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300"
              placeholder="Enter product name"
              value={product.name}
              onChange={(e) => {
                setProduct((prev) => {
                  return { ...prev, name: e.target.value };
                });
              }}
              onBlur={() => {
                if (!product.name) {
                  return setErrorMessage((prev) => {
                    return { ...prev, name: true };
                  });
                }
              }}
            />
            <p
              className={
                errorMessage.name && !product.name
                  ? "mt-1 text-sm text-red-600"
                  : "hidden mt-1 text-sm text-red-600"
              }
            >
              Please fill out the product name.
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Brand</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300"
              placeholder="e.g. Nike"
              value={product.brand}
              onChange={(e) => {
                setProduct((prev) => {
                  return { ...prev, brand: e.target.value };
                });
              }}
              onBlur={() => {
                if (!product.brand) {
                  return setErrorMessage((prev) => {
                    return { ...prev, brand: true };
                  });
                }
              }}
            />
            <p
              className={
                errorMessage.brand && !product.brand
                  ? "mt-1 text-sm text-red-600"
                  : "hidden mt-1 text-sm text-red-600"
              }
            >
              Please fill out the product brand.
            </p>
          </div>

          <div ref={categoryDropdown} className="w-full relative">
            <label className="block text-sm text-gray-600 mb-1">Category</label>

            <button
              type="button"
              onClick={() => setCategoryDropdownOpen((prev) => !prev)}
              className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 text-left text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {product.category || "Select category"}
              <span className="float-right">
                <svg
                  className={`w-5 h-5 inline-block transition-transform ${
                    categoryDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>

            {categoryDropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 shadow-md rounded-md max-h-40 overflow-y-auto text-sm text-gray-700">
                {categories.map((cat) => (
                  <li
                    key={cat}
                    onClick={() => {
                      setProduct((prev) => ({ ...prev, category: cat }));
                      setCategoryDropdownOpen(false);
                    }}
                    className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                      product.category === cat ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Price</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300"
              placeholder="Enter price"
              value={product.price}
              onChange={(e) => {
                setProduct((prev) => {
                  return { ...prev, price: e.target.value };
                });
              }}
              onBlur={() => {
                if (!product.price) {
                  return setErrorMessage((prev) => {
                    return { ...prev, price: true };
                  });
                }
              }}
            />
            <p
              className={
                errorMessage.price && !Number(product.price)
                  ? "mt-1 text-sm text-red-600"
                  : "hidden mt-1 text-sm text-red-600"
              }
            >
              Please fill out the product price.
            </p>
          </div>
          <div ref={menDropdown} className="w-full relative">
            <label className="block text-sm text-gray-600 mb-1">
              Men&apos;s Sizes
            </label>

            <div className="flex flex-wrap gap-2 mb-2">
              {selectedMenSizes.map((size) => (
                <span
                  key={size}
                  className="flex items-center gap-1 bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded-full"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => toggleMenSize(size)}
                    className="text-gray-500 hover:text-red-500 text-xs"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMenDropdownOpen((prev) => !prev)}
              className="w-full bg-white border border-gray-300 rounded-md shadow-2xs px-3 py-2 text-left text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Select sizes
              <span className="float-right">
                <svg
                  className={`w-5 h-5 inline-block transition-transform ${
                    menDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>

            {menDropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 shadow-sm rounded-md max-h-40 overflow-y-auto text-sm text-gray-700">
                {menSizes.map((size) => (
                  <li
                    key={size}
                    onClick={() => toggleMenSize(size)}
                    className={`cursor-pointer select-none px-4 py-2 hover:bg-gray-100 ${
                      selectedMenSizes.includes(size)
                        ? "bg-gray-100 font-medium"
                        : ""
                    }`}
                  >
                    {size}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div ref={womenDropdown} className="w-full relative">
            <label className="block text-sm text-gray-600 mb-1">
              Women&apos;s Sizes
            </label>

            <div className="flex flex-wrap gap-2 mb-2">
              {selectedWomenSizes.map((size) => (
                <span
                  key={size}
                  className="flex items-center gap-1 bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded-full"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => toggleWomenSize(size)}
                    className="text-gray-500 hover:text-red-500 text-xs"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setWomenDropdownOpen((prev) => !prev)}
              className="w-full bg-white border border-gray-300 rounded-md shadow-2xs px-3 py-2 text-left text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Select sizes
              <span className="float-right">
                <svg
                  className={`w-5 h-5 inline-block transition-transform ${
                    womenDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>

            {womenDropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 shadow-sm rounded-md max-h-40 overflow-y-auto text-sm text-gray-700">
                {womenSizes.map((size) => (
                  <li
                    key={size}
                    onClick={() => toggleWomenSize(size)}
                    className={`cursor-pointer select-none px-4 py-2 hover:bg-gray-100 ${
                      selectedWomenSizes.includes(size)
                        ? "bg-gray-100 font-medium"
                        : ""
                    }`}
                  >
                    {size}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-gray-600 mb-2">
              Use square image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-50 file:text-gray-700 transition duration-300 hover:file:bg-gray-100"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                }
              }}
            />
          </div>
          <button
            type="button"
            className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-500 text-white rounded-md transition duration-300 hover:cursor-pointer col-span-2 flex justify-center"
            onClick={addProduct}
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
