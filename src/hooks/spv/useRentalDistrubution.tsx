import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/httpClient";

// --- Types from API ---
interface Investor {
  tokensBooked: number;
  totalOrderValue: number;
  totalFeePaid: number;
  investorId: string;
  fullName: string;
  email: string;
  avatar?: string;
}

interface Allocation {
  orderId: string;
  ownershipPercentage: number;
  tokens: number;
  amount: number;
  cumulativeEarnings: number;
  investedAmount: number;
  investors: Investor;
}

interface Expense {
  label: string;
  amount: number;
  code: string;
}

interface RentalInformation {
  expenses: {
    monthlyExpenses: number;
    annualExpenses: number;
  };
  rentPerSft: number;
  vacancyRate: number;
  grossMonthlyRent: number;
  netMonthlyRent: number;
  grossAnnualRent: number;
  netAnnualRent: number;
  netCashFlow: number;
}

interface TokenInformation {
  tokenSupply: number;
}

interface Asset {
  _id: string;
  name: string;
  rentalInformation: RentalInformation;
  tokenInformation: TokenInformation;
  totalInvestedAmount: number;
}

interface TotalAmountInvested {
  _id: string | null;
  totalAmountInvested: number;
}

interface RentalDistributionData {
  asset: Asset;
  expenses: Expense[];
  investors: Investor[];
  totalAmountInvested: TotalAmountInvested[];
  allocations: Allocation[];
}

// --- Custom Hook ---
const useRentalDistribution = () => {
  const { id } = useParams<{ id: string }>();
  const [distribution, setDistribution] = useState<RentalDistributionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Prevent duplicate fetches
  const fetchRef = useRef(false);

  useEffect(() => {
    if (!id || fetchRef.current) return;
    fetchRef.current = true;

    const fetchRentalDistribution = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/assets/rental-distribution/${id}/assets`);
        setDistribution(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to fetch rental distribution");
      } finally {
        setLoading(false);
      }
    };

    fetchRentalDistribution();
  }, [id]);

  return {
    distribution,
    error,
    loading,
  };
};

export default useRentalDistribution;
