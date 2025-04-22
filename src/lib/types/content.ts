export type Platform = 'TikTok' | 'Instagram' | 'YouTube' | 'LinkedIn' | 'Twitter' | 'Other';

export type ContentGoal = 'engagement' | 'growth' | 'brand' | 'sales' | 'education' | 'other';

export type ContentStatus = 'idea' | 'filming' | 'scheduled' | 'published';

export interface ContentIdea {
  id: string;
  userId: string;
  title: string;
  description: string;
  platform: Platform;
  goal: ContentGoal;
  status: ContentStatus;
  tags: string[];
  dueDate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface ContentBoard {
  idea: ContentIdea[];
  filming: ContentIdea[];
  scheduled: ContentIdea[];
  published: ContentIdea[];
} 