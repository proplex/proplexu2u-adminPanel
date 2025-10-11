
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Sidebar from './Sidebar';
import Footer from '../Footer';

const Main: React.FC = () => {
  return (
    <div className=' flex flex-col w-full'>
      {/* Fixed Header */}
      <div className='fixed top-0 left-0 right-0 z-50'>
        <Header />
      </div>

      {/* Sidebar + Content */}
      <div className='flex pt-16 overflow-hidden h-screen relative w-full'>
        {/* Sidebar */}
        <aside>
          <Sidebar />
        </aside>

        {/* Main content */}
        <div className='flex flex-col w-full h-full'>
          {/* Content area with scroll */}
          <main className='p-4 overflow-y-auto flex-1'>
            <Outlet />
          </main>
          {/* Footer at the bottom */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Main;
