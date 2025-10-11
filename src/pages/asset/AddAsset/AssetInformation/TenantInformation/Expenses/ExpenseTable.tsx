import React from "react";
import { Button } from "@/components/ui/button";
import TableComponent from "@/components/TableComponent";
import { EditIcon, TrashIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ExpenseTableProps {
  fields: any[];
  actionHandlers: {
    onEdit: (item: any) => void;
    onDelete: (item: any) => void;
  };
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ fields, actionHandlers }) => {
  const columns = [
    {
      header: "Expense Type",
      accessorKey: "name",
      cell: (info: { getValue: () => any }) => info.getValue() || "N/A",
      enableResize: true,
      size: 100,
    },
    {
      header: "Value",
      accessorKey: "value",
      cell: (info: { getValue: () => any }) => info.getValue() || "N/A",
      enableResize: true,
      size: 100,
    },
    {
      header: "isPercentage",
      accessorKey: "isPercentage",
      cell: (info: { getValue: () => any }) => {
        const value = info.getValue();
        console.log("isPercentage", value);
        return <Switch id="isPercentage" checked={value} disabled />;
      },
      enableResize: false,
      size: 100,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info: { getValue: () => any }) => {
        const value = info.getValue();
        return <Switch id="status" checked={value} disabled />;
      },
      enableResize: false,
      size: 100,
    },
    {
      header: "Action",
      accessorKey: "action",
      enableResize: false,
      size: 100,
      cell: (info: { row: { original: any }; getValue: () => any }) => {
        const item = info.row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => actionHandlers.onEdit(item)}
            >
              <EditIcon />
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => actionHandlers.onDelete(item)}
            >
              <TrashIcon />
            </Button>
          </div>
        );
      },
    },
  ];

  return <TableComponent columns={columns} data={fields} />;
};

export default ExpenseTable;
