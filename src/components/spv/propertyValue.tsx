import { formatCurrency, safeFormatCurrency } from '@/lib/format.utility'
import { Building2, Coins } from 'lucide-react'
import React from 'react'

type propertyDataProps = {
    title?: string,
    blockChain?: {
        id: string,
        name: string,
    }[],
    value?: number,
    originalValue?: number,
    icon?: React.ReactNode,
}
const PropertyValue = ({title, blockChain, value, originalValue, icon}: propertyDataProps) => {
    const appraisalPercentage = value && originalValue 
        ? ((value - originalValue) / originalValue) * 100 
        : 0;

  return (
    <div>
         <div className="flex h-[155px] border border-gray-200 rounded-lg p-4 flex-col">
            <div className="flex items-center gap-1">
            <Building2 size={16}/>
                <h1 className='text-sm font-normal'> {title}</h1>
            </div>
            <div className="">
                <h1 className='text-lg font-bold'>{formatCurrency(value || 0)}</h1>
            </div>
            
            <div className="w-full  gap-2">
              <span className={`text-sm ${appraisalPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {appraisalPercentage >= 0 ? '+' : ''}{appraisalPercentage.toFixed(2)}% appraisal
              </span>
            </div>
         </div>
    </div>
  )
}

export default PropertyValue