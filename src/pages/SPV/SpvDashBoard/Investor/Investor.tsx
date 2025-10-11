import React from "react";
import TableComponent from "@/components/TableComponent";
import {
  EditIcon,
  DownloadIcon,
  UserPlusIcon,
  CoinsIcon,
  Calendar,
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
import useRentalDistribution from "@/hooks/spv/useRentalDistrubution";
import { Progress } from "@/components/ui/progress";

const Investor = ({ distribution }: any) => {
  const columns = [
    {
      header: "Investor",
      accessorKey: "investors",
      cell: ({ row }: any) => {
        const investor = row.original.investors;
        return (
          <div className="flex flex-col items-start gap-2">
            <p className="font-medium">{investor?.fullName}</p>
            {/* <p className="text-sm text-muted-foreground">
              {investor?.email ?? "—"}
            </p> */}
            <Badge className="bg-white shadow-none border text-black border-gray-300 rounded-lg">
              Individual
            </Badge>
          </div>
        );
      },
    },
    {
      header: "Investment",
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
      icon: <CoinsIcon className="text-yellow-500" />,
    },
    {
      header: "OwnerShip %",
      accessorKey: "ownershipPercentage",
      cell: ({ row }: any) => {
        const value = row.original.ownershipPercentage;
        return (
          <div>
            <h1>{value}%</h1>
            <Progress className="h-1 w-[70%] mt-2" value={value} />
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: () => <Badge className="rounded-lg">Active</Badge>,
    },
    {
      header: "Join Date",
      accessorKey: "joinDate",
      cell: () => (
        <h1 className="flex items-center">
          <Calendar size={14} className="mr-1" />{" "}
          {new Date().toLocaleDateString()}
        </h1>
      ),
    },
    {
      header: "Action",
      accessorKey: "action",
      type: "action",
      cell: () => (
        <div className="flex items-center gap-2">
          <Eye className="cursor-pointer hover:bg-gray-200 rounded-full h-9 w-9 p-2" />
          <SquarePen className="cursor-pointer hover:bg-gray-200 rounded-full h-9 w-9 p-2" />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex justify-between items-center gap-4 w-full">
        <Input placeholder="Search" type="search" className="flex-1" />
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <DownloadIcon /> Export
        </Button>
        <Button className="gap-2" variant="default">
          <UserPlusIcon /> Add Investor
        </Button>
      </div>

      {/* Table */}
      <TableComponent
        columns={columns}
        data={distribution?.allocations ?? []}
      />
    </div>
  );
};

export default Investor;
