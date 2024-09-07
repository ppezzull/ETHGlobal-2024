"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface OfferDetails {
  sellerAddress: string;
  offerId: string;
  sellerName: string;
  sellerLocation: string;
  deviceType: "Phone" | "Laptop";
  certificationPrice: number;
  token: string;
}

interface DeviceDetails {
  brand: string;
  variant: string;
  model: string;
  serialNumber: string;
  serialNumberHash: string;
}

const CertificationDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();

  const { sellerAddress, offerId } = params;
  const [offerDetails, setOfferDetails] = useState<OfferDetails | null>(null);
  const [deviceDetails, setDeviceDetails] = useState<DeviceDetails>({
    brand: "",
    variant: "",
    model: "",
    serialNumber: "",
    serialNumberHash: "",
  });

  useEffect(() => {
    // Simulating fetching offer details
    const fetchOfferDetails = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockDetails: OfferDetails = {
        sellerAddress: sellerAddress as string,
        offerId: offerId as string,
        sellerName: "Rome Phone Service",
        sellerLocation: "Rome",
        deviceType: "Phone",
        certificationPrice: 15,
        token: "USDT",
      };
      setOfferDetails(mockDetails);
    };

    fetchOfferDetails();
  }, [sellerAddress, offerId]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "serialNumber") {
      const hash = await hashSerialNumber(value);
      setDeviceDetails(prev => ({ ...prev, [name]: value, serialNumberHash: hash }));
    } else {
      setDeviceDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  const hashSerialNumber = async (serialNumber: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(serialNumber);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const encodedDetails = encodeURIComponent(
      JSON.stringify({
        ...deviceDetails,
        serialNumber: "REDACTED",
        serialNumberHash: deviceDetails.serialNumberHash,
      }),
    );

    router.push(`/buyer/confirm-and-pay/${sellerAddress}/${offerId}?details=${encodedDetails}`);
  };

  if (!offerDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Certification Details</h1>
      <div className="bg-base-200 shadow-md rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">2. Details</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <p>
            <strong>Seller Name:</strong> {offerDetails.sellerName}
          </p>
          <p>
            <strong>Seller Location:</strong> {offerDetails.sellerLocation}
          </p>
          <p>
            <strong>Device Type:</strong> {offerDetails.deviceType}
          </p>
          <p>
            <strong>Certification Price:</strong> {offerDetails.certificationPrice} {offerDetails.token}
          </p>
          <p>
            <strong>Seller Address:</strong> {offerDetails.sellerAddress}
          </p>
          <p>
            <strong>Offer ID:</strong> {offerDetails.offerId}
          </p>
        </div>
        <h3 className="text-lg font-semibold mb-4">Provide Device Details</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="brand" className="block text-sm font-medium">
              Device Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={deviceDetails.brand}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="variant" className="block text-sm font-medium">
              Device Variant
            </label>
            <input
              type="text"
              id="variant"
              name="variant"
              value={deviceDetails.variant}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium">
              Device Model
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={deviceDetails.model}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium">
              Serial Number
            </label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              value={deviceDetails.serialNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
            <p className="text-xs text-gray-500 mt-1">(This will be securely hashed before submission)</p>
          </div>
          <button type="submit" className="btn btn-primary">
            Save Device Details and Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CertificationDetails;
