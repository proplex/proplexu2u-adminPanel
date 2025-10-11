

import TableComponent from '@/components/TableComponent';
import Vote from './Vote';

const columns: any = [
  {
    accessorKey: 'id',
    header: 'ID',
    type: 'string',
  },
  {
    accessorKey: 'title',
    header: 'Title',
    type: 'string',
  },
  {
    accessorKey: 'proposer',
    header: 'Proposer',
    type: 'string',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    type: 'string',
  },
  {
    accessorKey: 'timeReamaining',
    header: 'Time Remaining',
    type: 'string',
  },
  {
    accessorKey: 'action',
    header: 'Action',
    type: 'action',
  },
];

const Active = () => {
  const data: {
    id: string;
    title: string;
    proposer: string;
    timeReamaining: string;
    status: string;
  }[] = [
    {
      id: '1',
      title: 'Proposa 1',
      proposer: '0x1234567890abcdef',
      timeReamaining: '2 days',
      status: 'Active',
    },
  ];
  const action = [
    {
      header: 'Vote',
      accessorKey: 'vote',
      onClick: (row: any) => {
        console.log(row, 'row');
      },
      text: <Vote />,
    },
  ];

  return <TableComponent columns={columns} data={data} />;
};
export default Active;
