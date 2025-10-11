import api from "@/lib/httpClient";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

interface Location {
  label: string;
  value: string;
}

const VIETNAM_CITIES: Location[] = [
  { label: "Ho Chi Minh City", value: "ho-chi-minh-city" },
  { label: "Hanoi", value: "hanoi" },
  { label: "Da Nang", value: "da-nang" },
  { label: "Hue", value: "hue" },
  { label: "Hoi An", value: "hoi-an" },
  { label: "Nha Trang", value: "nha-trang" },
  { label: "Can Tho", value: "can-tho" },
  { label: "Dalat", value: "dalat" }
];

const useLocations = () => {
  const [cities] = useState<Location[]>(VIETNAM_CITIES);

  return {
    cities,
    countries: [{ label: "Vietnam", value: "VN" }],
    getCountries: async () => {},
    getCities: async () => {},
    loadingState: null
  };
};

export default useLocations;
