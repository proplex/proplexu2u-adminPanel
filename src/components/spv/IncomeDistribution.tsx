import { Clock, DollarSign } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/lib/format.utility";

function calculateNetIncome(property: any) {
  const rent = property.rent;
  const maintenance = 0.1;
  const propertyManagement = 0.05;
  const platformFee = 0.02;

  const maintenanceCost = rent * maintenance;
  const propertyManagementCost = rent * propertyManagement;
  const platformFeeCost = rent * platformFee;

  const totalExpenses =
    maintenanceCost + propertyManagementCost + platformFeeCost;
  const netIncome = rent - totalExpenses;

  return {
    propertyName: property.name,
    rent,
    expenses: {
      maintenance: maintenanceCost,
      propertyManagement: propertyManagementCost,
      platformFee: platformFeeCost,
    },
    netIncome,
  };
}

const IncomeDistribution = (distrubutionData: any) => {
  return (
    <div className="w-full shadow-md pb-5 rounded-xl">
      <div className="flex justify-between bg-gradient-to-r from-blue-100 to-blue-50 rounded-t-2xl px-4 py-5 border-b">
        <h1 className="text-lg font-medium flex items-center">
          <DollarSign className="text-green-500 mr-5 p-1 bg-green-200 rounded-full h-10" />
          Income & Distribution
        </h1>
        <Button variant="link" className="text-green-500">
          View
        </Button>
      </div>

      {/* Rent Summary */}
      <div className="flex flex-col items-center mt-5">
        <div className="flex justify-between w-[95%] border border-green-100 rounded-lg bg-green-50 p-5">
          <div>
            <h1 className="text-green-500 text-lg font-medium">
              Monthly Rental Income
            </h1>
            <p className="text-muted-foreground">
              {distrubutionData?.distrubutionData?.asset?.name || "......."}
            </p>
          </div>
          <h1 className="text-2xl text-green-500 font-bold">
            {formatCurrency(
              distrubutionData?.distrubutionData?.asset?.rentalInformation
                ?.grossMonthlyRent
            )}
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-4  w-full  mt-6 px-5">
        {distrubutionData?.distrubutionData?.expenses?.map(
          (expense: any, idx: number) => (
            <div key={idx} className="flex justify-between">
              <p className="text-gray-600 font-normal">{expense.label}</p>
              <p className="text-red-600 font-medium">-Ksh {expense.amount}</p>
            </div>
          )
        )}

        <hr className="h-3" />
        <div className="flex justify-between">
          <p className="text-lg font-semibold">Net Distributable Income</p>
          <p className="text-xl font-bold">
            {(() => {
              const gross =
                distrubutionData?.distrubutionData?.asset?.rentalInformation
                  ?.grossMonthlyRent || 0;
              const totalExpenses =
                distrubutionData?.distrubutionData?.expenses?.reduce(
                  (sum: number, e: any) => sum + (e.amount || 0),
                  0
                ) || 0;
              const net = gross - totalExpenses;
              return formatCurrency(net);
            })()}
          </p>
        </div>
        <div className="flex justify-between  border border-gray-200 rounded-xl bg-gray-100 p-5">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-violet-500 text-lg font-medium">
              Next Distribution
            </h1>
            <p className="text-muted-foreground flex items-center gap-1">
              {/* {property?.name || "Downtown Apartment Complex"} */}
              <Clock size={17} /> 1 Nov 2025
            </p>
            <Badge className="px-2 text-xs font-semibold text-violet-500 bg-violet-100  rounded-full border border-gray-200 shadow-none hover:bg-inherit">
              Monthly
            </Badge>
          </div>
          <h1 className="text-2xl text-violet-500 font-bold">
            {formatCurrency(
              distrubutionData?.distrubutionData?.asset?.rentalInformation
                ?.grossMonthlyRent || 0
            )}
          </h1>
        </div>
        <Button className="bg-green-500 hover:bg-green-700 py-6">
          Configure Distribution
        </Button>
      </div>
    </div>
  );
};

export default IncomeDistribution;
