"use client";

import { useState } from "react";
import { Form, Input, Button } from "antd";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fixes Leaflet default marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Home() {
  const [form] = Form.useForm();
  const [location, setLocation] = useState({ lat: 13.736717, lng: 100.523186 }); // Default: Bangkok
  const [markerPosition, setMarkerPosition] = useState(location);

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
    return markerPosition ? <Marker position={markerPosition} /> : null;
  };

  const handleSubmit = (values: any) => {
    console.log("Form Values:", values);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Form
        form={form}
        layout="vertical"
        className="w-full max-w-lg bg-white p-6 shadow rounded"
        onFinish={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Property Details</h1>

        {/* Land Area */}
        <Form.Item
          name="landArea"
          label="Land Area (sq.m)"
          rules={[{ required: true, message: "Please enter the land area!" }]}
        >
          <Input type="number" placeholder="Enter land area" />
        </Form.Item>

        {/* House Area */}
        <Form.Item
          name="houseArea"
          label="House Area (sq.m)"
          rules={[{ required: true, message: "Please enter the house area!" }]}
        >
          <Input type="number" placeholder="Enter house area" />
        </Form.Item>

        {/* House Age */}
        <Form.Item
          name="houseAge"
          label="House Age (years)"
          rules={[{ required: true, message: "Please enter the house age!" }]}
        >
          <Input type="number" placeholder="Enter house age" />
        </Form.Item>

        {/* Location: Latitude */}
        <Form.Item
          name="latitude"
          label="Latitude"
          rules={[{ required: true, message: "Please select a location on the map!" }]}
        >
          <Input readOnly placeholder="Latitude will auto-fill on map click" />
        </Form.Item>

        {/* Location: Longitude */}
        <Form.Item
          name="longitude"
          label="Longitude"
          rules={[{ required: true, message: "Please select a location on the map!" }]}
        >
          <Input readOnly placeholder="Longitude will auto-fill on map click" />
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

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
