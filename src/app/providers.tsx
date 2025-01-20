"use client";

import { useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import { input } from "motion/react-client";

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
          colorBgBase: isDarkMode ? "#3F3F46" : "#ffffff", // Background color
          colorTextBase: isDarkMode ? "#ffffff" : "#000000", // Text color
          colorPrimaryHover: isDarkMode ? "#8C9BAB" : "#000000", // Hover primary color
          
        },
        components: {
          InputNumber:{
            activeBorderColor: isDarkMode ? "#8C9BAB" : "#000000",
            activeShadow: isDarkMode ? "" : "",
          },
          Select:{
            activeBorderColor: isDarkMode ? "#8C9BAB" : "#000000",
            borderRadius: isDarkMode ? "8px" : "8px",
          }
        }
      }}
    >
      {children}
    </ConfigProvider>
  );
}
