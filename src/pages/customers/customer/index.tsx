

import AdminApproval from '../components/AdminApproval';
import CreditScoreConfig from '../components/creditScoreConfig';
import Header from '../components/Header';
import PersonalInfo from '../components/PersonalInfo';
import Risk from '../components/Risk';
import AdreesComponet from '../components/AdreesComponet';
import EmployeeComponet from '../components/Employee';



const Index = () => {
  const getUserProfile = () => {
  }
  return (
    <div>
      <Header userDetail={getUserProfile()} />
      <AdminApproval />
      <div className='grid grid-cols-4 gap-4'>
        <CreditScoreConfig
          title='Credit Score'
          value={getUserProfile()}
        />
        <CreditScoreConfig title='Credit Score' value='700' />
        <CreditScoreConfig title='Verification' value='Verified' />
        <CreditScoreConfig title='Out Standing' value='700' />
      </div>

      <div className="flex  justify-between gap-3">
        <PersonalInfo userDetail={getUserProfile()} />
        <Risk userDetail={getUserProfile()} />
      </div>

      <div className="grid grid-cols-3 gap-4">
      <AdreesComponet userDetail={getUserProfile()} />
      <EmployeeComponet userDetail={getUserProfile()} />
      </div>

    </div>
  );
};

export default Index;
