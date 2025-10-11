import { Users } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { formatCurrency, formatCurrencyWithZero, formatPercentage } from "@/lib/format.utility";

function getInitials(fullName: string) {
  if (!fullName) return "";

  const names = fullName.trim().split(" ");
  const firstInitial = names[0]?.[0] || "";
  const lastInitial = names.length > 1 ? names[names.length - 1][0] : "";

  return (firstInitial + lastInitial).toUpperCase();
}

const InvestorsandActivity = (distributionData: any) => {
  //  console.log(distributionData?.distributionData?.allocations,"distributionData")
  const totalInvestedAmount =
    distributionData?.distributionData?.allocations?.reduce(
      (sum: number, investor: any) => sum + (investor.investedAmount ?? 0),
      0
    ) ?? 0;

  // console.log(totalInvestedAmount, "totalInvestedAmount");
  return (
    <div className="w-full  md pb-5 rounded-xl border ">
      {" "}
      <div className="flex justify-between bg-gradient-to-r from-blue-100 to-blue-50 rounded-t-2xl px-4 py-5 border-b">
        <h1 className="text-lg font-medium flex items-center">
          <Users className="text-blue-500 mr-5 p-1 bg-blue-200 rounded-full h-10" />
          Investors & Activity
        </h1>
      </div>
      <div className="px-5 mt-5">
        <Tabs defaultValue="investors">
          <TabsList className="flex py-5 rounded-sm px-1">
            <TabsTrigger
              className="flex-1 data-[state=active]:text-blue-500 rounded-sm py-1"
              value="investors"
            >
              Investors
            </TabsTrigger>
            <TabsTrigger
              className="flex-1 data-[state=active]:text-blue-500 rounded-sm py-1"
              value="activity"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent
            className="flex flex-col gap-2 my-5 overflow-x-auto"
            value="investors"
          >
            {distributionData?.distributionData?.allocations?.map(
              (investor: any, idx: number) => (
                <div className="flex justify-between border-b py-4">
                  <div className="flex gap-6 items-center">
                    <h1 className="bg-green-100 text-green-600 rounded-full w-10 h-10  text-center flex items-center justify-center font-medium">
                      {getInitials(investor.investors?.fullName)}
                    </h1>
                    <div>
                      <h1 className="text-md font-medium">
                        {investor?.investors?.fullName}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {investor.tokens ?? 0} shares
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <h1 className="text-md font-medium">
                      {formatCurrencyWithZero(investor.investedAmount)}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {formatPercentage(investor.ownershipPercentage)}
                    </p>
                  </div>
                </div>
              )
            )}
          </TabsContent>
          <TabsContent value="activity"></TabsContent>
        </Tabs>
      </div>
      <div className="flex justify-between px-5">
        <p className="text-muted-foreground">
          Total Investment : {formatCurrencyWithZero(totalInvestedAmount ?? 0)}
        </p>
        <Button
          variant="outline"
          className="text-blue-600 border border-blue-200 rounded-sm"
        >
          <Users />
          Manage Investors
        </Button>
      </div>
    </div>
  );
};
export default InvestorsandActivity;
