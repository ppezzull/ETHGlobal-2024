"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Booking {
  id: string;
  deviceBrand: string;
  deviceModel: string;
  purchaseDate: string;
  status: "Pending" | "Completed" | "Refunded";
}

const SellerBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      // Simulating an API call or blockchain read
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockBookings: Booking[] = [
        { id: "1", deviceBrand: "Apple", deviceModel: "iPhone 7", purchaseDate: "2023-09-15", status: "Pending" },
        { id: "2", deviceBrand: "Samsung", deviceModel: "Galaxy S21", purchaseDate: "2023-09-20", status: "Pending" },
        { id: "3", deviceBrand: "Google", deviceModel: "Pixel 6", purchaseDate: "2023-08-10", status: "Completed" },
        { id: "4", deviceBrand: "OnePlus", deviceModel: "9 Pro", purchaseDate: "2023-08-05", status: "Refunded" },
      ];

      setBookings(mockBookings);
      setIsLoading(false);
    };

    fetchBookings();
  }, []);

  const sortedBookings = [...bookings].sort((a, b) => {
    if (a.status === "Pending" && b.status !== "Pending") return -1;
    if (a.status !== "Pending" && b.status === "Pending") return 1;
    return 0;
  });

  if (isLoading) {
    return <div className="text-center mt-8">Loading bookings...</div>;
  }

  return (
    <div className="container mx-auto px-2 py-2">
      <h1 className="text-3xl font-bold mb-6">Bookings</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Device</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.purchaseDate}</td>
                <td>
                  {booking.deviceBrand} {booking.deviceModel}
                </td>
                <td>
                  <span
                    className={`
                    ${booking.status === "Completed" ? "text-green-600" : ""}
                    ${booking.status === "Pending" ? "text-yellow-600" : ""}
                    ${booking.status === "Refunded" ? "text-red-600" : ""}
                  `}
                  >
                    {booking.status}
                  </span>
                </td>
                <td>
                  {booking.status === "Pending" && (
                    <>
                      <Link href={`/seller/issue-certification/${booking.id}`} className="btn btn-primary btn-sm mr-2">
                        Issue Certificate
                      </Link>
                      <button className="btn btn-error btn-sm">Refund</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerBookings;
