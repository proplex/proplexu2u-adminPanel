import InfoItem,{ ProgressBar }  from '@/pages/customer/components/helper';
import { Calendar, IdCardIcon, Mail, Phone, Shield, User } from 'lucide-react';
import React from 'react'

type PersonalInfoProps = {
    userDetail: any;
};

const PersonalInfo: React.FC<PersonalInfoProps> = ({ userDetail }) => {
    return (
        <>
        <div className="bg-white w-8/12  shadow-sm border border-gray-200 rounded-lg p-2">
            <h1 className="font-bold text-xl text-black ">Personal Information</h1>
            <div className="flex justify-between border-b border-gray-200 items-center ">

                <div className="flex flex-col items-center text-center gap-2">
                    <img
                        src="https://picsum.photos/200"
                        alt="Profile"
                        className="rounded-full h-24 w-24 object-cover border-2 border-gray-300"
                    />
                    <h2 className="text-xl font-semibold text-gray-800">
                        {userDetail?.full_name || 'Full Name'}
                    </h2>
                    <p className="text-sm text-gray-500">{userDetail?.email || 'email@example.com'}</p>

                    <span className="mt-1 px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full border border-gray-300">
                        Customer since 2023
                    </span>
                </div>
                <div className="grid grid-cols-2   gap-6">
                    <InfoItem icon={<User/>} title='Full Name' value={userDetail?.full_name || " "} />
                    <InfoItem icon={<Calendar/>} title='Date Of Birth' value={userDetail?.dob || " "} />
                    <InfoItem icon={<Mail/>} title='Email Address' value={userDetail?.email || " "} />
                    <InfoItem icon={<Phone/>} title='Phone' value={userDetail?.alternate_numbers[0] || " "} />
                    <InfoItem icon={<IdCardIcon/>} title='Pan' value={userDetail?.pan || " "} />
                    <InfoItem icon={<Shield/>} title='Full Name' value={userDetail?.aadhar || " "} />

                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-5">
                <ProgressBar progress={userDetail?.name_match_score || 0} title='Name Match' />
                <ProgressBar progress={userDetail?.dob_match_score || 0} title='DOB Match' />
                <ProgressBar progress={userDetail?.mobile_number_match_score || 0} title='Mobile Number Match' />
            </div>
        </div>

        </>
    )
}

export default PersonalInfo



