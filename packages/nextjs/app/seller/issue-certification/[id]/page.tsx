"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

const IssueCertification: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [image, setImage] = useState<File | null>(null);
  const [deviceDetails, setDeviceDetails] = useState({
    brand: "",
    model: "",
    variant: "",
    condition: "",
    remarks: "",
    imageUri: image?.name,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeviceDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const encodedDetails = encodeURIComponent(JSON.stringify(deviceDetails));
    router.push(`/seller/confirm-certification/${id}?details=${encodedDetails}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Issue Certification</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Brand</label>
          <input
            type="text"
            name="brand"
            value={deviceDetails.brand}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Model</label>
          <input
            type="text"
            name="model"
            value={deviceDetails.model}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Variant</label>
          <input
            type="text"
            name="variant"
            value={deviceDetails.variant}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Condition</label>
          <input
            type="text"
            name="condition"
            value={deviceDetails.condition}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Remarks</label>
          <textarea
            name="remarks"
            value={deviceDetails.remarks}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full"
            rows={3}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Continue
        </button>
      </form>
    </div>
  );
};

export default IssueCertification;
