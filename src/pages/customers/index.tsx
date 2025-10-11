import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TableComponent from "@/components/TableComponent";
import useInvestors from "@/hooks/useInvestors";
import queryString from "query-string";
import Pagination from "@/layout/Pagination";
import { Copy, MoveRightIcon } from "lucide-react";
import { handleCopy } from "@/helpers/global";
import { Input } from "@/components/ui/input";
import {Button} from "@/components/ui/button";

type Investor = {
  _id: string;
  fullName: string;
  email?: string;
  mobileNumber?: string;
  kycCompleted?: boolean;
};

const Index = () => {
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { getInvestors, pagination, investors } = useInvestors();
  const page = Number(queryParams.page) || 1;
  const limit = Number(queryParams.limit) || 10;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getInvestors({
      page,
      limit,
    });
  }, [page, limit]);

  const onPageChange = (page: number) => {
    navigate(`/investors?page=${page}&limit=${limit}`);
  };

  const onPageSizeChange = (pageSize: number) => {
    navigate(`/investors?page=1&limit=${pageSize}`);
  };

  const filteredUsers = investors.filter((investor: Investor) => {
    const search = searchTerm.toLowerCase();
    return (
      investor.fullName?.toLowerCase().includes(search) ||
      investor.email?.toLowerCase().includes(search) ||
      investor._id?.toLowerCase().includes(search) ||
      investor.mobileNumber?.toLowerCase().includes(search)
    );
  });

  const columns = [
    {
      header: "Investor ID",
      accessorKey: "_id",
      cell: (info: any) => {
        const id = info.getValue();
        return (
          <div className="flex gap-2">
            <Copy
              onClick={() => handleCopy(id)}
              size={4}
              className="text-gray-500 cursor-pointer min-h-4 min-w-4"
            />
            <span className="text-sm truncate">{id}</span>
          </div>
        );
      },
    },
    {
      header: "Investor Name",
      accessorKey: "fullName",
      cell: (info: any) => info.getValue() || "N/A",
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (info: any) => info.getValue() || "N/A",
    },
    {
      header: "Mobile Number",
      accessorKey: "mobileNumber",
      cell: (info: any) => info.getValue() || "N/A",
    },
    {
      header: "KYC Completed",
      accessorKey: "kycCompleted",
      cell: (info: any) => {
        const kycCompleted = info.getValue();
        return(
          <Button variant="ghost" size="icon">

            <MoveRightIcon size={20}  onClick={() => {
              navigate(`/customers-profile/${info.row.original.id}`);
            }}/>
          </Button>
        )
        // return <Checkbox defaultChecked={kycCompleted} disabled />;
      },
    },
  ];

  return (
    <div className="p-2 space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Investors List</h1>{" "}
        <Input
          type="search"
          placeholder="Search"
          className="w-full max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <TableComponent
        columns={columns}
        data={filteredUsers || []}
        model="investor"
      />
      <Pagination
        {...pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default Index;
