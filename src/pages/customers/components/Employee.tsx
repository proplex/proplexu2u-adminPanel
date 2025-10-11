import InfoItem, { AddressTypeConfig } from '@/pages/customer/components/helper';
import { Building2, Luggage } from 'lucide-react';

const EmployeeComponet = ({ userDetail }: any) => {
  const address = userDetail?.address_as_in_pan;

  const fullAddress = [
    address?.address_line_1,
    address?.address_line_2,
    address?.address_line_3,
    address?.address_line_4,
    address?.address_line_5,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-4 border border-gray-200 p-4 mt-4 rounded-md bg-white shadow-sm">
      <h1 className="text-2xl font-bold">Employment Information</h1>
        <InfoItem 
        icon={<Luggage className="h-5 w-5" />}
        title='Employment Status'
        value={`${userDetail?.is_salaried ? 'Employed' : 'Unemployed'}`}
        />
          <InfoItem 
        icon={<Building2 className="h-5 w-5" />}
        title='Director Status'
        value={`${userDetail?.is_a_director ? 'Director' : 'Not A Director'}`}
        />
          <InfoItem 
        icon={<Luggage className="h-5 w-5" />}
        title='Employment Status'
        value={`${userDetail?.is_a_sole_proprietor ? 'Sole propritier' : 'No'}`}
        />
    </div>
  );
};

export default EmployeeComponet;
