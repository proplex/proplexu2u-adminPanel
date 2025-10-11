

import Setting from './setting/index';
import Fee from './FeePercentage/Fee';
function Index() {

 

  return (
    <div className='container mx-auto'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold p-4' >Setting</h1>
      </div>
      <Setting />
      <Fee />
    </div>
  );
}

export default Index;
