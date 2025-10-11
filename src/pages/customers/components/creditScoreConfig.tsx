import React from 'react'

type HeaderProps = {
    title: string;
value: any;      
};

const CreditScoreConfig:React.FC<HeaderProps> = ({value, title}) => {
  return  (
    <div className='border border-gray-200 roumded-2xl shadow-sm p-4 mb-6'>
        <span className='text-sm text-gray-400'> {title} </span>
        <h1 className='text-2xl font-bold'> {value} </h1>
    </div>
  )
}

export default CreditScoreConfig