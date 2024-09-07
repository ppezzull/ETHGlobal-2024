"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

interface DeviceDetails {
  brand: string;
  variant: string;
  model: string;
  serialNumberHash: string;
}

interface OfferDetails {
  sellerAddress: string;
  offerId: string;
  sellerName: string;
  sellerLocation: string;
  deviceType: "Phone" | "Laptop";
  certificationPrice: number;
  token: string;
}

const ConfirmAndPay: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { sellerAddress, offerId } = params;
  const [deviceDetails, setDeviceDetails] = useState<DeviceDetails | null>(null);
  const [offerDetails, setOfferDetails] = useState<OfferDetails | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const details = searchParams.get("details");
    if (details) {
      setDeviceDetails(JSON.parse(decodeURIComponent(details)));
    }

    // Fetch offer details (mock for now)
    const fetchOfferDetails = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setOfferDetails({
        sellerAddress: sellerAddress as string,
        offerId: offerId as string,
        sellerName: "Rome Phone Service",
        sellerLocation: "Rome",
        deviceType: "Phone",
        certificationPrice: 15,
        token: "USDT",
      });
    };

    fetchOfferDetails();
  }, [sellerAddress, offerId, searchParams]);

  const handleApprove = async () => {
    setIsLoading(true);
    // Simulate blockchain interaction for approval
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsApproved(true);
    setIsLoading(false);
  };

  const handlePay = async () => {
    setIsLoading(true);
    // Simulate blockchain interaction for payment
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Submitting to blockchain:", { deviceDetails, offerDetails });
    setIsLoading(false);
    alert("Certification payment successful!");
  };

  if (!deviceDetails || !offerDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Confirm, Approve & Pay</h1>
      <div className="bg-base-200 shadow-md rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">3. Confirm & Pay</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold">Device Details</h3>
            <p>
              <strong>Brand:</strong> {deviceDetails.brand}
            </p>
            <p>
              <strong>Variant:</strong> {deviceDetails.variant}
            </p>
            <p>
              <strong>Model:</strong> {deviceDetails.model}
            </p>
            <p>
              <strong>Serial Number Hash:</strong> {deviceDetails.serialNumberHash.slice(0, 10)}...
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Offer Details</h3>
            <p>
              <strong>Seller:</strong> {offerDetails.sellerName}
            </p>
            <p>
              <strong>Location:</strong> {offerDetails.sellerLocation}
            </p>
            <p>
              <strong>Device Type:</strong> {offerDetails.deviceType}
            </p>
            <p>
              <strong>Price:</strong> {offerDetails.certificationPrice} {offerDetails.token}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleApprove}
            className={`btn btn-secondary w-full ${isLoading && !isApproved ? "loading" : ""}`}
            disabled={isLoading || isApproved}
          >
            {isApproved ? "Approved" : isLoading ? "Approving..." : "Approve Spending"}
          </button>
          <button
            onClick={handlePay}
            className={`btn btn-primary w-full ${isLoading && isApproved ? "loading" : ""}`}
            disabled={isLoading || !isApproved}
          >
            {isLoading && isApproved ? "Processing Payment..." : "Confirm and Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAndPay;
