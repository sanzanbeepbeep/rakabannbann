"use client";

import { useEffect, useState } from "react";
import { ConfigProvider } from "antd";

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Detect system theme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    // Listen for changes to the system theme
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: isDarkMode ? "#000000" : "#ffffff", // Dynamic primary color
          colorBgBase: isDarkMode ? "#000000" : "#ffffff", // Background color
          colorTextBase: isDarkMode ? "#ffffff" : "#000000", // Text color
          colorPrimaryHover: isDarkMode ? "#ffffff" : "#000000", // Hover primary color
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
