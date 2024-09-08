"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { erc20Abi_bytes32 } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface BookingItemProps {
  certId: bigint;
}

const SellerBookings: React.FC = () => {
  const { address } = useAccount();
  const [certificateIds, setCertificateIds] = useState<bigint[]>([]);

  const { data: fetchedCertificateIds, isLoading: isCertificateIdsLoading } = useScaffoldReadContract({
    contractName: "VerifyMyDevice",
    functionName: "getAllPurchasedCertificatesBySeller",
    args: [address as string],
  });

  useEffect(() => {
    if (fetchedCertificateIds) {
      setCertificateIds(fetchedCertificateIds);
    }
  }, [fetchedCertificateIds]);

  if (isCertificateIdsLoading) {
    return <div className="text-center mt-8">Loading bookings...</div>;
  }

  return (
    <div className="container mx-auto px-2 py-2">
      <h1 className="text-3xl font-bold mb-6">Bookings</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Device</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {certificateIds.map(certId => (
              <BookingItem certId={certId} key={certId.toString()} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BookingItem: React.FC<BookingItemProps> = ({ certId }) => {
  const { address } = useAccount();
  const { data: certificate, isLoading } = useScaffoldReadContract({
    contractName: "VerifyMyDevice",
    functionName: "getCertificateDetails",
    args: [certId],
  });
  const [isApproved, setIsApproved] = useState(false);
  const { writeContract } = useWriteContract();
  const { data: deployedContractData } = useDeployedContractInfo("VerifyMyDevice");

  const { data: product } = useScaffoldReadContract({
    contractName: "VerifyMyDevice",
    functionName: "products",
    args: [certificate?.productId || BigInt("0")],
  });

  const handleApprove = async () => {
    writeContract({
      abi: erc20Abi_bytes32,
      address: product?.[2] as string,
      functionName: "approve",
      args: [deployedContractData?.address as string, BigInt(product?.[2] || "0")],
    });
    setIsApproved(true);
  };

  const { writeContractAsync: refundCertificate, isPending: isRefunding } = useScaffoldWriteContract("VerifyMyDevice");

  const handleRefund = async () => {
    try {
      await refundCertificate({
        functionName: "refundCertificate",
        args: [certId],
      });
      // Assuming success, you might want to refetch the data here or handle state externally.
    } catch (error) {
      console.error("Error refunding certificate:", error);
    }
  };

  if (isLoading) {
    return (
      <tr>
        <td colSpan={4} className="text-center">
          Loading...
        </td>
      </tr>
    );
  }

  if (!certificate) {
    return (
      <tr>
        <td colSpan={4} className="text-center">
          Certificate not found
        </td>
      </tr>
    );
  }

  const status = certificate.isCompleted ? "Completed" : certificate.isRefunded ? "Refunded" : "Pending";
  const purchaseDate = new Date().toISOString().split("T")[0]; // Mocking the purchase date

  return (
    <tr>
      <td>{purchaseDate}</td>
      <td>
        {certificate.deviceBrand} {certificate.deviceModel}
      </td>
      <td>
        <span
          className={`
            ${status === "Completed" ? "text-green-600" : ""}
            ${status === "Pending" ? "text-yellow-600" : ""}
            ${status === "Refunded" ? "text-red-600" : ""}
          `}
        >
          {status}
        </span>
      </td>
      <td>
        {status === "Pending" && (
          <>
            <Link href={`/seller/issue-certification/${certId.toString()}`} className="btn btn-primary btn-sm mr-2">
              Issue Certificate
            </Link>
            <button
              className={`btn btn-error btn-sm ${isRefunding ? "loading" : ""}`}
              onClick={handleRefund}
              disabled={isRefunding}
            >
              {isRefunding ? "Refunding..." : "Refund"}
            </button>
            <button
              className={`btn btn-error btn-sm ${isApproved ? "loading" : ""}`}
              onClick={handleApprove}
              disabled={isApproved}
            >
              {isApproved ? "Aproving..." : "Approve"}
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default SellerBookings;
