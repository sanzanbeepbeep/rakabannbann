"use client";

import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Modal,
  Statistic,
  AutoComplete,
} from "antd";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CountUp from "react-countup";

// Fix Leaflet Marker Icon Issue
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
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ lat: 13.736717, lng: 100.523186 });
  const [markerPosition, setMarkerPosition] = useState(location);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prediction, setPrediction] = useState(0);
  const [nearbyHouses, setNearbyHouses] = useState([]);
  const [error, setError] = useState("");
  const [villages, setVillages] = useState([]);
  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener("change", (e) => setIsDarkMode(e.matches));
    return () => mediaQuery.removeEventListener("change", () => {});
  }, []);

  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/villages");
        setVillages(
          response.data.villages.map((village: string) => ({ value: village }))
        );
      } catch (error) {
        console.error("Error fetching villages:", error);
      }
    };

    fetchVillages();
  }, []);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setMarkerPosition(e.latlng);
        form.setFieldsValue({
          latitude: e.latlng.lat.toFixed(6),
          longtitude: e.latlng.lng.toFixed(6),
        });
      },
    });
    return <Marker position={markerPosition} />;
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError("");
    setNearbyHouses([]);

    try {
      // Fetch predicted price
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setPrediction(response.data.predicted_price);
      await handleGetNearbyHouses(values); // Fetch nearby houses after prediction
      setIsModalOpen(true);
    } catch (err) {
      setError("Error making prediction. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetNearbyHouses = async (values: any) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/near", values, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.near_houses) {
        setNearbyHouses(response.data.near_houses);
      }
    } catch (err) {
      console.error("Error fetching nearby houses:", err);
    }
  };

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

        <Form.Item
          name="land_area"
          label="Land Area (sq.m)"
          rules={[{ required: true, message: "Enter land area!" }]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            placeholder="Enter land area"
          />
        </Form.Item>

        <Form.Item
          name="building_area"
          label="House Area (sq.m)"
          rules={[{ required: true, message: "Enter house area!" }]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            placeholder="Enter house area"
          />
        </Form.Item>

        <Form.Item
          name="building_age"
          label="House Age"
          rules={[{ required: true, message: "Enter house age!" }]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            placeholder="Enter house age"
          />
        </Form.Item>

        <Form.Item
          name="no_of_floor"
          label="Number of Floors"
          rules={[{ required: true, message: "Enter number of floors!" }]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            placeholder="Enter number of floors"
          />
        </Form.Item>

        <Form.Item
          name="village"
          label="Village"
          rules={[{ required: true, message: "Select a village!" }]}
        >
          <AutoComplete options={villages} placeholder="Select a village" />
        </Form.Item>

        <Form.Item
          name="latitude"
          label="Latitude"
          rules={[{ required: true, message: "Select a location on the map!" }]}
        >
          <Input readOnly placeholder="Latitude will auto-fill on map click" />
        </Form.Item>

        <Form.Item
          name="longtitude"
          label="Longitude"
          rules={[{ required: true, message: "Select a location on the map!" }]}
        >
          <Input readOnly placeholder="Longitude will auto-fill on map click" />
        </Form.Item>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Mark Location on Map</h3>
          <MapContainer
            center={location}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />
          </MapContainer>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <Form.Item>
          <div className="flex justify-between w-full">
            <Button type="dashed" htmlType="submit" loading={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
            <Button
              type="dashed"
              onClick={() => form.resetFields()}
              className="ml-auto"
            >
              Reset
            </Button>
          </div>
        </Form.Item>

        <p className="text-center text-xs text-gray-500 mt-4">
          <strong>Note:</strong> The predicted price is an estimate and may
          vary. The nearby houses are based on the location you selected.
        </p>
      </Form>

      <Modal
        title="Estimated Price"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Statistic
          title="Predicted Price (THB)"
          value={prediction}
          formatter={(value) => (
            <CountUp end={value} duration={2} separator="," />
          )}
        />

        <h3 className="mt-4 text-lg font-bold">Nearby Houses:</h3>
        {nearbyHouses.length > 0 ? (
          <ul>
            {nearbyHouses.map((house, index) => (
              <li key={index} className="mt-2 p-2 border rounded-lg">
                <p>
                  <strong>Distance:</strong> {house.distance.toFixed(2)} meters
                </p>
                <p>
                  <strong>Price:</strong> {house.price.toLocaleString()} THB
                </p>
                <p>
                  <strong>Land Area:</strong> {house.land_area} sq.m
                </p>
                <p>
                  <strong>Building Area:</strong> {house.building_area} sq.m
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No nearby houses found.</p>
        )}
      </Modal>
    </div>
  );
}
