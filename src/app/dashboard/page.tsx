'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { FiFileText, FiBarChart2, FiUser, FiSettings } from 'react-icons/fi';
import LoadingSpinner from '@/components/LoadingSpinner';

interface NavigationCard {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      } else {
        router.push('/dashboard/content');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const navigationCards: NavigationCard[] = [
    {
      title: 'Content Board',
      description: 'Manage and organize your content ideas, track progress, and plan your content calendar.',
      icon: FiFileText,
      path: '/dashboard/content',
      color: '#4CAF50',
    },
    {
      title: 'Analytics',
      description: 'View insights and performance metrics for your content across different platforms.',
      icon: FiBarChart2,
      path: '/dashboard/analytics',
      color: '#2196F3',
    },
    {
      title: 'Profile',
      description: 'Manage your profile settings and preferences.',
      icon: FiUser,
      path: '/dashboard/profile',
      color: '#9C27B0',
    },
    {
      title: 'Settings',
      description: 'Configure your account settings and notifications.',
      icon: FiSettings,
      path: '/dashboard/settings',
      color: '#FF9800',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to Creator Compass</h1>
        <p className="text-gray-400">
          Your central hub for content creation and management. Choose a section below to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {navigationCards.map((card) => (
          <button
            key={card.title}
            onClick={() => router.push(card.path)}
            className="bg-[#1a1a1a] hover:bg-[#242424] border border-[#333] rounded-xl p-6 text-left transition-all duration-200 hover:scale-[1.02] group"
          >
            <div className="flex items-start gap-4">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <card.icon
                  className="w-6 h-6 transition-colors"
                  style={{ color: card.color }}
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-[#4CAF50]">
                  {card.title}
                </h2>
                <p className="text-gray-400 text-sm">{card.description}</p>
              </div>

            </div>
          </button>
        ))}
      </div>
    </div>
  );
}