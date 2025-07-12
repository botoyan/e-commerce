"use client";
import React, { useState, useRef } from "react";
import Dropdown from "../_components/dropdown";
import FileUploader from "../_components/fileUploader";

const AddProductForm = () => {
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedMenSizes, setSelectedMenSizes] = useState<string[]>([]);
  const [selectedWomenSizes, setSelectedWomenSizes] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setErrorMessage({
        name: false,
        brand: false,
        category: false,
        price: false,
        size: false,
        image: false,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
      await fetch("/api/add-product", {
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
          clearFilters("Product added successfully!");
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
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, name: e.target.value }))
              }
              onBlur={() => {
                if (!product.name) {
                  setErrorMessage((prev) => ({ ...prev, name: true }));
                }
              }}
            />
            <p
              className={`mt-1 text-sm text-red-600 ${
                errorMessage.name && !product.name ? "" : "hidden"
              }`}
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
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, brand: e.target.value }))
              }
              onBlur={() => {
                if (!product.brand) {
                  setErrorMessage((prev) => ({ ...prev, brand: true }));
                }
              }}
            />
            <p
              className={`mt-1 text-sm text-red-600 ${
                errorMessage.brand && !product.brand ? "" : "hidden"
              }`}
            >
              Please fill out the product brand.
            </p>
          </div>

          <div>
            <Dropdown
              label="Category"
              options={categories}
              selectedOptions={[]}
              multiSelect={false}
              singleSelectValue={product.category}
              onSelectSingle={(value) =>
                setProduct((prev) => ({ ...prev, category: value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Price</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300"
              placeholder="Enter price"
              value={product.price}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, price: e.target.value }))
              }
              onBlur={() => {
                if (!product.price) {
                  setErrorMessage((prev) => ({ ...prev, price: true }));
                }
              }}
            />
            <p
              className={`mt-1 text-sm text-red-600 ${
                errorMessage.price && !Number(product.price) ? "" : "hidden"
              }`}
            >
              Please fill out the product price.
            </p>
          </div>

          <div>
            <Dropdown
              label="Men's Sizes"
              options={menSizes}
              selectedOptions={selectedMenSizes}
              onToggleOption={toggleMenSize}
            />
          </div>

          <div>
            <Dropdown
              label="Women's Sizes"
              options={womenSizes}
              selectedOptions={selectedWomenSizes}
              onToggleOption={toggleWomenSize}
            />
          </div>

          <FileUploader
            onFileSelect={(file) => setImageFile(file)}
            ref={fileInputRef}
          />
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
