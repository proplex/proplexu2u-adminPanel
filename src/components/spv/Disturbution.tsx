import { Calendar, Percent } from 'lucide-react'
import React from 'react'

type propertyDataProps = {
    title?: string,
    blockChain?: {
        id: string,
        name: string,
    }[],
    date?: string,
    value?: number,
    icon?: React.ReactNode,
}
const Disturbution = ({title, blockChain, value, icon}: propertyDataProps) => {
    const progressPercentage = (32 / 35) * 100

  return (
    <div className="">
         <div className="flex h-[160px] border border-gray-200 rounded-lg p-4 flex-col bg-white hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center gap-2 mb-2">
              <Percent size={16} className="text-blue-500"/>
              <h1 className='text-sm font-medium text-gray-700'>{title}</h1>
            </div>
            <div className="flex justify-between w-full items-center mb-2">
                <h1 className='text-2xl font-bold text-gray-900'>{value}%</h1>
               <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 flex items-center">
                <span className="text-xs font-semibold">
                    + 5% from last quarter
                </span>
               </span>
            </div>
            
            <div className="flex justify-between w-full items-center mb-2">  
             
              <span className='text-sm text-gray-500'> Investment receving</span>
              <span className='text-sm text-gray-500'> 32/35</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 ">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{width: `${progressPercentage}%`}}
              ></div>
            </div>
            <div className="flex justify-between w-full items-center">
           <div className="flex  mt-2">
            <Calendar size={16} className="text-gray-500"/> 
            <span className='text-sm text-gray-500'> 2025-01-01</span>
           </div>
           
            </div>
         </div>
    </div>
  )
}

export default Disturbution