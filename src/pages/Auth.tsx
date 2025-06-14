
import React, { useState } from 'react';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthToggle from '@/components/auth/AuthToggle';
import AuthForm from '@/components/auth/AuthForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration - simplified pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, #93c5fd 2px, transparent 2px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <AuthHeader isLogin={isLogin} />

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 animate-scale-in">
          <AuthToggle isLogin={isLogin} onToggle={setIsLogin} />
          <AuthForm isLogin={isLogin} />

          {/* Toggle Link */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 hover:underline"
            >
              {isLogin ? "Don't have an account? Create one here" : "Already have an account? Sign in instead"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm animate-fade-in">
          Secure authentication powered by Supabase
        </div>
      </div>
    </div>
  );
};

export default Auth;
