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