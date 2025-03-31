'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a] border-b border-[#4CAF50]/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3">
              <svg className="w-8 h-8 text-[#4CAF50]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10"/>
                <path d="M50 20L50 35" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                <path d="M50 65L50 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                <path d="M80 50L65 50" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                <path d="M35 50L20 50" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                <circle cx="50" cy="50" r="6" fill="currentColor"/>
                <path d="M50 50L35 35" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
              </svg>
              <span className="font-semibold text-lg">Creator Compass</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard/content"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/dashboard/content'
                    ? 'text-[#4CAF50]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Content Board
              </Link>
              <Link
                href="/dashboard/analytics"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/dashboard/analytics'
                    ? 'text-[#4CAF50]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Analytics
              </Link>
              <Link
                href="/dashboard/profile"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/dashboard/profile'
                    ? 'text-[#4CAF50]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Profile
              </Link>
              <Link
                href="/dashboard/settings"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/dashboard/settings'
                    ? 'text-[#4CAF50]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Settings
              </Link>
            </nav>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                <span>Menu</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isMenuOpen ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg border border-[#4CAF50]/10 py-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#4CAF50]/10 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4">{children}</main>
    </div>
  );
} 