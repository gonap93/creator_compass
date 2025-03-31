'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { UserProfile, getUserProfile, updateUserProfile } from '@/lib/firebase/profileUtils';
import { handleUserSignedIn } from '@/lib/firebase/authUtils';

export default function ProfileForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    fullName: '',
    displayName: '',
    bio: '',
    primaryLanguage: 'en',
    location: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    primaryPlatform: '',
    publishingFrequency: 'weekly',
    contentCategories: [],
  });

  const loadProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      console.log('Fetching profile from Firestore...');
      const profile = await getUserProfile(user.uid);
      console.log('Profile data:', profile);
      
      if (profile) {
        setFormData({
          ...profile,
          email: user.email || '',
          photoURL: user.photoURL,
        });
      } else {
        console.log('No profile found, creating new profile...');
        await handleUserSignedIn(user);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      console.log('Loading profile for user:', user.uid);
      loadProfile();
    }
  }, [user, loadProfile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSuccess(false);

    try {
      console.log('Saving profile data:', formData);
      await updateUserProfile(user.uid, formData);
      console.log('Profile saved successfully');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#4CAF50] rounded-lg p-4">
          Profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleChange}
            className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#4CAF50]/40"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-1">
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName || ''}
            onChange={handleChange}
            className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#4CAF50]/40"
            placeholder="@johndoe"
          />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio || ''}
          onChange={handleChange}
          rows={4}
          className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#4CAF50]/40 resize-none"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="primaryLanguage" className="block text-sm font-medium text-gray-300 mb-1">
            Primary Language
          </label>
          <select
            id="primaryLanguage"
            name="primaryLanguage"
            value={formData.primaryLanguage || 'en'}
            onChange={handleChange}
            className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#4CAF50]/40"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#4CAF50]/40"
            placeholder="City, Country"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
} 