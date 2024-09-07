"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [userType, setUserType] = useState("buyer");
  const pathname = usePathname();

  const toggleUserType = () => {
    setUserType(userType === "buyer" ? "seller" : "buyer");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-primary text-primary-content shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold">Smartphone Marketplace</span>
              </div>
            </div>
            <div className="flex items-center">
              <button onClick={toggleUserType} className="btn btn-secondary">
                Switch to {userType === "buyer" ? "Seller" : "Buyer"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-base-200 shadow-md">
          <div className="p-4">
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
            <Link href={userType === "seller" ? "/seller/create-account" : "#"} className="btn btn-primary w-full">
              Create Account
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
