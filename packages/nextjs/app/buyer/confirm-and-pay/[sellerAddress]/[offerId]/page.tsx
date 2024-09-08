"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { erc20Abi, erc20Abi_bytes32, formatEther, parseEther } from "viem";
import { useWriteContract } from "wagmi";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

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
  deviceType: string;
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

  const { data: seller } = useScaffoldReadContract({
    contractName: "VerifyMyDevice",
    functionName: "sellers",
    args: [sellerAddress as string],
  });

  const { data: product } = useScaffoldReadContract({
    contractName: "VerifyMyDevice",
    functionName: "products",
    args: [BigInt(Number(offerId) + 1)],
  });

  const { writeContractAsync: purchaseProduct, isPending: isPurchasing } = useScaffoldWriteContract("VerifyMyDevice");

  const { writeContract } = useWriteContract();
  const { data: deployedContractData } = useDeployedContractInfo("VerifyMyDevice");

  useEffect(() => {
    const details = searchParams.get("details");
    if (details) {
      setDeviceDetails(JSON.parse(decodeURIComponent(details)));
    }

    if (seller && product) {
      const formattedDetails: OfferDetails = {
        sellerAddress: sellerAddress as string,
        offerId: offerId as string,
        sellerName: seller[0],
        sellerLocation: seller[1],
        deviceType: product?.[0],
        certificationPrice: parseFloat(formatEther(product[1])),
        token: product[2],
      };
      setOfferDetails(formattedDetails);
    }
  }, [sellerAddress, offerId, searchParams, seller, product]);

  const handleApprove = async () => {
    setIsLoading(true);
    writeContract({
      abi: erc20Abi_bytes32,
      address: product?.[2] as string,
      functionName: "approve",
      args: [deployedContractData?.address, BigInt(product?.[1])],
    });
    setIsApproved(true);
    setIsLoading(false);
  };

  const handlePay = async () => {
    setIsLoading(true);
    try {
      await purchaseProduct({
        functionName: "purchaseProduct",
        args: [
          BigInt(BigInt(Number(offerId) + 1)),
          deviceDetails?.brand || "",
          deviceDetails?.variant || "",
          deviceDetails?.model || "",
          ("0x" + deviceDetails?.serialNumberHash) as `0x${string}`,
        ],
      });
      alert("Certification payment successful!");
    } catch (error) {
      console.error("Error purchasing product:", error);
      alert("Certification payment failed. Please try again.");
    }
    setIsLoading(false);
  };

  if (!deviceDetails || !offerDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-2 py-2">
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
