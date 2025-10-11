import { formatCurrency, safeFormatCurrency } from '@/lib/format.utility'
import { Coins } from 'lucide-react'
import React from 'react'

type propertyDataProps = {
    title?: string,
    blockChain?: {
        id: string,
        name: string,
    }[],
    value?: number,
    icon?: React.ReactNode,
}
const TerasusryValue = ({title, blockChain, value, icon}: propertyDataProps) => {
    

  return (
    <div>
         <div className="flex h-[155px] border border-gray-200 rounded-lg p-4 flex-col">
            <div className="flex items-center gap-1">
            <Coins size={16}/>
                <h1 className='text-sm font-normal'> {title}</h1>
            </div>
            <div className="">
                <h1 className='text-lg font-bold'> {safeFormatCurrency(value)}</h1>
            </div>
            
            <div className="w-full flex gap-2 mt-2">
              {blockChain?.map((item) => (
                <div key={item.id}>
                    <span className='text-sm text-gray-500 bg-yellow-100 rounded-full px-3 py-1'>
                      {item.name}
                    </span>
                </div>
              ))}
            </div>
         </div>
    </div>
  )
}

export default TerasusryValue