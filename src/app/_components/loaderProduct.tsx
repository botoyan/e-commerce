"use client";
import React from "react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="relative flex flex-col items-center gap-4">
        <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>

        <div className="text-center">
          <p className="text-lg font-semibold text-indigo-600 animate-pulse">
            Getting things ready...
          </p>
          <p className="text-sm text-gray-400">Please wait a moment</p>
        </div>
      </div>
    </div>
  );
}
