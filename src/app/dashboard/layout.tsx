'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { FiFileText, FiBarChart2, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

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
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0a0a0a] border-r border-[#333]">
        {/* Logo Section */}
        <div className="p-4 border-b border-[#333]">
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
            <span className="font-semibold text-lg text-white">Creator Compass</span>
          </Link>
        </div>

        {/* Navigation Items */}
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#333]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-400 hover:bg-[#242424] hover:text-white"
          >
            <div className="p-2 rounded-lg">
              <FiLogOut className="w-5 h-5" />
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