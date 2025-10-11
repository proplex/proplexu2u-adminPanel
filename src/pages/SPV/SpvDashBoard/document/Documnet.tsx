import TableComponent from "@/components/TableComponent";
import { data } from "./data";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Document = () => {
  const columns = [
    {
      header: "Document",
      accessorKey: "document",
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Uploaded By",
      accessorKey: "uploadedBy",
    },
    {
      header: "Date",
      accessorKey: "date",
    },
    {
      header: "Size",
      accessorKey: "size",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Action",
      accessorKey: "action",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4 w-full">
        <Input placeholder="Search" type="search" className="flex-1" />
        <Button className="gap-2" variant="default">
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </div>
      <TableComponent columns={columns} data={data} />
    </div>
  );
};

export default Document;
