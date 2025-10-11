

import { useState } from 'react';
import type { FormStep } from '../../../types/company';
import StepIndicator from '../../../components/common/StepIndicator';
import RiskAndDisclosures from './RiskAndDisclosures';
import RoyaltyDistribution from './RoyaltyDistribution';
import CompanyInfo from './CompanyInfo';
import BoardMember from './BoardMember';
import { useParams } from 'react-router';
import SpvMemo from './SpvMemo';
import BankDetails from './BankDetails';
import LegalAdvisor from './LegalAdvisors';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import useCreateCompany from '@/hooks/useCreateCompany';
import Loading from '@/components/ui/Loading';
import useFetchCompany from '@/hooks/useFetchCompany';
import useUpdateCompany from '@/hooks/useUpdateCompany';
import toast from 'react-hot-toast';
import AdditionalInfo from './AdditionalInfo';

const steps: FormStep[] = [
  { id: 'company-info', title: 'Company Info' },
  { id: 'spv-memo', title: 'SPV Memo' },
  { id: 'bank-details', title: 'Bank Details' },
  { id: 'royalty-distributions', title: 'Royalty Distributions' },
  { id: 'risk-disclosure', title: 'Risk & Disclosure' },
  { id: 'board-member', title: 'Board Members' },
  { id: 'legal-advisors', title: 'Legal Advisors' },
  { id: 'additional-info', title: 'Additional Info' },
];

function Index() {
  const { id = null } = useParams();
  const methods = useForm();
  const { loading: fetchLoading } = useFetchCompany(id, methods.reset);
  const { createCompany, loading: createLoading } = useCreateCompany();
  const { updateCompany } = useUpdateCompany();
  const [currentStep, setCurrentStep] = useState(steps[0].id);

  const renderStepContent = () => {
    switch (currentStep) {
      case 'company-info':
        return <CompanyInfo />;
      case 'spv-memo':
        return <SpvMemo />;
      case 'bank-details':
        return <BankDetails />;
      case 'royalty-distributions':
        return <RoyaltyDistribution />;
      case 'risk-disclosure':
        return <RiskAndDisclosures />;
      case 'board-member':
        return <BoardMember />;
      case 'legal-advisors':
        return <LegalAdvisor />;
      case 'additional-info':
        return <AdditionalInfo  />;
      default:
        return null;
    }
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex !== -1 && currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    } else {
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    const { llp_agreement_copy_file, ...rest } = data;
    const payload = {
      ...rest,
      llp_agreement_copy: llp_agreement_copy_file,
    };
    if (!id) {
      await createCompany(payload)
        .then((res: any) => {
          if (res) {
            nextStep();
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message || '');
        });
    } else {
      await updateCompany(id, payload)
        .then((res: any) => {
          if (res) {
            nextStep();
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message || '');
        });
    }
  };

  if (createLoading || fetchLoading) {
    return <Loading />;
  }

  const changeStep = (step: string) => {
    setCurrentStep(step);
  };

  const disabledSteps = !id
    ? [
        'spv-memo',
        'bank-details',
        'risk-disclosure',
        'board-member',
        'legal-advisors',
      ]
    : [];

  return (
    <div className='p-8 flex gap-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-800 mb-8'>
          {id ? 'Update' : 'Create'} Company
        </h1>
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          changeStep={changeStep}
          disabledSteps={disabledSteps}
        />
      </div>
      <FormProvider {...methods}>
        <form
          className='bg-white rounded-lg shadow p-6 w-full'
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          {renderStepContent()}
          <div className='py-4 flex justify-between'>
            <Button
              type='button'
              variant='outline'
              disabled={currentStep === 'company-info'}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button type='submit'>
              {currentStep === 'legal-advisors' ? 'Submit' : 'Next'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
export default Index;
