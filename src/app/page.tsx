"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { Button, ConfigProvider } from "antd";
import { FaRegMoon, FaRegSun } from "react-icons/fa";

export default function Home() {
  const [theme, setTheme] = useState("light");
  const router = useRouter(); // Initialize useRouter from next/navigation

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const navigateToMain = () => {
    router.push("/main"); // Navigate to /main
  };

  return (
    <ConfigProvider
      theme={{
        token: theme === "light" ? { colorPrimary: "#1677ff" } : { colorPrimary: "#ff4d4f" },
      }}
    >
      <div className="relative flex items-center justify-center min-h-screen">
        {/* Theme Toggle Button */}
        <Button
          className="absolute top-4 right-4 flex items-center justify-center text-xl"
          onClick={toggleTheme}
        >
          {theme === "light" ? <FaRegMoon className="text-lg" /> : <FaRegSun className="text-lg" />}
        </Button>

        <div className="flex flex-col items-center justify-center w-1/2 font-mono">
          <h1 className="text-6xl font-bold mb-6">RakaBaanBaan</h1>
          <p className="text-lg text-center px-8">
            Welcome to our House Price Prediction tool! This web application
            helps you estimate the value of a property based on essential
            features like location, size, number of rooms, and amenities.
            Powered by advanced machine learning algorithms, it provides quick,
            reliable, and accurate predictions to help you make informed
            decisions.
            <br />
            <br />
            Simply input the property details, and the app will calculate an
            estimated price in seconds. Whether you are a buyer, seller, or
            real estate professional, this tool is designed to simplify the
            pricing process and keep you ahead in the market.
            <br />
            <br />
          </p>
          <Button type="primary" onClick={navigateToMain} className="font-mono">
            Start exploring now!
          </Button>
        </div>
      </div>
    </ConfigProvider>
  );
}
