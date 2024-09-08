"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RainbowKitCustomConnectButton } from "./scaffold-eth/RainbowKitCustomConnectButton";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [userType, setUserType] = useState("buyer");
  const pathname = usePathname();
  const router = useRouter();

  const toggleUserType = () => {
    const newUserType = userType === "buyer" ? "seller" : "buyer";
    setUserType(newUserType);
    router.push(newUserType === "buyer" ? "/buyer/find-seller" : "/seller/bookings");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-primary text-primary-content shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4">
                <Image src="/logo.png" alt="VerifyMyDevice Logo" width={40} height={40} className="rounded-full" />
              </div>
              <span className="text-xl font-bold">Verify-My-Device, proof of device condition</span>
            </div>
            <div className="flex items-center space-x-4">
              <RainbowKitCustomConnectButton />
              <Link href="/debug" className="btn btn-secondary">
                Debug
              </Link>
              <button onClick={toggleUserType} className="btn btn-secondary">
                Switch to {userType === "buyer" ? "Seller" : "Buyer"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-base-200 shadow-md flex flex-col">
          <div className="flex-grow p-4">
            <h2 className="text-lg font-semibold mb-4">{userType === "buyer" ? "Buyer" : "Seller"} Menu</h2>
            <ul>
              {userType === "buyer" ? (
                <>
                  <li>
                    <Link
                      href="/buyer/find-seller"
                      className={`block py-2 ${
                        pathname === "/buyer/find-seller" ? "text-accent" : "hover:text-accent"
                      }`}
                    >
                      Find Seller
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/buyer/certifications"
                      className={`block py-2 ${
                        pathname === "/buyer/certifications" ? "text-accent" : "hover:text-accent"
                      }`}
                    >
                      My Certifications
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/seller/bookings"
                      className={`block py-2 ${pathname === "/seller/bookings" ? "text-accent" : "hover:text-accent"}`}
                    >
                      Bookings
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/seller/setup-products"
                      className={`block py-2 ${
                        pathname === "/seller/setup-products" ? "text-accent" : "hover:text-accent"
                      }`}
                    >
                      Setup Products
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Buttons at the bottom of the sidebar */}
          <div className="p-4 border-t border-base-300">
            <Link href="/debug" className="btn btn-outline w-full mb-2">
              Debug
            </Link>
            <button
              className={`btn w-full mb-2 ${userType === "seller" ? "btn-primary" : "btn-disabled"}`}
              onClick={() => userType === "seller" && router.push("/seller/create-account")}
              title={userType === "seller" ? "Configure Seller Account" : "Switch to Seller to create an account"}
            >
              Configure Seller Account
            </button>
            <Link href="/" className="btn btn-secondary w-full">
              Back to Landing
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
