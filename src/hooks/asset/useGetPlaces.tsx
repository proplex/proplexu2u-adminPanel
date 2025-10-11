import api from "@/lib/httpClient";
import { useState } from "react";

type PlacesParamType = {
  assetId: string;
  lat: string;
  lng: string;
};
export type NearbyPlaces = {
  school: any[];
  gym: any[];
  hospital: any[];
  cinema: any[];
  cafe: any[];
  "police-station": any[];
};

export const useGetPlaces = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean | null>(false);
  const [places, setPlaces] = useState<NearbyPlaces | null>(null);
  const getPlaces = async ({ assetId, lat, lng }: PlacesParamType) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(
        `/assets/real-estate/nearby-location/places?lat=${lat}&lng=${lng}&assetId=${assetId}`
      );
      setPlaces(res.data.data);
      return res.data.data;
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch asset"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { places, loading, getPlaces, error };
};