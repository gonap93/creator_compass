import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  // Basic Information
  userId: string;
  fullName: string;
  displayName: string;
  bio: string;
  email: string;
  photoURL: string | null;
  
  // Preferences
  primaryLanguage: string;
  location: string;
  timezone: string;
  
  // Content Creation
  contentCategories: string[];
  primaryPlatform: string;
  publishingFrequency: string;
  
  // Social Media Handles
  socialMedia: {
    youtube?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    twitch?: string;
    linkedin?: string;
  };
  
  // Analytics Preferences
  analyticsPreferences: {
    enabledMetrics: string[];
    emailReports: boolean;
    reportFrequency: 'daily' | 'weekly' | 'monthly';
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export const defaultProfile: Partial<UserProfile> = {
  contentCategories: [],
  socialMedia: {},
  analyticsPreferences: {
    enabledMetrics: ['views', 'engagement', 'growth'],
    emailReports: true,
    reportFrequency: 'weekly',
  },
};

export async function createUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
  console.log('[ProfileUtils] Creating user profile for:', userId);
  console.log('[ProfileUtils] Profile data:', data);
  
  const docRef = doc(db, 'profiles', userId);
  const now = new Date();
  
  const profileData = {
    ...defaultProfile,
    ...data,
    userId,
    createdAt: now,
    updatedAt: now,
  };
  
  console.log('[ProfileUtils] Final profile data to save:', profileData);
  
  try {
    await setDoc(docRef, profileData, { merge: true });
    console.log('[ProfileUtils] Profile created successfully');
  } catch (error) {
    console.error('[ProfileUtils] Error creating profile:', error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
  console.log('[ProfileUtils] Updating user profile for:', userId);
  console.log('[ProfileUtils] Update data:', data);
  
  const docRef = doc(db, 'profiles', userId);
  
  try {
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
    console.log('[ProfileUtils] Profile updated successfully');
  } catch (error) {
    console.error('[ProfileUtils] Error updating profile:', error);
    throw error;
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  console.log('[ProfileUtils] Getting user profile for:', userId);
  
  const docRef = doc(db, 'profiles', userId);
  
  try {
    const docSnap = await getDoc(docRef);
    console.log('[ProfileUtils] Profile exists:', docSnap.exists());
    
    if (docSnap.exists()) {
      const data = docSnap.data() as UserProfile;
      console.log('[ProfileUtils] Retrieved profile data:', data);
      return data;
    }
    
    console.log('[ProfileUtils] No profile found');
    return null;
  } catch (error) {
    console.error('[ProfileUtils] Error getting profile:', error);
    throw error;
  }
}

// Firestore Rules for the profiles collection
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /profiles/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || 
        exists(/databases/$(database)/documents/profiles/$(request.auth.uid)/collaborators/$(userId)));
      allow write: if request.auth != null && request.auth.uid == userId;
      
      // Validate profile data
      function isValidProfile() {
        let profile = request.resource.data;
        return profile.size() <= 50 && // Limit total fields
               profile.fullName is string && 
               profile.fullName.size() <= 100 &&
               (profile.bio == null || (profile.bio is string && profile.bio.size() <= 500)) &&
               (profile.location == null || (profile.location is string && profile.location.size() <= 100));
      }
    }
  }
}
*/ 