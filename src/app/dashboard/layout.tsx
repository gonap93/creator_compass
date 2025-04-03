'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { FiFileText, FiBarChart2, FiUser, FiSettings, FiLogOut, FiCalendar, FiHome } from 'react-icons/fi';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigationItems = [
    {
      href: '/dashboard/content',
      label: 'Content Board',
      icon: FiFileText,
      color: '#4CAF50'
    },
    {
      href: '/dashboard/calendar',
      label: 'Calendar',
      icon: FiCalendar,
      color: '#E91E63'
    },
    {
      href: '/dashboard/analytics',
      label: 'Analytics',
      icon: FiBarChart2,
      color: '#2196F3'
    },
    {
      href: '/dashboard/profile',
      label: 'Profile',
      icon: FiUser,
      color: '#9C27B0'
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      icon: FiSettings,
      color: '#FF9800'
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a1a1a] border-r border-[#333] flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-[#333]">
          <Link href="/dashboard" className="flex items-center gap-3">
            <svg className="w-8 h-8 text-[#4CAF50]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor"/>
            </svg>
            <span className="font-semibold text-lg text-white">Creator Compass</span>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? `bg-[${item.color}]/10 text-[${item.color}]`
                    : 'text-gray-400 hover:bg-[#242424] hover:text-white'
                }`}
              >
                <div
                  className="p-2 rounded-lg"
                  style={{ 
                    backgroundColor: pathname === item.href ? `${item.color}20` : 'transparent',
                    color: pathname === item.href ? item.color : 'currentColor'
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign Out Button - Bottom of Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#333] space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-gray-400 hover:bg-[#242424] hover:text-white text-sm"
          >
            <div className="p-1.5 rounded-lg">
              <FiHome className="w-4 h-4" />
            </div>
            <span className="font-medium">Back to Home</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-gray-400 hover:bg-[#242424] hover:text-white text-sm"
          >
            <div className="p-1.5 rounded-lg">
              <FiLogOut className="w-4 h-4" />
            </div>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 