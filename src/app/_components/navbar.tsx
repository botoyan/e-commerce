"use client";
import React, { useRef } from "react";
import Image from "next/image";
import sneakersIcon from "../../../public/assets/images/icon.png";
import { useSearchParams } from "next/navigation";
import { FiShoppingCart } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

type NavbarProps = {
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: string;
  onSearch: (string: string) => void;
};

function Navbar({ openMenu, setOpenMenu, cartItems, onSearch }: NavbarProps) {
  const data = useSession();
  const input = useRef<HTMLInputElement | null>(null);
  const searchParams = useSearchParams();
  const searched = searchParams?.get("searched") || "Search...";
  return (
    <nav className="sticky bg-indigo-600 border-b-1 border-b-white">
      <div className="mx-auto max-w-10xl px-2 sm:px-6 lg:px-7">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-indigo-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setOpenMenu((prev) => !prev)}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg
                className={openMenu ? "hidden" : "block size-6"}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <svg
                className={openMenu ? "block size-6" : "hidden"}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-start sm:items-stretch sm:justify-start">
            <div className="hidden md:ml-6 md:block">
              <div className="flex space-x-5 items-center min-[780px]:space-x-6 min-[900px]:space-x-7">
                <Image
                  src={sneakersIcon}
                  width={60}
                  alt="sneakers-icon"
                  style={{ height: "auto" }}
                />
                <Link
                  href="#"
                  className="rounded-md px-3 py-2 text-sm font-medium text-[#FAF9F6] hover:bg-indigo-700 hover:opacity-90 transition delay-150 duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-110 "
                >
                  Shop
                </Link>
                <Link
                  href="#"
                  className="rounded-md pr-3 pl-3 py-2 text-sm font-medium text-[#FAF9F6] hover:bg-indigo-700 hover:opacity-90 transition delay-150 duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-110"
                >
                  Account
                </Link>
                {data.status === "authenticated" ? (
                  <Link
                    href="#"
                    onClick={() => signOut()}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-[#FAF9F6] hover:bg-indigo-700 hover:opacity-90 transition delay-150 duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-110"
                  >
                    Sign Out
                  </Link>
                ) : (
                  <Link
                    href="/sign-in"
                    className="block rounded-md px-3 py-2 text-sm font-medium text-[#FAF9F6] hover:bg-indigo-700 hover:opacity-90 transition delay-150 duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-110"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="lg:mr-25 md:mr-20 mr-5 flex justify-center gap-x-2 gap-y-0.5">
            <div className="flex items-center rounded-full bg-indigo-600 pl-3 focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-1 focus-within:ring-offset-indigo-600 transition duration-300 ease-in-out">
              <input
                autoComplete="off"
                autoCorrect="off"
                type="text"
                name="search"
                className="block px-3.5 py-2 text-white sm:text-sm/6 w-50 rounded-3xl outline-none placeholder:text-white focus:text-gray-200 translate-x-4.5 focus:translate-x-0 transition duration-300 ease-in-out lg:w-100"
                placeholder={searched}
                ref={input}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    return onSearch(e.currentTarget.value);
                  }
                }}
              />
            </div>

            <FaSearch
              color="white"
              size={25}
              className="mt-1.5  hover:scale-115 transition delay-150 duration-600 ease-in-out"
              onClick={() => {
                if (input.current) {
                  onSearch(input.current?.value);
                }
              }}
            />
            <div className="relative hover:scale-115 transition delay-150 duration-600 ease-in-out">
              <Link href="/cart">
                <FiShoppingCart
                  color="white"
                  size={25}
                  className="ml-1.5 mt-1.5"
                />
              </Link>
              <div className="absolute top-[-1px] left-[28px] text-white text-sm">
                {cartItems}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={openMenu ? "md:hidden" : "hidden"} id="mobile-menu">
        <div className="space-y-1 px-2 pt-2 pb-3">
          <Link
            href="#"
            className="block rounded-md pr-3 pl-3 py-2 text-sm font-medium text-[#FAF9F6] hover:bg-indigo-700 hover:opacity-90 transition delay-150 duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-101"
            aria-current="page"
          >
            Shop
          </Link>
          <Link
            href="#"
            className="my-3 block rounded-md pr-3 pl-3 py-2 text-sm font-medium text-[#FAF9F6] hover:bg-indigo-700 hover:opacity-90 transition delay-150 duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-101 "
          >
            Account
          </Link>
          {data.status === "authenticated" ? (
            <Link
              href="#"
              onClick={() => signOut()}
              className="block rounded-md px-3 py-2 text-sm font-medium text-[#FAF9F6] hover:bg-indigo-700 hover:opacity-90 transition delay-150 duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-101"
            >
              Sign Out
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="block rounded-md px-3 py-2 text-sm font-medium text-[#FAF9F6] hover:bg-indigo-700 hover:opacity-90 transition delay-150 duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-101"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
