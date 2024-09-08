"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

// Interface for Certification data
interface Certification {
  id: string;
  deviceBrand: string;
  deviceModel: string;
  issueDate: string;
  status: "Refunded" | "Completed" | "Pending";
}

// New CertificationItem component
const CertificationItem: React.FC<{ certId: bigint }> = ({ certId }) => {
  const { data: certificate, isLoading } = useScaffoldReadContract({
    contractName: "VerifyMyDevice",
    functionName: "getCertificateDetails",
    args: [certId],
  });

  if (isLoading) {
    return <div className="text-center mt-8">Loading certification details...</div>;
  }

  if (!certificate) {
    return <div>Certificate not found</div>;
  }

  const certification: Certification = {
    id: certId.toString(),
    deviceBrand: certificate.deviceBrand as string,
    deviceModel: certificate.deviceModel as string,
    issueDate: new Date().toISOString().split("T")[0], // Get current date
    status: certificate.isCompleted ? "Completed" : certificate.isRefunded ? "Refunded" : "Pending",
  };

  return (
    <Link href={`/certifications/${certification.id}`} key={certification.id} className="block">
      <div className="bg-base-200 shadow-md rounded p-4 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">
          {certification.deviceBrand} {certification.deviceModel}
        </h2>
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
      </div>
    </Link>
  );
};

// Main MyCertifications component
const MyCertifications: React.FC = () => {
  const { address } = useAccount();
  const [certificateIds, setCertificateIds] = useState<bigint[]>([]);

  const { data: fetchedCertificateIds, isLoading: isCertificateIdsLoading } = useScaffoldReadContract({
    contractName: "VerifyMyDevice",
    functionName: "getAllCertificatesByBuyer",
    args: [address as string],
  });

  useEffect(() => {
    console.log(fetchedCertificateIds, "============");
    if (fetchedCertificateIds) {
      setCertificateIds(fetchedCertificateIds);
    }
  }, [fetchedCertificateIds]);

  if (isCertificateIdsLoading) {
    return <div className="text-center mt-8">Loading certifications...</div>;
  }

  return (
    <div className="container mx-auto px-2 py-2">
      <h1 className="text-3xl font-bold mb-6">My Certifications</h1>
      {certificateIds.length === 0 ? (
        <p>You don't have any certifications yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificateIds.map(certId => (
            <CertificationItem certId={certId} key={certId.toString()} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCertifications;
