"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface CertificationDetail {
  id: string;
  deviceBrand: string;
  deviceModel: string;
  deviceVariant: string;
  serialNumberHash: string;
  issueDate: string;
  status: "Refunded" | "Completed" | "Pending";
  issuer: string;
  transactionHash: string;
}

const CertificationDetail: React.FC = () => {
  const params = useParams();
  const { id } = params;
  const [certification, setCertification] = useState<CertificationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCertificationDetail = async () => {
      // Simulating an API call or blockchain read
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockCertification: CertificationDetail = {
        id: id as string,
        deviceBrand: "Apple",
        deviceModel: "iPhone 12",
        deviceVariant: "128GB",
        serialNumberHash: "0x1234567890abcdef...",
        issueDate: "2023-05-15",
        status: "Completed",
        issuer: "Rome Phone Service",
        transactionHash: "0xabcdef1234567890...",
      };

      setCertification(mockCertification);
      setIsLoading(false);
    };

    fetchCertificationDetail();
  }, [id]);

  if (isLoading) {
    return <div className="text-center mt-8">Loading certification details...</div>;
  }

  if (!certification) {
    return <div className="text-center mt-8">Certification not found.</div>;
  }

  return (
    <div className="container mx-auto px-2 py-2">
      <h1 className="text-3xl font-bold mb-6">Certification Detail</h1>
      <div className="bg-base-200 shadow-md rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {certification.deviceBrand} {certification.deviceModel}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Device Variant:</strong> {certification.deviceVariant}
          </p>
          <p>
            <strong>Serial Number Hash:</strong> {certification.serialNumberHash.slice(0, 10)}...
          </p>
          <p>
            <strong>Issue Date:</strong> {certification.issueDate}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`
            ${certification.status === "Completed" ? "text-green-600" : ""}
            ${certification.status === "Pending" ? "text-yellow-600" : ""}
            ${certification.status === "Refunded" ? "text-red-600" : ""}
          `}
            >
              {certification.status}
            </span>
          </p>
          <p>
            <strong>Issuer:</strong> {certification.issuer}
          </p>
          <p>
            <strong>Transaction Hash:</strong> {certification.transactionHash.slice(0, 10)}...
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificationDetail;
