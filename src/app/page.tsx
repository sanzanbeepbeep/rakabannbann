"use client";

import { useRouter } from "next/navigation"; // Import from next/navigation
import { Button, ConfigProvider } from "antd";

export default function Home() {
  const router = useRouter(); // Initialize useRouter from next/navigation

  const navigateToMain = () => {
    router.push("/main"); // Navigate to /main
  };

  return (
    <ConfigProvider>
      <div className="relative flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center w-3/4 text-center font-mono">
          <h1 className="text-6xl font-bold mb-4">RakaBaanBaan</h1>
          <h2 className="text-2xl font-semibold mb-6">
            Your Intelligent House Price Prediction Tool
          </h2>
          <Button type="primary" className="text-lg" onClick={navigateToMain}>
            Explore Now
          </Button>
        </div>
      </div>
    </ConfigProvider>
  );
}
