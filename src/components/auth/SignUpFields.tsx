
import React from 'react';
import { Building, User } from 'lucide-react';
import FormField from './FormField';

interface SignUpFieldsProps {
  isLogin: boolean;
  fullName: string;
  setFullName: (value: string) => void;
  companyName: string;
  setCompanyName: (value: string) => void;
}

const SignUpFields = ({ isLogin, fullName, setFullName, companyName, setCompanyName }: SignUpFieldsProps) => {
  if (isLogin) return null;

  return (
    <div className={`space-y-6 transition-all duration-300 ${!isLogin ? 'animate-fade-in' : 'hidden'}`}>
      <FormField
        id="fullName"
        label="Full Name"
        type="text"
        value={fullName}
        onChange={setFullName}
        placeholder="Enter your full name"
        required={!isLogin}
        icon={User}
      />

      <FormField
        id="companyName"
        label="Company Name"
        type="text"
        value={companyName}
        onChange={setCompanyName}
        placeholder="Enter your company name"
        icon={Building}
        labelExtra={<span className="text-slate-400 font-normal">(Optional)</span>}
      />
    </div>
  );
};

export default SignUpFields;
