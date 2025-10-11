import { FormFieldConfig } from '@/components/UseForm/ControllerMap';
import {  useFormContext } from 'react-hook-form';

export const formConfigTwo = (): FormFieldConfig[] => {
  const { control  , watch} = useFormContext();
    const latestPropertyValue = watch('investmentPerformance.latestPropertyValue');
  return [
   
    {
      type: 'number',
      name: 'investmentPerformance.latestPropertyValue',
      control,
      label: 'Latest Property Price', 
      placeholder: 'Enter the latest property price',
    },
    {
        type : 'date',
        name : 'investmentPerformance.latestPropertyValueDate',
        control,
        label : 'Latest Property Price Date',
        placeholder : 'Enter the latest property price date',
        defaultValue : new Date().toISOString().split('T')[0],
        allowFutureDates : true,

    }
  ];
};
