'use client';

import Image from 'next/image';
import { useLoginViewModel } from './useLoginViewModel';

export function LoginView() {
  const { isLoading, error, handleGoogleSignIn } = useLoginViewModel();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-zinc-950 dark">
      {/* Branding Section - Hidden on mobile, shown on lg+ */}
      <div className="hidden lg:flex lg:flex-1 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Gradient Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center space-y-8 max-w-md">
          <Image src="/logo.png" alt="Xpnsio" width={220} height={220} priority className="mx-auto" />
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Take Control of Your Finances
            </h1>
            <p className="text-xl text-zinc-400">
              Know how much budget you have left.
            </p>
          </div>
          
          {/* Feature highlights */}
          <div className="grid gap-4 text-left">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 ring-1 ring-white/10">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Smart Budget Tracking</p>
                <p className="text-xs text-zinc-500">Daily, weekly, or monthly budgets</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 ring-1 ring-white/10">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Clear Insights</p>
                <p className="text-xs text-zinc-500">See where your money goes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center space-y-4">
            <Image src="/logo.png" alt="Xpnsio" width={220} height={220} priority className="mx-auto" />
            <p className="text-lg text-zinc-400">
              Know how much budget you have left.
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl bg-zinc-900/50 ring-1 ring-white/10 p-8 space-y-6 relative overflow-hidden">
            {/* Subtle gradient border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Welcome to Xpnsio</h2>
                <p className="text-zinc-400">Sign in to your account to continue</p>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/30 p-4 text-sm text-red-400 text-center">
                  {error}
                </div>
              )}

              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 h-14 px-6 rounded-xl bg-zinc-100 text-zinc-900 font-medium text-base hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px]"
              >
                <GoogleIcon />
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </button>
            </div>
          </div>

          {/* Terms */}
          <p className="text-center text-sm text-zinc-500">
            By signing in, you agree to our terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
