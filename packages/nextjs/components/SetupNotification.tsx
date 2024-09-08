"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createConsentMessage, createConsentProofPayload } from "@xmtp/consent-proof-signature";
import { useAccount } from "wagmi";
import { signMessage } from "wagmi/actions";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

interface SetupNotificationProps {
  onClose: () => void;
}

const BROADCAST_ADDRESS = process.env.NEXT_PUBLIC_BROADCAST_ADDRESS || "";

const SetupNotification: React.FC<SetupNotificationProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const { address, connector } = useAccount();

  useEffect(() => {
    const checkExistingSetup = async () => {
      if (address) {
        // Check if the user is already subscribed to notifications
        const response = await fetch(`/api/check-subscription?address=${address}`);
        const { isSubscribed } = await response.json();
        setIsSetup(isSubscribed);
      }
    };

    checkExistingSetup();
  }, [address]);

  const setupNotifications = useCallback(async () => {
    if (!address || !connector) {
      alert("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    try {
      // Create consent message and signature
      const timestamp = Date.now();
      const message = createConsentMessage(BROADCAST_ADDRESS, timestamp);
      // const signature = await connector.signMessage({ message });
      const signature = await signMessage(wagmiConfig, { message });
      const payloadBytes = createConsentProofPayload(signature, timestamp);
      const base64Payload = Buffer.from(payloadBytes).toString("base64");

      // Subscribe to notifications
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          broadcastAddress: BROADCAST_ADDRESS,
          consentProof: base64Payload,
        }),
      });

      if (response.ok) {
        setIsSetup(true);
      } else {
        throw new Error("Failed to set up notifications");
      }
    } catch (error) {
      console.error("Error setting up notifications:", error);
      alert("Failed to set up notifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [address, connector]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Setup Notifications</h2>
        {!isSetup ? (
          <>
            <p className="mb-4">Get notified when new certification offers become available in your area.</p>
            <button
              onClick={setupNotifications}
              className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Setting up..." : "Setup Notifications"}
            </button>
          </>
        ) : (
          <p className="mb-4 text-green-600">
            Notifications set up successfully! You&apos;ll be notified about new offers. (Not working, no sub got signed
            up to)
          </p>
        )}
        <button onClick={onClose} className="mt-4 btn btn-secondary w-full">
          Close
        </button>
      </div>
    </div>
  );
};

export default SetupNotification;
