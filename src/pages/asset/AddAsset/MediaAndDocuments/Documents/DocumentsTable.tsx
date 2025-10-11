import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import TableComponent from '@/components/TableComponent';

interface DocumentsTableProps {
  fields: any[];
  setIndex: (index: number) => void;
  setDeleteIndex: (index: number) => void;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({ fields, setIndex, setDeleteIndex }) => {
  const columns = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Description', accessorKey: 'description' },
    { header: 'Document Type', accessorKey: 'type' },
    {
      header: 'Is Protected',
      accessorKey: 'isProtected',
      cell: ({ row }: any) => {
          const rowData = row.original;
        return <Switch checked={rowData} disabled />;
      },
    },
    {
      header: 'Is Active',
      accessorKey: 'isActive',
      cell: ({ row }: any) => {
        const rowData = row.original;
        return <Switch checked={rowData} disabled />;
      },
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: any) => {
        const rowData = row.original;
        return (
          <div className='flex gap-2'>
            <Button
              variant='outline'
              type='button'
              onClick={() => {
                const findIndex = fields.findIndex(
                  (field) => field.document_id === rowData.document_id
                );
                setIndex(findIndex);
              }}
            >
              Edit
            </Button>
            <button
              // variant='outline'
              type='button'
              onClick={() => {
                console.log('rowData', rowData);
                const findIndex = fields.findIndex(
                  (field) => field.document_id === rowData.document_id
                );
                console.log('fields', fields[findIndex]);
                setDeleteIndex(findIndex);
              }}
            >
              Delete
            </button>
          </div>
        );
      },
      size: 400,
      maxSize: 400,
    },
  ];

  return <TableComponent columns={columns} data={fields} model="document" />;
};

export default DocumentsTable;
