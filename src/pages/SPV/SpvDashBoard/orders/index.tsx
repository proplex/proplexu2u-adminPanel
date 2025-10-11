import CardConfig from '@/components/spv/CardConfig';
import Order from './Order';
import useRentalDistribution from '@/hooks/spv/useRentalDistrubution';
import { formatCurrencyWithZero } from '@/lib/format.utility';

const Index = () => {
   const { distribution, loading, error } = useRentalDistribution();
   const totalAmount = distribution?.allocations?.reduce(
      (sum: number, investor: any) => sum + (investor.investedAmount ?? 0),
      0
    ) ?? 0;
   if(loading || !distribution){
    return <p className='p-4'>Loading...</p>
}
  return (
    <div className=''>
      <header className='flex h-16 shrink-0 items-center justify-between p-4'>
        <div>
          <h1 className='text-xl font-semibold'>Orders</h1>
          <p className='text-sm text-muted-foreground'>
            Manage orders and their investments in this SPV
          </p>
        </div>
      </header>
      <div className='grid grid-cols-3 gap-4 p-4'>
        <CardConfig title='Total Orders' value={distribution?.allocations?.length ?? 0} />
        <CardConfig title='Total Amount ' value={formatCurrencyWithZero(totalAmount)} />
        <CardConfig title='Pending Orders' value="-" />
      </div>
      <div className='p-4'>
        <Order 
        distribution={distribution}
        />
      </div>
    </div>
  );
};

export default Index;
