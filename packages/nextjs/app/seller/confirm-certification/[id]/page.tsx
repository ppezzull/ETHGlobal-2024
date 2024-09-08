"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface BuyerDetails {
  brand: string;
  model: string;
  serialNumberHash: string;
}

interface SellerDetails {
  brand: string;
  model: string;
  variant: string;
  condition: string;
  remarks: string;
}

const ConfirmCertification: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { id: certificateId } = params;

  const [buyerDetails, setBuyerDetails] = useState<BuyerDetails | null>(null);
  const [sellerDetails, setSellerDetails] = useState<SellerDetails | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: certificate } = useScaffoldReadContract({
    contractName: "VerifyMyDevice",
    functionName: "getCertificateDetails",
    args: [BigInt(certificateId as string)],
  });

  const { writeContractAsync: completeCertification, isPending: isCompletingCertification } =
    useScaffoldWriteContract("VerifyMyDevice");
  useEffect(() => {
    if (certificate) {
      setBuyerDetails({
        brand: certificate.deviceBrand,
        model: certificate.deviceModel,
        serialNumberHash: certificate.serialNumberHash,
      });
    }

    const details = searchParams.get("details");
    if (details) {
      setSellerDetails(JSON.parse(decodeURIComponent(details)));
    }
    console.log(certificate, "===============", details);

    // Set isLoading to false once we have both buyer and seller details
    if (certificate && details) {
      setIsLoading(false);
    }
  }, [certificate, searchParams]);
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await completeCertification({
        functionName: "completeCertification",
        args: [
          BigInt(certificateId as string),
          sellerDetails?.brand || "",
          sellerDetails?.model || "",
          sellerDetails?.variant || "",
          sellerDetails?.condition || "",
          sellerDetails?.remarks || "",
        ],
      });
      alert("Certification proof created successfully!");
    } catch (error) {
      console.error("Error creating certification proof:", error);
      alert("Failed to create certification proof. Please try again.");
    }
    setIsLoading(false);
  };

  if (!buyerDetails || !sellerDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-2 py-2">
      <h1 className="text-3xl font-bold mb-6">Confirm Certification</h1>
      <div className="bg-base-200 shadow-md rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Buyer Provided Details</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <p>
            <strong>Brand:</strong> {buyerDetails.brand}
          </p>
          <p>
            <strong>Model:</strong> {buyerDetails.model}
          </p>
          <p>
            <strong>Serial Number Hash:</strong> {buyerDetails.serialNumberHash}
          </p>
        </div>
        <h2 className="text-xl font-semibold mb-4">Your Verification</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <p>
            <strong>Brand:</strong> {sellerDetails.brand}
          </p>
          <p>
            <strong>Model:</strong> {sellerDetails.model}
          </p>
          <p>
            <strong>Variant:</strong> {sellerDetails.variant}
          </p>
          <p>
            <strong>Condition:</strong> {sellerDetails.condition}
          </p>
          <p>
            <strong>Remarks:</strong> {sellerDetails.remarks}
          </p>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="confirm"
            checked={isConfirmed}
            onChange={e => setIsConfirmed(e.target.checked)}
            className="checkbox"
          />
          <label htmlFor="confirm" className="ml-2">
            I confirm these details are correct and I proceed with creating an on-chain proof
          </label>
        </div>
        <button
          onClick={handleConfirm}
          className={`btn btn-primary ${isLoading || isCompletingCertification ? "loading" : ""}`}
          disabled={!isConfirmed || isLoading || isCompletingCertification}
        >
          {isCompletingCertification ? "Creating Proof..." : "Create On-Chain Proof"}
        </button>
      </div>
    </div>
  );
};

export default ConfirmCertification;
