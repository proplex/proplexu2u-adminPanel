import CardConfig from "@/components/spv/CardConfig";
import Investor from "./Investor";
import useRentalDistribution from "@/hooks/spv/useRentalDistrubution";
import { formatCurrency, formatCurrencyWithZero } from "@/lib/format.utility";
const index = () => {
  const { distribution, loading, error } = useRentalDistribution();
  const totalAmount =
    distribution?.allocations?.reduce(
      (sum: number, investor: any) => sum + (investor.investedAmount ?? 0),
      0
    ) ?? 0;
  if (loading || !distribution) {
    return <p className="p-4">Loading...</p>;
  }
  return (
    <div className="">
      <header className="flex h-16 shrink-0 items-center justify-between p-4">
        <div>
          <h1 className="text-xl font-semibold">Investors</h1>
          <p className="text-sm text-muted-foreground">
            Manage investors and their investments in this SPV
          </p>
        </div>
      </header>
      <div className="grid grid-cols-3 gap-4 p-4">
        <CardConfig
          title="Total Investors"
          value={distribution?.investors.length ?? 0}
        />
        <CardConfig
          title="Total Investment"
          value={formatCurrencyWithZero(totalAmount)}
        />
        <CardConfig title="Average Investment" value={"-"} />
      </div>
      <div className="p-4">
        <Investor distribution={distribution} />
      </div>
    </div>
  );
};

export default index;
