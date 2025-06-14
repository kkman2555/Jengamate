
import React from 'react';

interface AuthToggleProps {
  isLogin: boolean;
  onToggle: (isLogin: boolean) => void;
}

const AuthToggle = ({ isLogin, onToggle }: AuthToggleProps) => {
  return (
    <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
      <button
        onClick={() => onToggle(true)}
        className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
          isLogin 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        Sign In
      </button>
      <button
        onClick={() => onToggle(false)}
        className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
          !isLogin 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthToggle;
