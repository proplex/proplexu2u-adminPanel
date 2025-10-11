

import type { FormStep } from '../../types/company';

type StepIndicatorProps = {
  steps: FormStep[];
  changeStep: (step: string) => void;
  currentStep: string;
  disabledSteps?: string[];
};

export default function StepIndicator({
  steps,
  currentStep,
  changeStep,
  disabledSteps = [],
}: StepIndicatorProps) {
  return (
    <div className='w-48'>
      <ul className='space-y-4'>
        {steps.map((step) => {
          const isDisabled = disabledSteps.includes(step.id);
          const isActive = step.id === currentStep;
          return (
            <li key={step.id}>
              <button
                onClick={() => changeStep(step.id)}
                disabled={isDisabled}
                className={`flex items-center p-2 rounded-lg w-full transition-all border border-teal-500 ${
                  isActive
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-gray-50 text-gray-500'
                } ${
                  isDisabled
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                <p className='font-medium'>{step.title}</p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
