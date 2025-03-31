'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase/firebase';
import { addContentIdea } from '@/lib/firebase/contentUtils';
import { Platform, ContentGoal, ContentStatus } from '@/lib/types/content';

interface AddContentModalProps {
  onClose: () => void;
  onAdd: () => void;
}

export default function AddContentModal({ onClose, onAdd }: AddContentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('You must be signed in to add content');
      return;
    }

    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const platform = formData.get('platform') as Platform;
    const goal = formData.get('goal') as ContentGoal;
    const dueDate = formData.get('dueDate') as string;
    const tags = formData.get('tags') as string;

    try {
      console.log('Adding content idea with data:', {
        userId: auth.currentUser.uid,
        title,
        description,
        platform,
        goal,
        status: 'idea' as ContentStatus,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        dueDate
      });

      await addContentIdea({
        userId: auth.currentUser.uid,
        title,
        description,
        platform,
        goal,
        status: 'idea' as ContentStatus,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      onAdd();
      onClose();
    } catch (err: any) {
      console.error('Error adding content idea:', err);
      setError(err.message || 'Failed to add content idea. Please check your Firestore permissions.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-lg border border-[#4CAF50]/10">
        <h2 className="text-xl font-bold mb-6">Add New Content Idea</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#4CAF50]/40"
              placeholder="Enter title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#4CAF50]/40"
              placeholder="Enter description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-300 mb-1">
                Platform
              </label>
              <select
                id="platform"
                name="platform"
                required
                className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#4CAF50]/40"
              >
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-300 mb-1">
                Goal
              </label>
              <select
                id="goal"
                name="goal"
                required
                className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#4CAF50]/40"
              >
                <option value="engagement">Engagement</option>
                <option value="growth">Growth</option>
                <option value="brand">Brand</option>
                <option value="sales">Sales</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#4CAF50]/40"
              placeholder="Enter tags"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-1">
              Due Date
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              required
              className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#4CAF50]/40 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert-[1] [&::-webkit-calendar-picker-indicator]:hover:opacity-70"
              placeholder="dd/mm/yyyy"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Idea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 