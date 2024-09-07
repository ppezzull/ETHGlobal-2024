"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Certification {
  id: string;
  deviceBrand: string;
  deviceModel: string;
  issueDate: string;
  status: "Refunded" | "Completed" | "Pending";
}

const MyCertifications: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      // Simulating an API call or blockchain read
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockCertifications: Certification[] = [
        { id: "1", deviceBrand: "Apple", deviceModel: "iPhone 12", issueDate: "2023-05-15", status: "Refunded" },
        { id: "2", deviceBrand: "Samsung", deviceModel: "Galaxy S21", issueDate: "2023-06-20", status: "Pending" },
        { id: "3", deviceBrand: "Google", deviceModel: "Pixel 6", issueDate: "2023-07-10", status: "Completed" },
      ];

      setCertifications(mockCertifications);
      setIsLoading(false);
    };

    fetchCertifications();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-8">Loading certifications...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Certifications</h1>
      {certifications.length === 0 ? (
        <p>You dont have any certifications yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map(cert => (
            <Link href={`/buyer/certifications/${cert.id}`} key={cert.id} className="block">
              <div className="bg-base-200 shadow-md rounded p-4 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2">
                  {cert.deviceBrand} {cert.deviceModel}
                </h2>
                <p>
                  <strong>Issue Date:</strong> {cert.issueDate}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`
                  ${cert.status === "Completed" ? "text-green-600" : ""}
                  ${cert.status === "Pending" ? "text-yellow-600" : ""}
                  ${cert.status === "Refunded" ? "text-red-600" : ""}
                `}
                  >
                    {cert.status}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCertifications;
