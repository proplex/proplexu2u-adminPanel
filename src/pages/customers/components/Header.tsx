import React from 'react'
import { Bell, Calendar, Download, MoveLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

type HeaderProps = {
  userDetail: any;
};

const Header: React.FC<HeaderProps> = ({ userDetail }) => {
  const navigate = useNavigate()

  return (
    <div className="flex justify-between items-center mb-6">
      {/* Left section: Back + Info */}
      <div className="flex items-center gap-4">
        {/* Go Back */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:text-black"
          onClick={() => navigate(-1)}
        >
          <MoveLeft className="h-5 w-5" />
        </Button>

        {/* User Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold">
            {userDetail?.first_name + " " + userDetail?.last_name || "Default"}
          </h1>
          <span className="text-gray-500 text-sm">Customer ID: 1</span>
        </div>
      </div>

      {/* Right section: Action Buttons */}
      <div className="flex gap-2">
        <Button variant="assetButton">
          <Calendar />
          <span> Schedule Call</span>
        </Button>
        <Button variant="assetButton">
          <Download />
          <span> Export Data</span>
        </Button>
        <Button variant="assetButton">
          <Bell />
        </Button>
      </div>
    </div>
  )
}

export default Header
