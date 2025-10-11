import React from 'react'
import Document from './Documnet'
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import CustomTabs from '@/components/ui/custom-tab';
import Financial from './Financial';
import Governance from './Governance';
import Legal from './Legal';
import Investor from './Investor';
import Property from './Property';

const Index = () => {
  const navigate = useNavigate();
  const queryParams = queryString.parse(location.search);
  const tab: string = Array.isArray(queryParams['tab'])
    ? queryParams['tab'][0] || 'all-documents'
    : queryParams['tab'] || 'all-documents';

  const handleTabChange = (newTab: string) => {
    navigate(`?tab=${newTab}`, {
      replace: true,
    });
  };
  const tabs = [
    {
      id: 'all-documents',
      title: 'All Documents',
      component: (
        <div className=''>
          <Document />
        </div>
      ),
    },
    {
      id: 'legal',
      title: 'Legal',
      component: (
        <div className=''>
          <Legal />
        </div>
      ),
    },
    {
      id: 'financial',
      title: 'Financial',
      component: (
        <div className=''>
          <Financial />
        </div>
      ),
    },
    {
      id: 'governance',
      title: 'Governance',
      component: (
        <div className=''>
          <Governance />
        </div>
      ),
    },
    {
      id: 'investor',
      title: 'Investor',
      component: (
        <div className=''>
          <Investor />
        </div>
      ),
    },
    {
      id: 'property',
      title: 'Property',
      component: (
        <div className=''>
          <Property />
        </div>
      ),
    },
  ];

  return (
    <div className=''>
      <header className='flex h-16 shrink-0 items-center justify-between p-4'>
        <div>
          <h1 className='text-xl font-semibold'>SPV Documents</h1>
          <p className='text-sm text-muted-foreground'>
            Manage documents and their investments in this SPV
          </p>
        </div>
      </header>

      <div className='p-4'>
        <CustomTabs
          defaultTab={tab}
          tabs={tabs}
          handleTabChange={handleTabChange}
          aria-label='Governance Proposals'
        />
      </div>
    </div>
  );
};

export default Index;
