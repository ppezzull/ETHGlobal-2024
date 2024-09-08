"use client";

import React, { useState } from "react";

interface CertificationProduct {
  id: number;
  type: "Phone" | "Laptop";
  price: string;
  token: string;
  date: string;
}

const SetupProducts: React.FC = () => {
  const [type, setType] = useState<"Phone" | "Laptop">("Phone");
  const [price, setPrice] = useState<string>("");
  const [token, setToken] = useState<string>("USDT");
  const [products, setProducts] = useState<CertificationProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate an async operation (like a contract interaction)
    setTimeout(() => {
      const newProduct: CertificationProduct = {
        id: Date.now(),
        type,
        price,
        token,
        date: new Date().toISOString(),
      };

      setProducts(prevProducts => [...prevProducts, newProduct]);
      setPrice("");
      setIsLoading(false);
    }, 1000); // Simulate a 1-second delay
  };

  return (
    <div className="container mx-auto px-2 py-2">
      <h1 className="text-3xl font-bold mb-6">Setup Certification Products</h1>
      <form onSubmit={handleSubmit} className="bg-base-200 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="type">
            Type
          </label>
          <select
            className="select select-bordered w-full"
            id="type"
            value={type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value as "Phone" | "Laptop")}
            required
          >
            <option value="Phone">Phone</option>
            <option value="Laptop">Laptop</option>
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
            step="0.01"
            placeholder="0.00"
            value={price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2" htmlFor="token">
            Token
          </label>
          <input
            className="input input-bordered w-full"
            id="token"
            type="text"
            placeholder="e.g. USDT"
            value={token}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)}
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
                <h3 className="font-bold">{product.type} Certification</h3>
                <p>
                  Price: {product.price} {product.token}
                </p>
                <p>Added: {new Date(product.date).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SetupProducts;
