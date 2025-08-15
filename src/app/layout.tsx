"use client";
import React, { useEffect } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overscrollBehavior = "";
      document.documentElement.style.overscrollBehavior = "";
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <html lang="en">
      <body className="bg-gray-50 overflow-x-hidden">{children}</body>
    </html>
  );
}
