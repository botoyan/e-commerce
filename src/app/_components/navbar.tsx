"use client";
import React from "react";
import Image from "next/image";
import sneakersIcon from "../../../public/assets/images/icon.jpeg";
import { FiShoppingCart } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";

type NavbarProps = {
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

function Navbar({ openMenu, setOpenMenu }: NavbarProps) {
  const data = useSession();
  return (
    <nav className="bg-black border-b-1 border-b-white">
      <div className="mx-auto max-w-10xl px-2 sm:px-6 lg:px-7">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset hover:cursor-pointer"
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
                <a
                  href="#"
                  className="rounded-md px-3 py-2 text-sm font-medium text-[#FAF9F6] hover:text-[#111111] hover:bg-[#FAF9F6] hover:opacity-90 transition delay-150 duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-110 "
                >
                  Shop
                </a>
                <a
                  href="#"
                  className="rounded-md pr-3 pl-3 py-2 text-sm font-medium text-[#FAF9F6] hover:text-[#111111] hover:bg-[#FAF9F6] hover:opacity-90 transition delay-150 duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-110"
                >
                  New
                </a>
                {data.status === "authenticated" ? (
                  <a
                    href="#"
                    onClick={() => signOut()}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-[#FAF9F6] hover:text-[#111111] hover:bg-[#FAF9F6] hover:opacity-90 transition delay-150 duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-110"
                  >
                    Sign Out
                  </a>
                ) : (
                  <a
                    href="/sign-in"
                    className="block rounded-md px-3 py-2 text-sm font-medium text-[#FAF9F6] hover:text-[#111111] hover:bg-[#FAF9F6] hover:opacity-90 transition delay-150 duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-110"
                  >
                    Sign In
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="lg:mr-25 md:mr-20 mr-5 flex justify-center gap-x-2 gap-y-0.5">
            <div className="flex items-center rounded-full bg-black pl-3 outline-1 -outline-offset-1 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-gray-300 transition delay-150 duration-300 ease-in-out">
              <input
                type="text"
                name="search"
                className="block px-3.5 py-2 text-white sm:text-sm/6 w-50 rounded-3xl focus:outline-none placeholder:text-white focus:text-gray-200 translate-x-4.5 focus:translate-x-0 transition delay-150 duration-300 ease-in-out lg:w-100"
                placeholder="Search..."
              />
            </div>
            <FaSearch
              color="white"
              size={25}
              className="mt-1.5 hover:cursor-pointer hover:scale-115 transition delay-150 duration-600 ease-in-out"
            />
            <div className="relative hover:cursor-pointer hover:scale-115 transition delay-150 duration-600 ease-in-out">
              <FiShoppingCart
                color="white"
                size={25}
                className="ml-1.5 mt-1.5"
              />
              <div className="absolute top-[-1px] left-[28px] text-white text-sm">
                0
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={openMenu ? "md:hidden" : "hidden"} id="mobile-menu">
        <div className="space-y-1 px-2 pt-2 pb-3">
          <a
            href="#"
            className="block rounded-md pr-3 pl-3 py-2 text-sm font-medium text-[#FAF9F6] hover:text-[#111111] hover:bg-[#FAF9F6] hover:opacity-90 transition delay-150 duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-101"
            aria-current="page"
          >
            Shop
          </a>
          <a
            href="#"
            className="my-3 block rounded-md pr-3 pl-3 py-2 text-sm font-medium text-[#FAF9F6] hover:text-[#111111] hover:bg-[#FAF9F6] hover:opacity-90 transition delay-150 duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-101 "
          >
            New
          </a>
          {data.status === "authenticated" ? (
            <a
              href="#"
              onClick={() => signOut()}
              className="block rounded-md px-3 py-2 text-sm font-medium text-[#FAF9F6] hover:text-[#111111] hover:bg-[#FAF9F6] hover:opacity-90 transition delay-150 duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-110"
            >
              Sign Out
            </a>
          ) : (
            <a
              href="/sign-in"
              className="block rounded-md px-3 py-2 text-sm font-medium text-[#FAF9F6] hover:text-[#111111] hover:bg-[#FAF9F6] hover:opacity-90 transition delay-150 duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-110"
            >
              Sign In
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
