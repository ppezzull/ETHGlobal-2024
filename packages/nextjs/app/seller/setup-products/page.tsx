"use client";

import React, { useEffect, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { TokenAddress } from "~~/components/scaffold-eth/TokenAddress";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface CertificationProduct {
  id: number;
  deviceType: string;
  price: string;
  tokenAddress: string;
  sellerAddress: string;
}

const SetupProducts: React.FC = () => {
  const { address } = useAccount();

  const [deviceType, setDeviceType] = useState<string>("phone");
  const [price, setPrice] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [products, setProducts] = useState<CertificationProduct[]>([]);

  const { writeContractAsync: createProduct, isPending: isLoading } = useScaffoldWriteContract("VerifyMyDevice");
  const { data: allProducts, refetch: refetchProducts } = useScaffoldReadContract({
    contractName: "VerifyMyDevice",
    functionName: "getAllProducts",
  });

  useEffect(() => {
    if (allProducts && address) {
      const formattedProducts = allProducts
        .map((product: any, index: number) => ({
          id: index,
          deviceType: product.deviceType,
          price: formatEther(product.price),
          tokenAddress: product.tokenAddress,
          sellerAddress: product.sellerAddress,
        }))
        .filter((product: CertificationProduct) => product.sellerAddress.toLowerCase() === address.toLowerCase());
      setProducts(formattedProducts);
    }
  }, [allProducts, address]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createProduct({
        functionName: "createProduct",
        args: [deviceType, parseEther(price || "0"), tokenAddress],
      });
      setPrice("");
      setTokenAddress("");
      refetchProducts();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="container mx-auto px-2 py-2">
      <h1 className="text-3xl font-bold mb-6">Setup Certification Products</h1>
      <form onSubmit={handleSubmit} className="bg-base-200 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="deviceType">
            Device Type
          </label>
          <select
            className="select select-bordered w-full"
            id="deviceType"
            value={deviceType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDeviceType(e.target.value)}
            required
          >
            <option value="phone">Phone</option>
            <option value="laptop">Laptop</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="price">
            Price
          </label>
          <input
            className="input input-bordered w-full"
            id="price"
            type="number"
            step="0.000000000000000001"
            placeholder="0.00"
            value={price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2" htmlFor="tokenAddress">
            Token Address
          </label>
          <input
            className="input input-bordered w-full"
            id="tokenAddress"
            type="text"
            placeholder="0x..."
            value={tokenAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTokenAddress(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button className={`btn btn-primary ${isLoading ? "loading" : ""}`} type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Certification"}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Certification Products</h2>
        {products.length === 0 ? (
          <p>No certification products added yet.</p>
        ) : (
          <ul className="space-y-4">
            {products.map(product => (
              <li key={product.id} className="bg-base-100 shadow-md rounded p-4">
                <h3 className="font-bold">{product.deviceType} Certification</h3>
                <p>
                  Price: {product.price}, <TokenAddress address={product.tokenAddress} />
                </p>
                <p>Token Address: {product.tokenAddress}</p>
                <p>Seller: {product.sellerAddress}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SetupProducts;
