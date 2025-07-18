import React from "react";

type loadingFetchTypes = {
  loading: boolean;
  text: string;
  inputText: string;
};

function LoadingFetch({ loading, text, inputText }: loadingFetchTypes) {
  return (
    <div>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full space-y-6">
            <h2 className="text-2xl font-semibold mb-2 text-blue-700">
              In process
            </h2>
            <input
              type="text"
              value={inputText}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 cursor-not-allowed"
              aria-label="Email"
            />
            <p className="text-gray-600">{text}</p>
            <div className="flex justify-center">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoadingFetch;
