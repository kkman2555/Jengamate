
import React from 'react';
import { Package } from 'lucide-react';

interface AuthHeaderProps {
  isLogin: boolean;
}

const AuthHeader = ({ isLogin }: AuthHeaderProps) => {
  return (
    <div className="text-center animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
          <Package className="h-10 w-10 text-white" />
        </div>
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
        ConstructMate
      </h1>
      <p className="text-slate-600 mt-3 text-lg">
        {isLogin ? 'Welcome back to your account' : 'Create your account to get started'}
      </p>
    </div>
  );
};

export default AuthHeader;
