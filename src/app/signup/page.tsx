'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/lib/firebase/firebaseUtils';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing up with Google:', error);
      setError('Failed to sign up with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error signing up with email:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else {
        setError('Failed to sign up. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex w-1/2 relative bg-[#1a1a1a]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 to-[#0a0a0a]/1 z-10" />
        <Image
          src="/login_background.png"
          alt="Sign up background"
          fill
          className="object-cover object-[25%_center]"
          priority
        />
        <div className="relative z-20 p-12">
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
            <span className="font-semibold text-2xl text-white">Creator Compass</span>
          </Link>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
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
              <span className="font-semibold text-3xl text-white">Creator Compass</span>
            </Link>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#4CAF50]/10">
            <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-gray-400 mb-8">
              Already have an account?{' '}
              <Link href="/signin" className="text-[#4CAF50] hover:text-[#45a049] transition-colors">
                Sign in
              </Link>
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg p-4 mb-6">
                {error}
              </div>
            )}

            {/* Social Sign Up */}
            <div className="space-y-4 mb-8">
              <button
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 px-4 py-3 rounded-lg font-medium transition-colors relative"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign up with Google
                  </>
                )}
              </button>
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

            {/* Email Sign Up Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0a0a] text-white border border-[#4CAF50]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#4CAF50]/40"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0a0a] text-white border border-[#4CAF50]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#4CAF50]/40"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              {/* Terms of Service Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-800 bg-[#0a0a0a] text-[#4CAF50] focus:ring-[#4CAF50] focus:ring-offset-0"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[#4CAF50] hover:text-[#45a049] transition-colors">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-[#4CAF50] hover:text-[#45a049] transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Sign up'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
} 