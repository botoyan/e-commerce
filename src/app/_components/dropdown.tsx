"use client";
import React, { useState, useRef, useEffect } from "react";

type dropdownProps = {
  label: string;
  options: string[];
  selectedOptions: string[];
  onToggleOption?: (option: string) => void;
  multiSelect?: boolean;
  singleSelectValue?: string;
  onSelectSingle?: (option: string) => void;
  selectText: string;
};

const Dropdown: React.FC<dropdownProps> = ({
  label,
  options,
  selectedOptions,
  onToggleOption,
  multiSelect = true,
  singleSelectValue,
  onSelectSingle,
  selectText,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div ref={dropdownRef} className="relative w-full">
      <label className="block text-sm text-gray-600 mb-1">{label}</label>

      {multiSelect ? (
        <>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedOptions.map((opt) => (
              <span
                key={opt}
                className="flex items-center gap-1 bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded-full"
              >
                {opt}
                <button
                  type="button"
                  onClick={() => onToggleOption?.(opt)}
                  className="text-gray-500 hover:text-red-500 text-xs"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 text-left text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {selectText}
            <span className="float-right">
              <svg
                className={`w-5 h-5 inline-block transition-transform ${
                  open ? "rotate-180" : ""
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
          {open && (
            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 shadow-sm rounded-md max-h-40 overflow-y-auto text-sm text-gray-700">
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => onToggleOption?.(option)}
                  className={`cursor-pointer select-none px-4 py-2 hover:bg-gray-100 ${
                    selectedOptions.includes(option)
                      ? "bg-gray-100 font-medium"
                      : ""
                  }`}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 text-left text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            {singleSelectValue || `Select ${label.toLowerCase()}`}
            <span className="float-right">
              <svg
                className={`w-5 h-5 inline-block transition-transform ${
                  open ? "rotate-180" : ""
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
          {open && (
            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 shadow-md rounded-md max-h-40 overflow-y-auto text-sm text-gray-700">
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => {
                    if (onSelectSingle) onSelectSingle(option);
                    setOpen(false);
                  }}
                  className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                    singleSelectValue === option
                      ? "bg-gray-100 font-medium"
                      : ""
                  }`}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default Dropdown;
