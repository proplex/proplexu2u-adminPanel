import { formatCurrency } from "@/lib/format.utility";
import { Calendar, Dot, Home, Layers } from "lucide-react";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";

type SpvOverViewLeftProps = {
  spv: any; // You can replace `any` with a stricter type later
  floors?: number;
  suities?: number;
  lastRenovated?: string;
};

const SpvOverViewLeft: React.FC<SpvOverViewLeftProps> = ({
  spv,
  floors,
  suities,
  lastRenovated,
}) => {
  const asset = spv?.assets?.[0];

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4">
      {/* 🔹 Carousel */}
      <Carousel
        className="w-full max-w-xl relative"
        plugins={[Autoplay({ delay: 2000 })]}
      >
        <CarouselContent>
          {asset?.media?.gallery?.map((img: string, index: number) => (
            <CarouselItem key={index}>
              <Card className="overflow-hidden rounded-lg">
                <CardContent className="p-0 relative">
                  <img
                    src={img}
                    alt={`property-${index}`}
                    className="w-full h-80 object-cover"
                  />
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow rounded-full" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow rounded-full" />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* 🔹 Quick Stats */}
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 flex flex-col gap-2 rounded-md">
          <h1 className="text-lg font-semibold">Quick Stats</h1>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Type:</span>
              <span className="font-semibold text-black">
                {asset?.category
                  ? asset.category.charAt(0).toUpperCase() +
                    asset.category.slice(1)
                  : ""}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Size:</span>
              <span className="font-semibold text-black">
                {asset?.totalNumberOfSfts} sq ft
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Occupancy:</span>
              <span className="font-semibold text-black">
                {asset?.rentalInformation?.vacancyRate ?? 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 flex flex-col gap-2 rounded-md">
          <h1 className="text-lg font-semibold">Financial</h1>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Gross Rental Yield:</span>
              <span className="font-semibold">
                {formatCurrency(
                  asset?.investmentPerformance?.grossRentalYield?.toFixed(2) ?? 0
                )} %
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>IRR:</span>
              <span className="font-semibold text-green-500">
                {asset?.investmentPerformance?.irr?.toFixed(2) ?? 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Property Details */}
      <div className="w-full flex flex-col justify-center gap-4 p-4 bg-gray-50 rounded-md">
        <h1 className="text-xl font-semibold">Property Details</h1>
        <p>{asset?.about}</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white flex items-center gap-4 p-4 rounded-lg text-violet-500 shadow-xs">
            <Layers size={20} />
            <div className="text-black">
              <h1 className="text-sm text-gray-500">Floors</h1>
              <p className="font-semibold">{floors}</p>
            </div>
          </div>
          <div className="bg-white flex items-center gap-4 p-4 rounded-lg text-violet-500 shadow-xs">
            <Home size={20} />
            <div className="text-black">
              <h1 className="text-sm text-gray-500">Suites</h1>
              <p className="font-semibold">{suities}</p>
            </div>
          </div>
          <div className="bg-white flex items-center gap-4 p-4 rounded-lg text-violet-500 shadow-xs">
            <Calendar size={20} />
            <div className="text-black">
              <h1 className="text-sm text-gray-500">Last Renovated</h1>
              <p className="font-semibold">{lastRenovated}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Key Features (from API) */}
      <div className="w-full p-4 bg-gray-50 rounded-md flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Key Features</h1>
        <div className="grid grid-cols-2 gap-4">
          {asset?.features?.map((feature: any) => (
            <div
              key={feature._id}
              className="flex text-violet-500 items-center gap-3 bg-white rounded-lg shadow-xs p-2"
            >
              <Dot size={48} strokeWidth={3} />
              <span className=" font-semibold">{feature.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpvOverViewLeft;