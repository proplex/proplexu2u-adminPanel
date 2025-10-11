import { Button } from '@/components/ui/button'
import { Bell, Calendar, CheckCircle, Download, InfoIcon, MoveLeft, X } from 'lucide-react'
import React from 'react'

const AdminApproval = () => {
  return (
    <div className="flex border p-4 border-gray-200 shadow-md rounded-2xl justify-between items-center mb-6">
   
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-600 hover:text-black"
       
      >
        <InfoIcon className="h-5 w-5" />
      </Button>

      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">
            Admnin Approval Required
        </h1>
        <span className="text-gray-500 text-sm">Please Review this customer's Information and decide to approve or reject</span>
      </div>
    </div>

    <div className="flex gap-2">
      <Button variant="assetButton" className='bg-red-300/40 hover:bg-red-300'>
      <X className='bg-red-50 p-1 rounded-full ' />
      <span> Reject</span>
      </Button>
      <Button variant="assetButton"  className='bg-green-300/40 hover:bg-green-300'>
        <CheckCircle />

        <span> Appprove</span>
      </Button>
    
    </div>
  </div>
  )
}

export default AdminApproval