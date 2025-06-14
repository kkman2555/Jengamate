
import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  minLength?: number;
  icon: LucideIcon;
  children?: ReactNode;
  labelExtra?: ReactNode;
}

const FormField = ({ 
  id, 
  label, 
  type, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  minLength,
  icon: Icon,
  children,
  labelExtra
}: FormFieldProps) => {
  return (
    <div className="group">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {labelExtra}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-12 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:border-slate-300"
          placeholder={placeholder}
          required={required}
          minLength={minLength}
        />
        {children}
      </div>
    </div>
  );
};

export default FormField;
