"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface SellerInfo {
  name: string;
  location: string;
}

const CreateOrUpdateSellerAccount: React.FC = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [sellerInfo, setSellerInfo] = useState<SellerInfo>({
    name: "",
    location: "",
  });
  const [isExistingSeller, setIsExistingSeller] = useState<boolean | null>(null);

  const { writeContractAsync, isPending: isLoading, isSuccess: isCreated } = useScaffoldWriteContract("VerifyMyDevice");

  // Read contract to check if the user is already a seller
  const { data: existingSeller, isLoading: isSellerLoading } = useScaffoldReadContract({
    contractName: "VerifyMyDevice",
    functionName: "sellers",
    args: [address],
  });

  useEffect(() => {
    if (!isSellerLoading && existingSeller) {
      const [name, location] = existingSeller;
      if (name && location) {
        setIsExistingSeller(true);
        setSellerInfo({
          name,
          location,
        });
      } else {
        setIsExistingSeller(false);
      }
    }
  }, [existingSeller, isSellerLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSellerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isExistingSeller) {
        await writeContractAsync({
          functionName: "updateSellerAccount",
          args: [sellerInfo.location, sellerInfo.name],
        });
        console.log("Seller account updated:", sellerInfo);
      } else {
        await writeContractAsync({
          functionName: "createSellerAccount",
          args: [sellerInfo.name, sellerInfo.location],
        });
        console.log("Seller account created:", sellerInfo);
      }
      router.push(`/seller/bookings`);
    } catch (error) {
      console.error("Error creating/updating seller account:", error);
    }
  };

  if (isCreated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Account {isExistingSeller ? "Updated" : "Created"} Successfully!</h1>
        <p className="mb-4">Your seller account has been set up with the following details:</p>
        <div className="bg-base-200 p-4 rounded-lg inline-block text-left">
          <p>
            <strong>Name:</strong> {sellerInfo.name}
          </p>
          <p>
            <strong>Location:</strong> {sellerInfo.location}
          </p>
        </div>
      </div>
    );
  }

  if (isSellerLoading || isExistingSeller === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-2 py-2">
      <h1 className="text-3xl font-bold mb-6">{isExistingSeller ? "Update" : "Create"} Seller Account</h1>
      <form onSubmit={handleSubmit} className="bg-base-200 shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="input input-bordered w-full"
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Rome Phone Service"
            value={sellerInfo.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2" htmlFor="location">
            Location
          </label>
          <input
            className="input input-bordered w-full"
            id="location"
            name="location"
            type="text"
            placeholder="e.g. Rome"
            value={sellerInfo.location}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`} type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : (isExistingSeller ? "Update" : "Create") + " Seller Account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrUpdateSellerAccount;
