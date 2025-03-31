'use client';

import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';
import SocialMediaPlatforms from '@/components/profile/SocialMediaPlatforms';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <div className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Picture Section */}
        <section className="bg-[#1a1a1a] rounded-xl p-6 border border-[#4CAF50]/10">
          <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
          <div className="flex items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-[#2a2a2a] overflow-hidden">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500">
                    {user?.displayName?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-grow">
              <ProfilePictureUpload />
              <p className="mt-2 text-sm text-gray-400">
                Recommended: Square image, at least 400x400 pixels
              </p>
            </div>
          </div>
        </section>

        {/* Personal Information Section */}
        <section className="bg-[#1a1a1a] rounded-xl p-6 border border-[#4CAF50]/10">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <ProfileForm />
        </section>

        {/* Social Media Section */}
        <section className="bg-[#1a1a1a] rounded-xl p-6 border border-[#4CAF50]/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Connected Platforms</h2>
            <span className="text-xs text-gray-400 px-2 py-1 bg-[#2a2a2a] rounded-full">
              Coming Soon
            </span>
          </div>
          <SocialMediaPlatforms />
          <p className="mt-4 text-sm text-gray-400">
            Connect your social media accounts to enable cross-platform content management and analytics.
          </p>
        </section>

        {/* Content Preferences Section */}
        <section className="bg-[#1a1a1a] rounded-xl p-6 border border-[#4CAF50]/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Content Preferences</h2>
            <span className="text-xs text-gray-400 px-2 py-1 bg-[#2a2a2a] rounded-full">
              Coming Soon
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div>
                <h3 className="font-medium">Content Categories</h3>
                <p className="text-sm text-gray-400">Select your primary content categories</p>
              </div>
              <button className="text-[#4CAF50] hover:text-[#45a049] text-sm" disabled>
                Configure
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div>
                <h3 className="font-medium">Publishing Schedule</h3>
                <p className="text-sm text-gray-400">Set your ideal content publishing frequency</p>
              </div>
              <button className="text-[#4CAF50] hover:text-[#45a049] text-sm" disabled>
                Configure
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium">Analytics Preferences</h3>
                <p className="text-sm text-gray-400">Customize your analytics dashboard</p>
              </div>
              <button className="text-[#4CAF50] hover:text-[#45a049] text-sm" disabled>
                Configure
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 