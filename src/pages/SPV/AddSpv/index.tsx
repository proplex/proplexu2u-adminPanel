

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';
import { SPV_TABS } from '@/constants/global';
import queryString from 'query-string';
import BasicInformation from './BasicInformation';
import Memo from './Memo';
import Escrow from './Escrow';
import LegalDocuments from './LegalDocuments';
import BoardMembers from './BoardMembers';
import { useSpvApi } from '@/hooks/spv/useSpvApi';
import { Stepper } from '@/components/stepper';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  ClipboardCheck,
  FileSignature,
  FileText,
  Save,
  Users,
  Wallet2,
} from 'lucide-react';
import DAOCreation from './DAO';

function Index() {
  const { getSpv, createSpv, updateSpv, spv } = useSpvApi();
  const { id = null } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm<any>({
    defaultValues: {
      completedSteps: [],
      boardOfDirectors: {
        treasuryManager: {
          name: null,
          email: null,
          phoneNumber: null,
          idNumber: null,
          idProof: null,
        },
        assetManager: {
          name: null,
          email: null,
          phoneNumber: null,
          idNumber: null,
          idProof: null,
        },
        additionalBoardMembers: [],
      },
    },
  });

  const { watch } = methods;
  const completedSteps = watch('completedSteps') || [];

  useEffect(() => {
    if (id) {
      getSpv(id);
    }
  }, [id]);

  useEffect(() => {
    if (spv) {
      methods.reset(spv);
    }
  }, [spv]);

  const step = (queryParams['step'] as string) || 'basic-information';
  const tab: string = Array.isArray(queryParams['tab'])
    ? queryParams['tab'][0] || 'basic-information'
    : queryParams['tab'] || 'basic-information';

  const renderStepContent = useMemo(() => {
    switch (step) {
      case 'basic-information':
        return (
          <Suspense fallback={<Loading />}>
            <BasicInformation />
          </Suspense>
        );
      case 'memo-terms':
        return (
          <Suspense fallback={<Loading />}>
            <Memo />
          </Suspense>
        );
      case 'escrow-bank-details':
        return (
          <Suspense fallback={<Loading />}>
            <Escrow />
          </Suspense>
        );
      case 'legal-documents':
        return (
          <Suspense fallback={<Loading />}>
            <LegalDocuments />
          </Suspense>
        );
      case 'board-members':
        return (
          <Suspense fallback={<Loading />}>
            <BoardMembers />
          </Suspense>
        );
      // case 'dao-integration':
      //   return (
      //     <Suspense fallback={<Loading />}>
      //       <DAOCreation />
      //     </Suspense>
      //   );
      default:
        return <div />;
    }
  }, [step, tab]);

  const handleBack = () => {
    const currentIndex = SPV_TABS.findIndex((ele) => ele.id === step);
    if (currentIndex > 0) {
      navigate(`/edit-spv/${id}?step=${SPV_TABS[currentIndex - 1].id}`);
    }
  };

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    setIsLoading(true);
    const payload = { ...data  };
    try {
      if (id) {
        payload.completedSteps = completedSteps.includes(step)
          ? completedSteps
          : [...completedSteps, step];
        await updateSpv(id, payload);
      } else {
        payload.completedSteps = [step];
        await createSpv(payload);
      }
    } catch (error: any) {
      console.error(error.response?.data?.message || 'SPV save failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    setIsLoading(true);
    const data = methods.getValues();
    const isValid = await methods.trigger();
    if (!isValid) {
      setIsLoading(false);
      return;
    }
    const payload = { ...data };
    try {
      if (id) {
        payload.completedSteps = completedSteps.includes(step)
          ? completedSteps
          : [...completedSteps, step];
        await updateSpv(id, payload);
        const currentIndex = steps.findIndex((ele) => ele.id === step);
        if (currentIndex < steps.length - 1) {
          const nextStep = steps[currentIndex + 1].id;
          navigate(`/${id ? `edit-spv/${id}` : 'add-spv'}?step=${nextStep}`);
        }
      } else {
        payload.completedSteps = [step];
        await createSpv(payload);
        console.log(payload);
      }

    } catch (error: any) {
      console.error(error.response?.data?.message || 'SPV save failed');
    } finally {
      setIsLoading(false);
    }
  };
   
  const handleNext2 = async () => {
    setIsLoading(true);
;
    try {
      if (id) {
       
        const currentIndex = steps.findIndex((ele) => ele.id === step);
        if (currentIndex < steps.length - 1) {
          const nextStep = steps[currentIndex + 1].id;
          navigate(`/${id ? `edit-spv/${id}` : 'add-spv'}?step=${nextStep}`);
        }
      } 
    } catch (error: any) {
      console.error(error.response?.data?.message || 'SPV save failed');
    } finally {
      setIsLoading(false);
    }
  };

  const changeStep = (step: string) => {
    navigate(`/${id ? `edit-spv/${id}` : 'add-spv'}?step=${step}`);
  };

  const steps = useMemo(
    () => [
      {
        id: 'basic-information',
        title: 'Basic Information',
        description: 'Company details',
        icon: <FileText className='h-5 w-5' />,
        completed: id ? true : false,
      },
      {
        id: 'memo-terms',
        title: 'Memo & Terms',
        description: 'Legal agreements',
        icon: <FileSignature className='h-5 w-5' />,
        disabled: !id,
        completed: id ? completedSteps.includes('memo-terms') : false,
      },
      {
        id: 'escrow-bank-details',
        title: 'Custodian Wallet Details',
        description: 'Financial information',
        icon: <Building2 className='h-5 w-5' />,
        disabled: !id || !completedSteps.includes('memo-terms'),
        completed: id ? completedSteps.includes('escrow-bank-details') : false,
      },
      {
        id: 'legal-documents',
        title: 'Legal Documents',
        description: 'Required paperwork',
        icon: <ClipboardCheck className='h-5 w-5' />,
        disabled: !id || !completedSteps.includes('escrow-bank-details'),
        completed: id ? completedSteps.includes('legal-documents') : false,
      },
      {
        id: 'board-members',
        title: 'LLP Partners',
        description: 'Leadership team',
        icon: <Users className='h-5 w-5' />,
        disabled: !id || !completedSteps.includes('legal-documents'),
        completed: id ? completedSteps.includes('board-members') : false,
      },
      // {
      //   id: 'dao-integration',
      //   title: 'DAO Integration',
      //   description: 'Blockchain setup',
      //   icon: <Wallet2 className='h-5 w-5' />,
      //   disabled: !id || !completedSteps.includes('board-members'),
      //   completed: id ? completedSteps.includes('dao-integration') : false,
      // },
    ],
    [id, completedSteps]
  );

  const isLastStep = useMemo(() => {
    const currentIndex = steps.findIndex((ele) => ele.id === step);
    return currentIndex === steps.length - 1;
  }, [step, steps]);

  const isFirstStep = useMemo(() => {
    const currentIndex = steps.findIndex((ele) => ele.id === step);
    return currentIndex === 0;
  }, [step, steps]);

  const navigateSpvsList = () => {
    navigate('/spv-list');
  };

  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-900 tracking-tight'>
            {id ? 'Update' : 'Create'} SPV
          </h1>
          <Button onClick={navigateSpvsList} variant='outline'>
            <span className='flex items-center gap-2'>
              <ArrowLeft className='h-4 w-4' />
              Back to SPV List
            </span>
          </Button>
        </div>
        <FormProvider {...methods}>
          <form className='space-y-4' onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Stepper Container - Added consistent width container */}
            <div className='max-w-full'>
              <Stepper
                steps={steps}
                currentStepId={step}
                onStepChange={changeStep}
              />
            </div>
            <div className='border border-gray-200 rounded-lg max-w-[100%] mx-auto'>
              {renderStepContent}
            </div>
            <div className='px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center'>
              <Button
                aria-disabled={isFirstStep}
                type='button'
                variant='outline'
                disabled={isFirstStep}
                onClick={handleBack}
                className={`
                  px-3 py-2 transition-all duration-200
                  ${
                    step === 'basic-information'
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-100 hover:border-gray-400'
                  }
                `}
              >
                <ArrowLeft className='mr-2' />
                Back
              </Button>

              <div className='flex items-center gap-4'>
                <Button
                  type='submit'
                  className='px-3 text-white transition-colors duration-200 flex items-center gap-2'
                  disabled={isLoading}
                  onClick={handleNext}

                >
                  <Save />
                  {id ? 'Update Changes' : 'Create Spv'}
                </Button>

                <Button
                  type='button'
                  variant='outline'
                  className='px-3 ml-2 flex items-center gap-2'
                  disabled={isLoading || isLastStep || !id}
                  onClick={handleNext2}

                >
                  Next
                  <ArrowRight className='ml-2' />
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
export default Index;
