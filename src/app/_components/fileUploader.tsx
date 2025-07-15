"use-client";
import React, { forwardRef } from "react";

type FileUploaderProps = {
  onFileSelect: (file: File | null) => void;
};

const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(
  ({ onFileSelect }, ref) => {
    return (
      <div className="col-span-2">
        <label className="block text-sm text-gray-600 mb-2">
          Use square image
        </label>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-50 file:text-gray-700 transition duration-300 hover:file:bg-gray-100"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            onFileSelect(file);
          }}
        />
      </div>
    );
  }
);

FileUploader.displayName = "FileUploader"; // for dev tools

export default FileUploader;
