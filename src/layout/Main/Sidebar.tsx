

import React, { useState } from 'react';
import {
  Building2,
  Settings,

  Users2Icon,
  UserCogIcon,
  Star,
  Bell,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileChartColumnIncreasing,
  Package,
  ClipboardList,
  User,
  Layers2,
  Layout,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  href,
  isCollapsed,
}) => (
  <NavLink
    to={href}
    className={({ isActive }) =>
      `flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md 
      ${isActive
        ? 'bg-gray-200 text-gray-900'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      } ${isCollapsed ? 'justify-center' : ''}`
    }
    title={isCollapsed ? label : undefined} // Tooltip when collapsed
  >
    {icon}
    {!isCollapsed && <span>{label}</span>}
  </NavLink>
);

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };
  return (
    <div
      className={`flex flex-col ${isCollapsed ? 'w-16' : 'w-52'} 
      bg-white border-r border-gray-200 
      transition-all duration-300 h-full`}
    >
      <div className='flex-1 overflow-y-auto px-2 py-4 space-y-1'>
        {/* <NavItem
          icon={<LayoutDashboard className='w-5 h-5' />}
          label='Dashboard'
          href='/dashboard'
          isCollapsed={isCollapsed}
        /> */}
          <NavItem
            icon={<Building2 className='w-5 h-5' />}
            label='Spvs'
            href='/spv-list'
            isCollapsed={isCollapsed}
          />
        <NavItem
          icon={<Package className='w-5 h-5' />}
          label='Assets'
          href=''
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<ClipboardList className='w-5 h-5' />}
          label='Orders'
          href='/orders'
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<Users2Icon className='w-5 h-5' />}
          label='Investors'
          href='/investors'
          isCollapsed={isCollapsed}
        />
        {/* <NavItem
          icon={<FileChartColumnIncreasing className='w-5 h-5' />}
          label='Reports'
          href='/report'
          isCollapsed={isCollapsed}
        /> */}
        {/* <NavItem
          icon={<User className='w-5 h-5' />}
          label='Employees'
          href='/dj'
          isCollapsed={isCollapsed}
        /> */}
        {/* <NavItem
          icon={<Star className='w-5 h-5' />}
          label='Reviews'
          href='/review'
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<Bell className='w-5 h-5' />}
          label='Notification'
          href='/notification'
          isCollapsed={isCollapsed}
        /> */}
      </div>

      <div className='border-t border-gray-200 px-2 py-4 space-y-1'>
        {/* <NavItem
          icon={<UserCogIcon className='w-5 h-5' />}
          label='Config'
          href='/config'
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<Settings className='w-5 h-5' />}
          label='Settings'
          href='/settings'
          isCollapsed={isCollapsed}
        /> */}
        <button onClick={handleLogout} className='w-full text-left'>
          <NavItem
            icon={<Bell className='w-5 h-5' />}
            label='Logout'
            href='/sign-in'
            isCollapsed={isCollapsed}
          />
        </button>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className='p-1 hover:bg-gray-100 w-full flex px-2'
        >
          {isCollapsed ? (
            <ChevronRight className='w-5 h-5 mx-auto' />
          ) : (
            <div className='flex gap-2 items-center'>
              <Layout className='w-5 h-5' />
              <span>Collapse</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}


