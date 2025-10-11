

import { FormFieldConfig } from '@/components/UseForm/ControllerMap';
import { FieldValues, useFormContext } from 'react-hook-form';

export const formConfig = (): FormFieldConfig[] => {
  const { control  , watch} = useFormContext();
  const totalPropertyValue = watch('totalPropertyValueAfterFees');
  return [
    {
      type: 'number',
      name: 'investmentPerformance.targetCapitalAppreciation',
      control,
      label: 'Annual Target Capital Appreciation',
      placeholder: 'Enter Target Capital Appreciation',
    },
    {
      type: 'number',
      name: 'investmentPerformance.estimatedReturnsAsPerLockInPeriod',
      control,
      label: 'Holding Period (years)',
      placeholder: 'Enter Number of Years',
    },
    {
      type: 'number',
      name: 'investmentPerformance.interestRateonReserves',
      control,
      label: 'Interest Rate on Reserves (%)',
      placeholder: 'Enter the intersest rate',
      rules: {
        required: "Value is required",
        min: {
          value: 0,
          message: "Value must be greater than 0",
        },
        validate: (value: number) => {
          
            if (value > 100) {
              return "Value must be less than or equal to 100";
            }
          
          return true;
        },
      },
    },
  
  ];
};