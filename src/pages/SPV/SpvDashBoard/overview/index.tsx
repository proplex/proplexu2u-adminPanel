import Disturbution from "@/components/spv/Disturbution";
import PropertyData from "@/components/spv/propertyData";
import PropertyValue from "@/components/spv/propertyValue";
import SpvOverviewTabs from "@/components/spv/SpvTabs";
import SpvProperty from "@/components/spv/SpvProperty";
import TerasusryValue from "@/components/spv/TerasusryValue";
import { Button } from "@/components/ui/button";
import { DollarSign, Ellipsis } from "lucide-react";
import SpvTabs from "@/components/spv/SpvTabs";
import TeasureAllocation from "@/components/spv/TeasureAllocation";
import SpvteasureTabs from "@/components/spv/SpvteasureTabs";
import IncomeDistribution from "@/components/spv/IncomeDistribution";
import InvestorsandActivity from "@/components/spv/InvestorsandActivity";
import { useNavigate, useParams } from "react-router-dom";
import { useSpvApi } from "@/hooks/spv/useSpvApi";
import { useEffect, useState } from "react";
import formatDate from "@/constants/formatdate";
import useRentalDistribution from "@/hooks/spv/useRentalDistrubution";
import { useAssetApi } from "@/hooks/asset/useAssetApi";
import SpvOverViewLeft from "@/components/spv/Tabs/SpvOverViewLeft";
import SpvOverViewRight from "@/components/spv/Tabs/SpvOverViewRight";

type spvDashboardRoute = {
  title?: string;
  createdDate?: string;
};
const Index = ({ title, createdDate }: spvDashboardRoute) => {
  const navigate = useNavigate();
  const { id: spvId } = useParams();
  const { getSpv, spv, status } = useSpvApi();
  console.log(spv?.assets?.[0].to, "spv");
  const { distribution, loading, error } = useRentalDistribution();
  // const { assetOverview, getAssetOverview, isPending } = useAssetApi();
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (spvId && !fetched) {
      getSpv(spvId);
      setFetched(true);
    }
  }, [spvId, fetched, getSpv]);

  // useEffect(() => {
  //   if (distribution?.asset?._id) {
  //     getAssetOverview(distribution.asset._id);
  //   }
  // }, [distribution?.asset?._id]);
  // console.log(assetOverview, "assetOverview");
  if (loading || !spv || !distribution) {
    return <p className="p-4">Loading...</p>;
  }
  return (
    <div>
      <div className="m-4 flex justify-between ">
        <div>
          <h1 className="text-2xl font-bold">{spv?.name || "Loading..."}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Created on {formatDate(spv?.createdAt) || "Loading..."}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <Button
            variant="outline"
            className="bg-white text-black hover:bg-black hover:text-white flex items-center gap-2"
          >
            <Ellipsis size={16} />
            <span>Actions</span>
          </Button>

          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-800 flex items-center gap-2"
          >
            <DollarSign size={16} />
            <span>Add Funds</span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 p-4">
        <PropertyData
          title="Property Data"
          currentFunding={
            spv?.assets?.[0]?.totalInvestedAmount ?? 0
          }
          fundingTarget={
            spv?.assets?.[0]?.totalPropertyValueAfterFees ?? 0
          }
        />
  
        <PropertyValue
          title="Property Value"
          value={
            spv?.assets?.[0]?.investmentPerformance?.latestPropertyValue ?? 0
          }
          
        />
        <Disturbution
          title="Disturbution Rate"
          value={70}
          date="June 30, 2023"
        />
      </div>
      <div className="m-4 flex flex-col gap-2 shadow-md rounded-xl">
        <SpvProperty
          name={spv?.assets?.[0]?.name ?? "Unknown Property"}
          address={`${spv?.assets?.[0]?.city ?? ""}${
            spv?.assets?.[0]?.city && spv?.assets?.[0]?.landmark ? ", " : ""
          }${spv?.assets?.[0]?.landmark ?? ""}`}
          onViewDetails={() => console.log("Navigating to details...")}
        />

        <div className="p-4 ">
          <div className="flex gap-4 ">
            <SpvOverViewLeft spv={spv} />
            <SpvOverViewRight
              distribution={distribution}
              spv={spv}
              title="Annual Revenue"
              currentFunding={1500000}
              fundingTarget={1750000}
            />
          </div>
        </div>
      </div>
      {/* <div className="m-4 flex flex-col gap-2 shadow-md rounded-b-xl">
        <TeasureAllocation update="Today" />
        <div className="p-4">
          <SpvteasureTabs />
        </div>
      </div> */}
      <div className="m-4 flex items-start  justify-between gap-5 ">
        <IncomeDistribution distrubutionData={distribution} />
        <InvestorsandActivity distributionData={distribution} />
      </div>
    </div>
  );
};

export default Index;
