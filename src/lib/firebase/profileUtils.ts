import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  // Basic Information
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
  const docRef = doc(db, 'profiles', userId);
  const now = new Date();
  
  await setDoc(docRef, {
    ...defaultProfile,
    ...data,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
  const docRef = doc(db, 'profiles', userId);
  
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date(),
  });
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'profiles', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  
  return null;
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