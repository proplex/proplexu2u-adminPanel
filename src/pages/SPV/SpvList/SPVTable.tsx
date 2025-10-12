import React from "react";
import TableComponent from "@/components/TableComponent";
import { Switch } from "@/components/ui/switch";
import { CURRENCY_OPTIONS, SPV_TYPES } from "@/constants/global";
import { formatCompactNumber, handleCopy } from "@/helpers/global";
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { Copy, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { useContract } from '@/stores/contractStore';
import { useWallet } from '@/stores/walletStore';
import { toast } from 'react-hot-toast';
import api from '../../../lib/httpClient';

interface SPVTableProps {
  data: any[];
  setSpv: (spv: any) => void;
}

const SPVTable: React.FC<SPVTableProps> = ({ data, setSpv }) => {
  console.log(data);
  const navigate = useNavigate();
  // const { sdk, isInitialized } = useContract();
  const { address } = useWallet();

  const handleToggleSPV = async (spv: any, isActive: boolean) => {
    if (!spv?._id) {
      toast.error('Invalid SPV data');
      return;
    }

    const loadingToast = toast.loading(isActive ? 'Activating SPV...' : 'Deactivating SPV...');

    try {
      // Call the API to update the SPV status
      const response = await api.put(`/company/${spv._id}`, {
        status: isActive ? 'active' : 'inactive'
      });

      // Update the local state with the updated SPV data
      setSpv(response.data);
      
      toast.success(`SPV ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      console.error('Error toggling SPV status:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update SPV status';
      toast.error(errorMessage);
      
      // Revert the toggle if the API call fails
      setSpv({ ...spv, status: isActive ? 'inactive' : 'active' });
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const columns: ColumnDef<any, any>[] = [
    {
      header: "Spv Id",
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
      header: "Name",
      accessorKey: "logo",
      cell: (info: any) => {
        const fallbackLogo =
          "https://andreaslloyd.dk/wp-content/themes/koji/assets/images/default-fallback-image.png";
        const logo = info.getValue() || fallbackLogo;
        const fullName = String(info.row.original?.name ?? "SPV Name");
        return (
          <div
            className="flex items-center gap-2 max-w-[220px]"
            title={fullName}
          >
            <img
              src={logo}
              alt="logo"
              className="w-8 h-8 rounded-full object-cover shrink-0"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackLogo;
              }}
            />
            <span className="truncate text-sm">{fullName}</span>
          </div>
        );
      },
      enableResizing: true,
      size: 150,
      minSize: 100,
      maxSize: 150,
    },
    {
      header: "Type",
      accessorKey: "type",
      enableResizing: true,
      size: 100,
      cell(info: any) {
        const type = info.getValue();
        return (
          <>
            {SPV_TYPES.map((option) => {
              if (option.value === type) {
                return <>{option.label}</>;
              }
              return null;
            })}
          </>
        );
      },
    },
    {
      header: "Total Investors",
      accessorKey: "totalInvestors",
      enableResizing: true,
      size: 100,
      cell: (info: any) => {
        const row = info.getValue();
        const value = formatCompactNumber(row || 0);
        return <span>{value}</span>;
      },
    },
    {
      header: "AUM",
      accessorKey: "aum",
      enableResizing: true,
      size: 100,
      cell: (info: any) => {
        const aum = info.getValue();
        const { currency } = info.row.original;
        const fallbackCurrency = CURRENCY_OPTIONS.find(
          (option) => option.value === currency
        )?.label
        const value = formatCompactNumber(aum || 0);
        return <span>{value} {fallbackCurrency}</span>;
      },
    },
    {
      header: "Last Activity",
      accessorKey: "updatedAt",
      enableResizing: true,
      size: 100,
      cell: (info: any) => {
        const date = new Date(info.getValue());
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    {
      header: "Blockchain Address",
      accessorKey: "spvAddress",
      enableResizing: true,
      size: 200,
      cell: (info: any) => {
        const address = info.getValue();
        if (!address) return <span className="text-gray-400">Not deployed</span>;
        
        // Use the address directly for U2U testnet explorer
        const explorerUrl = `https://testnet.u2uscan.xyz/address/${address}`;

        return (
          <div className="flex gap-2">
            <Copy
              onClick={() => handleCopy(address)}
              size={4}
              className="text-gray-500 cursor-pointer min-h-4 min-w-4"
            />
            <a 
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm truncate text-blue-500 hover:text-blue-700 underline"
              title={address}
            >
              {address.substring(0, 6)}...{address.substring(address.length - 4)}
            </a>
          </div>
        );
      },
    },

        {
      header: "Active",
      accessorKey: "status",
      enableResizing: true,
      size: 100,
      maxSize: 100,
      minSize: 100,
      cell: (info: any) => {
        const status = info.getValue();
        console.log("status", status);
        const isActive = status === "active";
        return (
          <Switch
            checked={isActive}
            onCheckedChange={() => setSpv(info.row.original)}
          />
        );
      },
    },
    {
      header: "View",
      accessorKey: "actions",
      enableResizing: false,
      size: 80,
      cell: (info: any) => {
        return (
          <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            type="button"
            onClick={() => navigate(`/edit-spv/${info.row.original._id}`)}
          >
            <Pencil className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            type="button"
            onClick={() => navigate(`/spv/${info.row.original._id}/overview`)}
          >
            <Eye className="h-5 w-5" />
          </Button>
          </div>
        );
      },
    },
  ];

  // Pass custom header styles to the TableComponent
  const tableProps = {
    columns,
    data,
    model: "spv",
    headerClassName: "bg-black text-white"
  };

  return <TableComponent {...tableProps} />;
};

export default SPVTable;