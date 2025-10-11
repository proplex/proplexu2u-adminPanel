import { useState } from "react";
import TableComponent from "@/components/TableComponent";
import {
  EditIcon,
  DownloadIcon,
  CoinsIcon,
  CheckCircle,
  CircleAlert,
  Calendar,
  Clock,
  Eye,
  SquarePen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

const Order = ({ distribution }: any) => {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const columns = [
    {
      header: "Investor",
      accessorKey: "investors",
      cell: ({ row }: any) => {
        const investor = row.original.investors;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{investor?.fullName}</span>
            {/* <span className="text-xs text-gray-500">{investor?._id}</span> */}
          </div>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "investedAmount",
      cell: ({ row }: any) => {
        const value = row.original.investedAmount;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-amber-600">Ksh</span>
            <span>{value}</span>
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
      header: "Date",
      accessorKey: "orderDate",
      cell: ({ row }: any) => {
        return (
          <h1 className="flex items-center">
            <Calendar size={13} className="mr-1" />
            {new Date().toLocaleDateString()}
          </h1>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: any) => {
        const value = "Completed";
        return (
          <Badge className="text-xs font-medium px-2 py-1 rounded-full">
            <CheckCircle size={13} className="mr-1" />
            {value}
          </Badge>
        );
      },
    },
    {
      header: "Transaction ID",
      accessorKey: "orderId",
    },
    {
      header: "Action",
      accessorKey: "action",
      type: "action",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Eye className="cursor-pointer hover:bg-gray-200 rounded-full h-9 w-9 p-2"  onClick={() => {
            navigate(`/order-details/${row.original.orderId}`);
          }}/>
          {/* <SquarePen className="cursor-pointer hover:bg-gray-200 rounded-full h-9 w-9 p-2" /> */}

        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4 w-full">
        <Input
          placeholder="Search"
          type="search"
          className="flex-1 shadow-none"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <DownloadIcon /> Export Orders
        </Button>
      </div>

      {/* ✅ mapped allocations */}
      <TableComponent
        columns={columns}
        data={distribution?.allocations ?? []}
      />
    </div>
  );
};

export default Order;