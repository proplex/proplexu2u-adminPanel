

import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import Loading from '@/components/ui/Loading';
import { useEffect } from 'react';
import { fetchCompanies } from '@/store/features/companySlice';
import Pagination from '@/layout/Pagination';
import CompanyStatus from '@/helpers/CompanyStatus';
import { convertDateAndTimeToLocal } from '@/helpers/global';
import { Button } from '@/components/ui/button';
import TableComponent from '@/components/TableComponent';
import api from '@/lib/httpClient';

function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  // useEffect(() => {
  //   dispatch(fetchCompanies({ page, limit }));
  // }, []);

  const { company, loading, pagination } = useAppSelector(
    (state) => state.company
  );

  // const dispatch = useAppDispatch();
  // const handlePageChange = (page: number) => {
  //   dispatch(fetchCompanies({ page, limit: pagination?.pageSize }));
  //   setSearchParams({ page: page.toString(), limit: limit.toString() });
  // };
  if (loading) {
    return <Loading />;
  }
  const onEdit = (id: number) => {
    navigate(`/edit-company/${id}`);
  };
  const columns = [
    {
      header: 'Company ID',
      accessorKey: 'id',
    },
    
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Created On',
    accessorKey: 'created_at',
  },
  {
    header: 'Total Property',
    accessorKey: 'total_property',
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }: { row: any }) => <CompanyStatus status={row.original.status} companyId={row.original.id} />,
  },
  {
    header: 'Actions',
    accessorKey: 'action',
  },
  ];
  const action = [
    {
      header: 'Edit',
      accessorKey: 'edit',
      icon: <Pencil />,
      onClick: (row: any) => onEdit(row.id),
    },
  ];




  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold text-gray-800'>Companies</h1>
        <Button onClick={() => navigate('/add-spv')}>+ Add Company</Button>
      </div>
      <div className='bg-white rounded-lg shadow overflow-x'>
      
        <TableComponent columns={columns} data={company} />
      </div>
      {/* {pagination && (
        <Pagination pager={pagination} onPageChange={handlePageChange} />
      )} */}
    </div>
  );
}
export default Index;