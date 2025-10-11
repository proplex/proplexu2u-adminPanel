import { AddressTypeConfig } from '@/pages/customer/components/helper';

const AdreesComponet = ({ userDetail }: any) => {
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
      <h1 className="text-2xl font-bold">Address Information</h1>
      <AddressTypeConfig title="Present Address" value={fullAddress} />
      <AddressTypeConfig title="Present Address" value={fullAddress} />

    </div>
  );
};

export default AdreesComponet;
