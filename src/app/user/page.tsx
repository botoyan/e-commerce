"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../_components/navbar";
import { AiOutlineClockCircle } from "react-icons/ai";
import Loader from "../_components/loaderProduct";

type User = {
  username: string;
  email: string;
};

type Order = {
  _id: string;
  date: string;
  total: number;
  status: string;
  products: object[];
};

export default function UserPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [tempUsername, setTempUsername] = useState("");
  const [tempEmail, setTempEmail] = useState("");

  const handleSave = () => {
    if (user) {
      setUser(() => {
        return { email: tempEmail, username: tempUsername };
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setTempUsername(user?.username);
      setTempEmail(user?.email);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (user) {
      setTempUsername(user.username);
      setTempEmail(user.email);
    }
  }, [user]);

  const onSearch = (searchedText: string) => {
    const params = new URLSearchParams();
    if (searchedText) params.set("searched", searchedText);
    router.push(`/?${params.toString().toLowerCase()}`);
  };

  const getUserInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.data) {
        setUser(data.data.user);
        setOrders(data.data.orders);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString)
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      .replace(",", "");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        onSearch={onSearch}
      />

      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6">
          Your Account
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Profile Info</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 font-medium hover:underline"
              >
                Edit
              </button>
            ) : null}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  isEditing
                    ? "border-gray-300 bg-white"
                    : "border-transparent bg-gray-100"
                } rounded-md shadow-sm text-gray-700`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                disabled={!isEditing}
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  isEditing
                    ? "border-gray-300 bg-white"
                    : "border-transparent bg-gray-100"
                } rounded-md shadow-sm text-gray-700`}
              />
            </div>
            {isEditing && (
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-full bg-indigo-600 text-white font-medium shadow-md transition-all duration-300 ease-out hover:bg-indigo-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 rounded-full bg-gray-200 text-gray-800 font-medium shadow-sm transition-all duration-300 ease-out hover:bg-gray-300 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          <div className="max-h-64 overflow-y-auto space-y-4 pr-2">
            {orders?.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <AiOutlineClockCircle size={40} className="text-yellow-500" />
                  <div>
                    <p className="font-medium hover:underline">
                      Order #{item._id}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(item.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-indigo-600">${item.total}</p>
                  <p className="text-sm text-gray-700">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
