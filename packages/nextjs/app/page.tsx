"use client";

import React, { useState } from "react";
import Link from "next/link";

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-2 py-2">
      <h1 className="text-4xl font-bold mb-6 text-center">Welcome to VerifyMyDevice</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">The Trust Solution for Second-Hand Device Markets</h2>
        <p className="mb-4">
          VerifyMyDevice bridges the trust gap in second-hand device markets. We provide a platform for device
          certification, enabling fair prices for sellers and peace of mind for buyers.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-base-200 p-4 rounded-lg">
            <h3 className="font-bold mb-2">For Device Owners</h3>
            <p>
              Find a nearby certification shop to get your device certified. Attach the certification to your listing on
              any marketplace.
            </p>
          </div>
          <div className="bg-base-200 p-4 rounded-lg">
            <h3 className="font-bold mb-2">For Buyers</h3>
            <p>Verify certifications provided by sellers. Make informed decisions based on trustworthy information.</p>
          </div>
          <div className="bg-base-200 p-4 rounded-lg">
            <h3 className="font-bold mb-2">For Certification Shops</h3>
            <p>
              Offer your expertise to certify devices. Set your own prices and earn income by securing marketplaces.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">The Certification Process</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Device owner provides initial device information.</li>
          <li>At the physical location, the owner reviews the device, adding pictures and remarks.</li>
          <li>The certification shop assesses the device independently.</li>
          <li>Both assessments are stored, creating a comprehensive and verifiable certification.</li>
        </ol>
        <p className="mt-4">
          This mutual review system reduces malicious attempts. Any inconsistencies between the owner&apos;s claims and
          the shop&apos;s assessment serve as red flags for potential buyers.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Pricing and Tokens</h2>
        <p>
          Certification shops set their own prices and choose which tokens they accept for payment. This flexibility
          allows shops to adapt to their local market conditions and preferences.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">KYC Requirements for Certification Shops</h2>
        <p>
          To ensure the right incentives and hinder bad actors, certification shops are required to complete a Know Your
          Customer (KYC) process. This allows us to maintain the integrity of our platform and provides a means for
          legal recourse in case of detected fraud.
        </p>
      </section>

      <section className="flex justify-center space-x-8">
        <Link href="/buyer/find-seller" className="btn btn-primary btn-lg">
          I&apos;m a Buyer - Find an Certification Issuer
        </Link>
        <Link href="/seller/create-account" className="btn btn-secondary btn-lg">
          I&apos;m a Seller - Create an Account
        </Link>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Get Notified</h2>
            <p>Modal content for XMTP messaging will be added here.</p>
            <button onClick={() => setIsModalOpen(false)} className="mt-4 btn btn-primary">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
