import React from 'react'
import { DollarSignIcon } from 'lucide-react'
import { formatCurrency } from '@/lib/format.utility'
type propertyDataProps = {
    title?: string,
    currentFunding?: number,
    fundingTarget?: number,
    icon?: React.ReactNode,
}

const PropertyData = ({title, currentFunding = 0, fundingTarget = 0, icon}: propertyDataProps) => {
    
// const progressPercentage = (currentFunding / fundingTarget) * 100
const progressPercentage = fundingTarget > 0 ? (currentFunding / fundingTarget) * 100 : 0;

  return (
    <div>
         <div className="flex border border-gray-200 rounded-lg p-4  flex-col ">
            <div className="flex items-center gap-1">
            
            <h1 className='text-sm font-normal'> {title}</h1>
            </div>
            <div className="">  
              <h1 className='text-lg font-bold'>
                 {formatCurrency(currentFunding)}
              </h1>
              <span className='text-sm text-gray-500'> Funding Target: </span>
              <span className='text-sm text-gray-500'>  {formatCurrency(fundingTarget)} </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{width: `${progressPercentage}%`}}
              ></div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {progressPercentage.toFixed(2)}% funded
            </div>
         </div>
    </div>
  )
}

export default PropertyData