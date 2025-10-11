import TableComponent from "@/components/TableComponent";
import { Badge } from "@/components/ui/badge";
import useGetRentalDistribution from "@/hooks/spv/useGetRentalDistribution";
import {
  Calendar,
  CheckCircle2,
  CoinsIcon,
  Eye,
  SquarePen,
} from "lucide-react";

const Rental = () => {
  const { distribution, loading, error } = useGetRentalDistribution();
  console.log(distribution);
  const columns = [
    {
      header: "Investor Id",
      accessorKey: "investors",
      cell: ({ row }: any) => {
        console.log("Row", row);
        const investor = row.original.investor;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-black">
              {investor?.investorId}
            </span>
            {/* <span className="text-xs text-gray-500">{investor?._id}</span> */}
          </div>
        );
      },
    },
    {
      header: "Investor Name",
      accessorKey: "investors",
      cell: ({ row }: any) => {
        const investor = row.original.investor;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{investor?.investorName}</span>
            {/* <span className="text-xs text-gray-500">{investor?._id}</span> */}
          </div>
        );
      },
    },

    {
      header: "Tokens",
      accessorKey: "tokens",
      cell: ({ row }: any) => {
        const tokens = row.original.tokens;
        return (
          <div className="flex items-center gap-2">
            <CoinsIcon className="w-4 h-4 text-yellow-500" />
            <span>{tokens}</span>
          </div>
        );
      },
    },
    {
      header: "Amount Invested",
      accessorKey: "investedAmount",
      cell: ({ row }: any) => {
        const value = row.original.investedAmount;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-amber-600">VND</span>
            <span>{value}</span>
          </div>
        );
      },
    },
    {
      header: "Ownership Percentage",
      accessorKey: "ownershipPercentage",
      cell: ({ row }: any) => {
        const value = row.original.ownershipPercentage;
        return (
          <div className="flex items-center gap-2">
            <span>{value}%</span>
          </div>
        );
      },
    },
    {
      header: "Amount to be distributed",
      accessorKey: "amount",
      cell: ({ row }: any) => {
        const value = row.original.amount
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-amber-600">VND</span>
            <span>{value}</span>
          </div>
        );
      },
    },
  ];
  return (
    <div className="px-5">
      <TableComponent
        columns={columns}
        data={distribution?.allocations ?? []}
      />
    </div>
  );
};

export default Rental;
