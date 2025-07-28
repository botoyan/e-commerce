"use client";
import "./globals.css";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
      html.style.overflow = "auto";
    }

    return () => {
      body.style.overflow = "auto";
      html.style.overflow = "auto";
    };
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
