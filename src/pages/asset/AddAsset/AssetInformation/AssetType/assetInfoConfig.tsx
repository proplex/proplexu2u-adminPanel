import { FormFieldConfig } from "@/components/UseForm/ControllerMap";
import {
  ASSET_STYLE,
  CURRENCY_OPTIONS,
  INSTRUMENT_TYPE,
} from "@/constants/global";
import { useFormContext } from "react-hook-form";
import useLocations from "@/hooks/useLocations";

interface Asset {
  country?: string;
  state?: string;
  city?: string;
  metadata?: {
    places?: Record<string, string>;
  };
}

export const assetInfoConfig = ({
  asset,
}: {
  asset: Asset;
}): FormFieldConfig[] => {
  const { cities } = useLocations();
  const { control } = useFormContext();

  const city = asset?.city ?? "";

  return [
    {
      type: "text",
      name: "name",
      control,
      label: "Asset Name",
      rules: { required: "Asset name is required" },
    },
    {
      type: "select",
      name: "style",
      control,
      label: "Asset Style",
      options: ASSET_STYLE,
      rules: { required: "Asset style is required" },
    },
    
    {
      type: "select",
      name: "instrumentType",
      control,
      label: "Instrument Type",
      options: INSTRUMENT_TYPE,
      rules: { required: "Instrument type is required" },
    },
    {
      type: "select",
      name: "country",
      control,
      label: "Country",
      options: [{ label: "Vietnam", value: "VN" }],
      defaultValue: "VN",
      disabled: true
    },
    {
      type: "select",
      name: "city",
      control,
      label: "City",
      options: cities,
      rules: { required: "City is required" },
      defaultValue: city || ""
    },
    {
      type: "text",
      name: "landmark",
      control,
      label: "Landmark",
      rules: { required: "Landmark is required" },
    },
    {
      type: "textarea",
      name: "about",
      control,
      label: "Asset Description",
      className: "w-full col-span-1",
      fullWidth: true,
      rules: { required: "Asset description is required" },
    },
  ];
};
