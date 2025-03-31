'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import SignInWithGoogle from '@/components/SignInWithGoogle';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3">
            <svg className="w-10 h-10 text-[#4CAF50]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10"/>
              <path d="M50 20L50 35" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
              <path d="M50 65L50 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
              <path d="M80 50L65 50" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
              <path d="M35 50L20 50" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
              <circle cx="50" cy="50" r="6" fill="currentColor"/>
              <path d="M50 50L35 35" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
            </svg>
            <span className="font-semibold text-xl">Creator Compass</span>
          </Link>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#4CAF50]/10">
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome back</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <div className="mb-6">
            <SignInWithGoogle />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-[#1a1a1a]">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#4CAF50]/40"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#4CAF50]/40"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#4CAF50] hover:text-[#45a049] transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
} 