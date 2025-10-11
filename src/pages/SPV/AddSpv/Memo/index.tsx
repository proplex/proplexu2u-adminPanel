

import { File } from 'lucide-react';
import FormGenerator from '@/components/UseForm/FormGenerator';
import { formConfig } from './formConfig';
import { useFormContext } from 'react-hook-form';
const index = () => {
  const { control } = useFormContext();
  return (
    <div className='p-4  rounded-lg'>
      <div className='flex items-center gap-2'>
        <File />
        <h1 className='text-2xl font-bold'>Memo & Terms</h1>
      </div>
      <span className='text-sm text-gray-500'>
        Define the terms and conditions for the SPV or LLP
      </span>
      <div className='grid grid-cols-2 gap-4 mt-4'>
        {FormGenerator(formConfig(control))}
      </div>
    </div>
  );
};

export default index;
