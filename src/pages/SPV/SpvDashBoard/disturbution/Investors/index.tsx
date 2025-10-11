import React from "react";
import InvestorsActivity from "./invest"; // adjust path if needed
import useRentalDistribution from "@/hooks/spv/useRentalDistrubution";

const Index = () => {
  const { distribution, loading, error } = useRentalDistribution();

  if (loading) return <p>Loading investors...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!distribution) return <p>No investor data available</p>;

  // ✅ Map allocations into InvestorsActivity format
  const investorsData =
    distribution?.allocations?.map((alloc: any, idx: number) => {
      const fullName = alloc?.investors?.fullName ?? "Unknown";
      const initials =
        fullName
          .trim()
          .split(" ")
          .filter(Boolean) // remove empty strings
          .map((n: string) => n[0])
          .join("") || "NA";

      return {
        id: idx + 1,
        initials,
        name: fullName,
        shares: alloc?.tokens ?? 0, // tokens booked
        investment: alloc?.investedAmount ?? 0, // invested amount
        percentage: alloc?.ownershipPercentage ?? 0, // ownership %
        status: alloc?.status ?? "Completed", // fallback if API doesn't return status
        avatar: alloc?.investors?.avatar ?? null, // if available
        bgColor: "bg-blue-100",
      };
    }) ?? [];

  return (
    <div>
      <div className="border rounded-md p-2">
        <InvestorsActivity investorsData={investorsData} />
      </div>
    </div>
  );
};

export default Index;
