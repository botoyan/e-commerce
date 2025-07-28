"use client";
import React, { useEffect } from "react";
import HomePage from "./_components/homepage";

export default function Home() {
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    const hasVerticalOverflow =
      html.scrollHeight > window.innerHeight ||
      body.scrollHeight > window.innerHeight;
    const hasHorizontalOverflow =
      html.scrollWidth > window.innerWidth ||
      body.scrollWidth > window.innerWidth;

    if (!hasVerticalOverflow && !hasHorizontalOverflow) {
      // No overflow, disable scroll
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    } else {
      // Overflow, allow scroll
      body.style.overflow = "auto";
      html.style.overflow = "auto";
    }
  }, []);
  return (
    <>
      <HomePage />
    </>
  );
}
