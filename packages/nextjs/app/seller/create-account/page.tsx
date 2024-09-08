"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface SellerInfo {
  name: string;
  location: string;
}

const CreateSellerAccount: React.FC = () => {
  const router = useRouter();
  const [sellerInfo, setSellerInfo] = useState<SellerInfo>({
    name: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreated, setIsCreated] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSellerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate an async operation (like a contract interaction)
    setTimeout(() => {
      console.log("Seller account created:", sellerInfo);
      setIsLoading(false);
      setIsCreated(true);
      router.push(`/seller/bookings`);
    }, 1000); // Simulate a 1-second delay
  };

  if (isCreated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Account Created Successfully!</h1>
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

  return (
    <div className="container mx-auto px-2 py-2">
      <h1 className="text-3xl font-bold mb-6">Create Seller Account</h1>
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
            {isLoading ? "Creating..." : "Create Seller Account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSellerAccount;
