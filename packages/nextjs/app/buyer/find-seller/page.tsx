"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatEther, parseEther } from "viem";
import SetupNotification from "~~/components/SetupNotification";
import { Address } from "~~/components/scaffold-eth";
import { TokenAddress } from "~~/components/scaffold-eth/TokenAddress";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface Offer {
  sellerAddress: string;
  offerId: string;
  deviceType: string;
  certificationPrice: number;
  token: string;
}

interface OfferEntry {
  sellerName: string;
  sellerLocation: string;
}

function OfferEntry(props: { offer: Offer }) {
  const { data: seller } = useScaffoldReadContract({
    contractName: "VerifyMyDevice",
    functionName: "sellers",
    args: [props.offer.sellerAddress],
  });

  return (
    <tr>
      <td>{seller?.[0]}</td>
      <td>{seller?.[1]}</td>
      <td>{props.offer.deviceType}</td>
      <td>
        {props.offer.certificationPrice} <TokenAddress address={props.offer.token} format="short" />
      </td>
      <td>
        <Link
          href={`/buyer/certification-details/${props.offer.sellerAddress}/${props.offer.offerId}`}
          className="btn btn-primary btn-sm"
        >
          Buy
        </Link>
      </td>
    </tr>
  );
}

const FindCertification: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const { data: allProducts } = useScaffoldReadContract({
    contractName: "VerifyMyDevice",
    functionName: "getAllProducts",
  });

  useEffect(() => {
    if (allProducts) {
      const formattedOffers = allProducts.map((product: any, index: number) => ({
        sellerAddress: product.sellerAddress as string,
        offerId: index.toString(),
        certificationPrice: parseFloat(formatEther(product.price)),
        deviceType: product.deviceType,
        token: product.tokenAddress as string,
      }));
      setOffers(formattedOffers);
    }
  }, [allProducts]);

  return (
    <div className="container mx-auto px-2 py-2">
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
                <OfferEntry key={`${offer.sellerAddress}-${offer.offerId}`} offer={offer}></OfferEntry>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 text-center">
          <button onClick={() => setIsNotificationModalOpen(true)} className="btn btn-secondary">
            No nearby issuer? Get notified about new offers
          </button>
        </div>
      </div>
      {isNotificationModalOpen && <SetupNotification onClose={() => setIsNotificationModalOpen(false)} />}
    </div>
  );
};

export default FindCertification;
