import { Button } from "@/components/ui/button";
import useRentalDistribution from "@/hooks/spv/useRentalDistrubution";
import { useSpvApi } from "@/hooks/spv/useSpvApi";
import { formatCompactCurrency, formatCurrency } from "@/lib/format.utility";
import { ArrowUp, CircleAlert, DollarSignIcon, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Expense {
  label: string;
  amount: number | string;
}

interface Distribution {
  asset?: {
    rentalInformation?: {
      grossMonthlyRent?: number;
      vacancyRate?: number;
    };
  };
  expenses?: Expense[];
}

type SpvOverViewRightProps = {
  distribution?: Distribution;
  spv?: any;
  title?: string;
  currentFunding?: number;
  fundingTarget?: number;
};

const SpvOverViewRight = ({
  distribution,
  spv,
  title,
  currentFunding = 0,
  fundingTarget = 0,
}: SpvOverViewRightProps) => {
  const progressPercentage =
    fundingTarget > 0 ? (currentFunding / fundingTarget) * 100 : 0;

  // console.log(distribution, "spv in overview ");
  const linkedAssetsData = [
    {
      title: "Total Assets",
      value: "1", // Assuming 'asset' being present means 1 asset, or adjust based on actual structure
    },
    {
      title: "Total Value",
      value: spv?.assets?.[0]?.investmentPerformance?.latestPropertyValue || spv?.assets?.[0]?.totalPropertyValueAfterFees ,
    },
    {
      title: "IRR",
      value: `${spv?.assets?.[0]?.investmentPerformance?.irr?.toFixed(2) ?? 0}%`,
    },
  ];
  const gross = distribution?.asset?.rentalInformation?.grossMonthlyRent ?? 0;
  const totalExpenses = Array.isArray(distribution?.expenses)
    ? distribution.expenses.reduce(
        (sum, e) => sum + (typeof e.amount === "number" ? e.amount : 0),
        0
      )
    : 0;
  const net = gross - totalExpenses;
  return (
    <div className=" w-full flex flex-col gap-4">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold">Key Performance Indicators</h1>
        <Button
          variant="default"
          className="bg-white text-black hover:bg-gray-100"
        >
          <Filter />
          Filter
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-full bg-gray-100 rounded-lg p-4">
          <div className="flex justify-between items-center text-gray-500">
            <h1 className="text-sm font-semibold">Monthly Revenue</h1>
            <Button className="w-2 shadow-none bg-transparent text-black hover:bg-gray-100 cursor-pointer">
              <CircleAlert size={10} />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">
              {formatCurrency(
                distribution?.asset?.rentalInformation?.grossMonthlyRent ?? 0
              )}
            </h1>
            {/* {data?.change &&
              <span className="font-semibold flex items-center text-green-500">
                <ArrowUp size={16} />
                {data?.change}
              </span>
             } */}
          </div>
        </div>
        {distribution?.expenses?.map((data, idx) => (
          <div key={idx} className="w-full bg-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-center text-gray-500">
              <h1 className="text-sm font-semibold">{data.label}</h1>
              <Button className="w-2 shadow-none bg-transparent text-black hover:bg-gray-100 cursor-pointer">
                <CircleAlert size={10} />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">
                {typeof data.amount === "number"
                  ? formatCurrency(data.amount)
                  : data.amount}
              </h1>
              {/* {data?.change &&
              <span className="font-semibold flex items-center text-green-500">
                <ArrowUp size={16} />
                {data?.change}
              </span>
             } */}
            </div>
          </div>
        ))}
        <div className="w-full bg-gray-100 rounded-lg p-4">
          <div className="flex justify-between items-center text-gray-500">
            <h1 className="text-sm font-semibold">Net Operating Income</h1>
            <Button className="w-2 shadow-none bg-transparent text-black hover:bg-gray-100 cursor-pointer">
              <CircleAlert size={10} />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{formatCurrency(net)}</h1>
            {/* {data?.change &&
              <span className="font-semibold flex items-center text-green-500">
                <ArrowUp size={16} />
                {data?.change}
              </span>
             } */}
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-lg p-4">
          <div className="flex justify-between items-center text-gray-500">
            <h1 className="text-sm font-semibold">Occupacy Rate</h1>
            <Button className="w-2 shadow-none bg-transparent text-black hover:bg-gray-100 cursor-pointer">
              <CircleAlert size={10} />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">
              {distribution?.asset?.rentalInformation?.vacancyRate ?? 0}%
            </h1>
            {/* {data?.change &&
              <span className="font-semibold flex items-center text-green-500">
                <ArrowUp size={16} />
                {data?.change}
              </span>
             } */}
          </div>
        </div>{" "}
        <div className="w-full bg-gray-100 rounded-lg p-4">
          <div className="flex justify-between items-center text-gray-500">
            <h1 className="text-sm font-semibold">IRR </h1>
            <Button className="w-2 shadow-none bg-transparent text-black hover:bg-gray-100 cursor-pointer">
              <CircleAlert size={10} />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{spv?.assets?.[0]?.investmentPerformance?.irr?.toFixed(2) ?? 0}%</h1>
            {/* {data?.change &&
              <span className="font-semibold flex items-center text-green-500">
                <ArrowUp size={16} />
                {data?.change}
              </span>
             } */}
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <h1 className="font-semibold text-xl">Linked Assets Summary</h1>
        <div className="flex justify-between">
          {linkedAssetsData?.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-center items-center bg-gray-50 rounded-lg p-4 gap-2"
            >
              <span className="text-2xl font-bold">
                {typeof item.value === "number"
                  ? formatCompactCurrency(item.value)
                  : item.value}
              </span>
              <span className="text-sm text-gray-500">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="p-4 flex flex-col gap-4">
        <h1 className="font-semibold text-xl">Financial Highlights</h1>
        <div className="border bg-gradient-to-r from-[#F9FAFB] to-[#EEF2FF] rounded-xl flex flex-col gap-4 p-4">
          <div className="flex gap-3 items-center">
            <div className="p-2 bg-gray-100 rounded-full">
              <DollarSignIcon className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{title}</p>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{formatCurrency(currentFunding)}</h1>
                <p className="text-sm text-green-500 flex items-center font-semibold">
                  <ArrowUp size={14} />
                  +5.2% YoY
                </p>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs">
                Target: {fundingTarget}
              </span>
              <span className="text-green-600 text-xs">
                {progressPercentage.toFixed(2)}%
              </span>
            </div>
            <div className="w-full h-[6px] bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default SpvOverViewRight;
