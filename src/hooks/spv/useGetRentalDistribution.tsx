import api from "@/lib/httpClient";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const useGetRentalDistribution = () => {
  const { id:spvId } = useParams<{ id: string }>();
  const [distribution, setDistribution] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Prevent duplicate fetches
  const fetchRef = useRef(false);

  useEffect(() => {
    if (!spvId || fetchRef.current) return;
    fetchRef.current = true;

    const fetchRentalDistribution = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/assets/rental-distribution/${spvId}/distribution`);
        setDistribution(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to fetch rental distribution");
      } finally {
        setLoading(false);
      }
    };

    fetchRentalDistribution();
  }, [spvId]);

  return {
    distribution,
    error,
    loading,
  };
};

export default useGetRentalDistribution