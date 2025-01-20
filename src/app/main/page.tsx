"use client";

import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Modal,
  Statistic,
  StatisticProps,
  AutoComplete,
} from "antd";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CardHouse, { HouseProps } from "../components/pricecard";
import CountUp from "react-countup";


// Fixes Leaflet default marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Home() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Loading state for the submit button
  const [location, setLocation] = useState({ lat: 13.736717, lng: 100.523186 }); // Default: Bangkok
  const [markerPosition, setMarkerPosition] = useState(location);
  const [isDarkMode, setIsDarkMode] = useState(false); // Detect system theme
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for card
  const cardData:HouseProps[] = [
    {
      lat: "13.736717",
      long: "100.523186",
      area: "100 sq.m",
      price: "10,000,000 THB", // 100 sq.m * 100,000 THB/m²
    },
    {
      lat: "13.737832",
      long: "100.523711",
      area: "120 sq.m",
      price: "15,600,000 THB", // 120 sq.m * 130,000 THB/m²
    },
    {
      lat: "13.738947",
      long: "100.524236",
      area: "90 sq.m",
      price: "10,800,000 THB", // 90 sq.m * 120,000 THB/m²
    },
    {
      lat: "13.739610",
      long: "100.525100",
      area: "150 sq.m",
      price: "27,000,000 THB", // 150 sq.m * 180,000 THB/m²
    },
    {
      lat: "13.735982",
      long: "100.522630",
      area: "110 sq.m",
      price: "13,200,000 THB", // 110 sq.m * 120,000 THB/m²
    },
    {
      lat: "13.734866",
      long: "100.522105",
      area: "95 sq.m",
      price: "9,975,000 THB", // 95 sq.m * 105,000 THB/m²
    },
    {
      lat: "13.733750",
      long: "100.521580",
      area: "105 sq.m",
      price: "15,750,000 THB", // 105 sq.m * 150,000 THB/m²
    },
    {
      lat: "13.732634",
      long: "100.521055",
      area: "130 sq.m",
      price: "23,400,000 THB", // 130 sq.m * 180,000 THB/m²
    },
    {
      lat: "13.731518",
      long: "100.520530",
      area: "140 sq.m",
      price: "21,000,000 THB", // 140 sq.m * 150,000 THB/m²
    },
    {
      lat: "13.730402",
      long: "100.520005",
      area: "115 sq.m",
      price: "12,650,000 THB", // 115 sq.m * 110,000 THB/m²
    },
  ];
  


  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    // Listen for theme changes
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  // Handle location change on map click
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setMarkerPosition(e.latlng);
        form.setFieldsValue({
          latitude: e.latlng.lat.toFixed(6),
          longitude: e.latlng.lng.toFixed(6),
        });
      },
    });
    return <Marker position={markerPosition} />;
  };

  const handleSubmit = async (values: any) => {
    setLoading(true); // Start loading
    console.log("Form Values:", values);

    // Simulate an async operation (e.g., API call)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a 2-second delay
      console.log("Submission complete!");
      showModal();
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleReset = () => {
    form.resetFields();
    setMarkerPosition(location); // Reset map marker to default location
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp end={value as number} duration={2} separator="," />
  );

  return (
    <div
      className={`flex justify-center items-center min-h-screen ${
        isDarkMode ? "bg-zinc-900 text-gray-300" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Form
        form={form}
        layout="vertical"
        className={`w-full max-w-lg p-6 shadow-lg rounded ${
          isDarkMode ? "bg-zinc-800" : "bg-white"
        }`}
        onFinish={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Property Details
        </h1>

        {/* Land Area */}
        <Form.Item
          name="landArea"
          label="Land Area (sq.m)"
          rules={[{ required: true, message: "Please enter the land area!" }]}
        >
          <InputNumber
            min={1}
            keyboard={false}
            placeholder="Enter land area"
            className={isDarkMode ? "bg-zinc-700 text-gray-300" : ""}
            style={{ width: "100%" }}
          />
        </Form.Item>

        {/* House Area */}
        <Form.Item
          name="houseArea"
          label="House Area (sq.m)"
          rules={[{ required: true, message: "Please enter the house area!" }]}
        >
          <InputNumber
            min={1}
            keyboard={false}
            placeholder="Enter house area"
            className={isDarkMode ? "bg-zinc-700 text-gray-300" : ""}
            style={{ width: "100%" }}
          />
        </Form.Item>

        {/* House Age */}
        <Form.Item
          name="houseAge"
          label="House Age (years)"
          rules={[{ required: true, message: "Please enter the house age!" }]}
        >
          <InputNumber
            min={1}
            keyboard={false}
            placeholder="Enter house age"
            className={isDarkMode ? "bg-zinc-700 text-gray-300" : ""}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="villageName"
          label="Village Name"
          rules={[{ required: false, message: "Please enter the village name!" }]}
        >
          <AutoComplete
            placeholder="Enter village name"
            className={isDarkMode ? "text-gray-300" : ""}
            style={{ width: "100%" 
                    
            }}
          />
        </Form.Item>


        {/* Location: Latitude */}
        <Form.Item
          name="latitude"
          label="Latitude"
          rules={[
            { required: true, message: "Please select a location on the map!" },
          ]}
        >
          <Input
            disabled={true}
            readOnly
            placeholder="Latitude will auto-fill on map click"
            className={isDarkMode ? "bg-zinc-700 text-gray-300" : ""}
          />
        </Form.Item>

        {/* Location: Longitude */}
        <Form.Item
          name="longitude"
          label="Longitude"
          rules={[
            { required: true, message: "Please select a location on the map!" },
          ]}
        >
          <Input
            disabled={true}
            readOnly
            placeholder="Longitude will auto-fill on map click"
            className={isDarkMode ? "bg-zinc-700 text-gray-300" : ""}
          />
        </Form.Item>

        {/* Map */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Mark Location on Map</h3>
          <MapContainer
            center={location}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
            className="rounded"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
          </MapContainer>
        </div>

        {/* Submit and Reset Buttons */}
        <Form.Item>
          <div className="flex justify-between">
            <Button
              type="default"
              variant="filled"
              htmlType="submit"
              loading={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
            <Button htmlType="button" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </Form.Item>
      </Form>
      <Modal
        title="Estimated Price"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Statistic
          title="Price"
          // value = mean of the first 3 prices
          value={Math.round(cardData.slice(0,3).reduce((acc, data) => acc + parseInt(data.price.replace(/,/g, ""),  10), 0) / 3)}
          prefix="Baht"
          formatter={formatter}
        />
        
        <h2 className="text-lg font-semibold mt-4">Similar Properties</h2>

        <div className="grid grid-cols-1 gap-4 mt-4">
          {cardData.splice(0,3).map((data, index) => (
            <CardHouse key={index} data={data} isDarkMode={isDarkMode} />
          ))}
        </div>

      </Modal>
    </div>
  );
}
