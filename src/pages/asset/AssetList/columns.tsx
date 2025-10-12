// Extracted columns definition for the AssetList table
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Eye, Maximize } from "lucide-react";
import { formatCompactNumber, handleCopy } from "@/helpers/global";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const getColumns = (setAsset: (asset: any) => void) => [
  {
    header: "Asset Id",
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
    enableResizing: true,
    size: 100,
    maxSize: 200,
  },
  {
    header: "Asset",
    accessorKey: "logo",
    cell: (info: any) => {
      const fallbackLogo =
        "https://andreaslloyd.dk/wp-content/themes/koji/assets/images/default-fallback-image.png";
      const logo = info.getValue() || fallbackLogo;
      const fullName = String(info.row.original?.name ?? "SPV Name");

      return (
        <div className="flex items-center gap-2" title={fullName}>
          <img
            src={logo}
            alt="logo"
            className="w-8 h-8 rounded-full object-cover shrink-0"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackLogo;
            }}
          />
          <div className="flex flex-col truncate">
            <span className="truncate text-sm">{fullName}</span>
            <span className="text-xs text-gray-500 truncate">
              {info.row.original?.city}
            </span>
          </div>
        </div>
      );
    },
    enableResizing: true,
    size: 100,
    maxSize: 200,
  },
  {
    header: "Asset Address",
    accessorKey: "blockchainProjectAddress",
    cell: (info: any) => {
      const row = info.row.original;
      const assetAddress = row.blockchainProjectAddress;

      if (!assetAddress) {
        return <span className="text-gray-500">Not deployed</span>;
      }

      const explorerUrl = `https://testnet.u2uscan.xyz/address/${assetAddress}`;

      return (
        <div className="flex items-center gap-2">
          <Copy
            onClick={() => handleCopy(assetAddress)}
            size={16}
            className="text-gray-500 cursor-pointer hover:text-gray-700"
          />
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm truncate text-blue-500 hover:text-blue-700 underline"
            title={assetAddress}
          >
            {assetAddress.substring(0, 6)}...
            {assetAddress.substring(assetAddress.length - 4)}
          </a>
        </div>
      );
    },
    enableResizing: true,
    size: 200,
    maxSize: 250,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (info: any) => {
      const row = info.row.original;
      const availableTokensToBuy = row.availableTokensToBuy || 0;
      const percentageOfTokensSold = row.percentageOfTokensSold || 0;
      return (
        <Badge className="bg-gray-200 rounded-full text-black hover:bg-gray-200 font-normal">
          <span className="text-sm">{percentageOfTokensSold}% sold </span>
          <span className="text-sm">
            ({formatCompactNumber(availableTokensToBuy || 0)} left)
          </span>
        </Badge>
      );
    },
    size: 70,
    minSize: 70,
    maxSize: 70,
  },
  {
    header: "Tokens",
    accessorKey: "totalTokens",
    cell: (info: any) => {
      const totalTokens = info.getValue();
      const value = formatCompactNumber(totalTokens || 0);
      return <span>{value}</span>;
    },
    size: 30,
    minSize: 30,
    maxSize: 30,
  },
  {
    header: "Investors",
    accessorKey: "uniqueInvestorCount",
    cell: (info: any) => {
      const uniqueInvestorCount = info.getValue();
      const value = formatCompactNumber(uniqueInvestorCount || 0);
      return <span>{value}</span>;
    },
    maxSize: 50,
    size: 40,
    minSize: 40,
  },
  {
    header: "Orders",
    accessorKey: "orderCount",
    cell: (info: any) => {
      const orderCount = info.getValue();
      const value = formatCompactNumber(orderCount || 0);
      return <span>{value}</span>;
    },
    maxSize: 50,
    size: 30,
    minSize: 30,
  },
  {
    header: "Active",
    accessorKey: "status",
    cell: (info: any) => {
      const status = info.getValue();
      const isActive = status === "active";
      return (
        <Switch
          checked={isActive}
          onCheckedChange={() => setAsset(info.row.original)}
        />
      );
    },
    size: 30,
    minSize: 30,
    maxSize: 30,
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: (info: any) => {
      const navigate = useNavigate();
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            type="button"
            onClick={() => {
              navigate(`/edit-asset/${info.row.original._id}`);
            }}
          >
            <Edit className="h-5 w-5 text-gray-600" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            type="button"
            onClick={() => {
              navigate(`/dashborad-asset/${info.row.original._id}`);
            }}
          >
            <Eye className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      );
    },
    enableResizing: false,
    size: 30,
    minSize: 30,
    maxSize: 30,
  },
];

export default getColumns;
