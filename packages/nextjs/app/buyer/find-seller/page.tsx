"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Offer {
  sellerAddress: string;
  offerId: string;
  sellerName: string;
  sellerLocation: string;
  deviceType: "Phone" | "Laptop";
  certificationPrice: number;
  token: string;
}

const MOCK_OFFERS: Offer[] = [
  {
    sellerAddress: "0x1234567890123456789012345678901234567890",
    offerId: "1",
    sellerName: "Rome Phone Service",
    sellerLocation: "Rome",
    deviceType: "Phone",
    certificationPrice: 15,
    token: "USDT",
  },
  {
    sellerAddress: "0x1234567890123456789012345678901234567890",
    offerId: "2",
    sellerName: "Rome Phone Service",
    sellerLocation: "Rome",
    deviceType: "Laptop",
    certificationPrice: 20,
    token: "USDT",
  },
  {
    sellerAddress: "0x0987654321098765432109876543210987654321",
    offerId: "1",
    sellerName: "Milan Tech Cert",
    sellerLocation: "Milan",
    deviceType: "Phone",
    certificationPrice: 18,
    token: "USDT",
  },
  {
    sellerAddress: "0x0987654321098765432109876543210987654321",
    offerId: "2",
    sellerName: "Milan Tech Cert",
    sellerLocation: "Milan",
    deviceType: "Laptop",
    certificationPrice: 25,
    token: "USDT",
  },
];

const FindCertification: React.FC = () => {
  const [offers] = useState<Offer[]>(MOCK_OFFERS);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Certification</h1>
      <div className="bg-base-200 shadow-md rounded p-6">
        <h2 className="text-xl font-semibold mb-4">1. Find certification</h2>
        <p className="mb-4">Choose a certification offer from a seller close to you:</p>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Seller Name</th>
                <th>Seller Location</th>
                <th>Device Type</th>
                <th>Certification Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {offers.map(offer => (
                <tr key={`${offer.sellerAddress}-${offer.offerId}`}>
                  <td>{offer.sellerName}</td>
                  <td>{offer.sellerLocation}</td>
                  <td>{offer.deviceType}</td>
                  <td>
                    {offer.certificationPrice} {offer.token}
                  </td>
                  <td>
                    <Link
                      href={`/buyer/certification-details/${offer.sellerAddress}/${offer.offerId}`}
                      className="btn btn-primary btn-sm"
                    >
                      Buy
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FindCertification;
