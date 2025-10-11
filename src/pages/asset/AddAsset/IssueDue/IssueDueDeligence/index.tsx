

import { memo } from 'react';
import CustomTabs from '@/components/ui/custom-tab';
import Legal from './Legal';
import Strucutre from './Structure';
import Valuation from './Valuation';

const IssueDueDiligence = memo(() => {
  const dueDiligenceTabs = [
    {
      id: 'legal',
      title: 'Legal',
      component: <Legal />,
    },
    {
      id: 'valuation',
      title: 'Valuation',
      component: <Valuation />,
    },
    {
      id: 'structure',
      title: 'Structure',
      component: <Strucutre />,
    },
  ];

  return (
    <div className='w-full'>
      <CustomTabs tabs={dueDiligenceTabs} defaultTab='legal' />
    </div>
  );
});

export default IssueDueDiligence;
