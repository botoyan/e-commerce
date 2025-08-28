"use client";
import React, { useState, useRef } from "react";
import Dropdown from "../_components/dropdown";
import FileUploader from "../_components/fileUploader";
import { useRouter } from "next/navigation";
import LoadingFetch from "../_components/loadingFetch";

const AddProductForm = () => {
  const router = useRouter();
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
    "12",
    "13",
  ];
  const categories = [
    "Basketball",
    "Football",
    "Golf",
    "Casual",
    "Gym & Running",
  ];

  const features = [
    "Perfect for fast breaks and sharp cuts.",
    "Ankle support: High-top design for maximum stability.",
    "Traction: Multi-directional grip for quick pivots.",
    "Impact Protection: Cushioned midsole absorbs hard landings.",
    "Breathability: Ventilated mesh upper keeps feet cool.",
    "Stud pattern engineered for explosive acceleration.",
    "Fit: Sock-like collar for a locked-in feel.",
    "Touch Control: Textured upper enhances ball handling.",
    "Lightweight build for increased agility.",
    "Best for: Firm ground, Artificial turf, Indoor courts.",
    "Water-resistant finish for all-weather play.",
    "Spikeless outsole provides stability without damaging greens.",
    "Cushioning: Responsive foam for all-day comfort.",
    "Style: Classic leather upper with modern contours.",
    "Best for: Driving range, 18-hole rounds, Casual club wear.",
    "Style-forward design blends with everyday outfits.",
    "Comfort: Memory foam insole for all-day wear.",
    "Material: Soft knit upper with stretch fit.",
    "Best for: Walking, Streetwear, Travel.",
    "Weight: Ultra-light, approx. 0.6 kg.",
    "Perfect for cardio, lifting, and high-intensity workouts.",
    "Drop: Low heel-to-toe drop for natural foot movement.",
    "Outsole: Grooved flex zones for improved mobility.",
    "Stability: Reinforced heel cup for better alignment.",
    "Durability: High-abrasion rubber in key wear zones.",
  ];
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedMenSizes, setSelectedMenSizes] = useState<string[]>([]);
  const [selectedWomenSizes, setSelectedWomenSizes] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleMenSize = (size: string) => {
    setSelectedMenSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };
  const toggleFeatures = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
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
  const [error, setError] = useState({
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

  const clearFilters = () => {
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
    setError({
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
  };

  const addProduct = async () => {
    if (
      product.name.length === 0 ||
      product.brand.length === 0 ||
      product.category.length === 0 ||
      product.price.length === 0 ||
      imageFile === null ||
      (selectedMenSizes.length === 0 && selectedWomenSizes.length === 0)
    ) {
      setErrorMessage("Please fill out all the information before submitting.");
      return clearFilters();
    }
    setLoading(true);
    const base64Image = await fileToBase64(imageFile);
    await fetch("/api/add-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: product.name.trim(),
        brand: product.brand.trim(),
        category: product.category.trim(),
        price: Number(product.price),
        imageURI: base64Image,
        menSizes: selectedMenSizes,
        womenSizes: selectedWomenSizes,
        features: selectedFeatures,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add product");
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        clearFilters();
        router.replace("/");
      })
      .catch((error) => {
        setErrorMessage(
          "Server is experiencing some errors, please try again."
        );
        clearFilters();
        console.error(`Error: ${error}`);
      });
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-2 md:px-4 py-12 md:py-20 lg:py-32">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Add Product
        </h2>
        {errorMessage && (
          <div className="p-3 rounded-md bg-red-100 border border-red-400 font-medium text-sm text-red-700 text-center mb-2">
            {errorMessage}
          </div>
        )}
        <form className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Product Name
            </label>
            <input
              autoComplete="off"
              autoCorrect="off"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
              placeholder="Enter product name"
              value={product.name}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, name: e.target.value }))
              }
              onBlur={() => {
                if (!product.name) {
                  setError((prev) => ({ ...prev, name: true }));
                }
              }}
            />
            <p
              className={`mt-1 text-sm text-red-600 ${
                error.name && !product.name ? "" : "hidden"
              }`}
            >
              Please fill out the product name.
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Brand</label>
            <input
              autoComplete="off"
              autoCorrect="off"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
              placeholder="e.g. Nike"
              value={product.brand}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, brand: e.target.value }))
              }
              onBlur={() => {
                if (!product.brand) {
                  setError((prev) => ({ ...prev, brand: true }));
                }
              }}
            />
            <p
              className={`mt-1 text-sm text-red-600 ${
                error.brand && !product.brand ? "" : "hidden"
              }`}
            >
              Please fill out the product brand.
            </p>
          </div>

          <div>
            <Dropdown
              selectText="Select category"
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
              autoComplete="off"
              autoCorrect="off"
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
              placeholder="Enter price"
              value={product.price}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, price: e.target.value }))
              }
              onBlur={() => {
                if (!product.price) {
                  setError((prev) => ({ ...prev, price: true }));
                }
              }}
            />
            <p
              className={`mt-1 text-sm text-red-600 ${
                error.price && !Number(product.price) ? "" : "hidden"
              }`}
            >
              Please fill out the product price.
            </p>
          </div>

          <div>
            <Dropdown
              selectText="Select sizes"
              label="Men's Sizes"
              options={menSizes}
              selectedOptions={selectedMenSizes}
              onToggleOption={toggleMenSize}
            />
          </div>

          <div>
            <Dropdown
              selectText="Select sizes"
              label="Women's Sizes"
              options={womenSizes}
              selectedOptions={selectedWomenSizes}
              onToggleOption={toggleWomenSize}
            />
          </div>

          <div className="col-span-2">
            <Dropdown
              selectText="Select features"
              label="Features"
              options={features}
              selectedOptions={selectedFeatures}
              onToggleOption={toggleFeatures}
            />
          </div>

          <FileUploader
            onFileSelect={(file) => setImageFile(file)}
            ref={fileInputRef}
          />
          <button
            type="button"
            onClick={addProduct}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-500 col-span-2 flex justify-center"
          >
            Add Product
          </button>
        </form>
      </div>
      <LoadingFetch
        loading={loading}
        text="Processing your request. You will be redirected to the main page shortly."
        inputText={product.name}
      />
    </div>
  );
};

export default AddProductForm;
