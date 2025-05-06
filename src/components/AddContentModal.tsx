'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase/firebase';
import { addContentIdea, updateContentIdea } from '@/lib/firebase/contentUtils';
import { Platform, ContentGoal, ContentStatus } from '@/lib/types/content';
import { FiZap } from 'react-icons/fi';

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  initialData?: {
    title?: string;
    description?: string;
    tags?: string;
    caption?: string;
    platform?: Platform;
    goal?: ContentGoal;
    dueDate?: string;
    id?: string;
  };
  mode?: 'add' | 'edit';
}

export default function AddContentModal({ isOpen, onClose, onAdd, initialData, mode = 'add' }: AddContentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [caption, setCaption] = useState('');
  const [generatingCaption, setGeneratingCaption] = useState(false);

  useEffect(() => {
    // Log authentication state when component mounts
    console.log('[AddContentModal] Current auth state:', {
      user: auth.currentUser,
      isAuthenticated: !!auth.currentUser,
      uid: auth.currentUser?.uid
    });
    setCaption('');
  }, [isOpen]);

  const handleGenerateCaption = async () => {
    setGeneratingCaption(true);
    setError('');
    try {
      // Get current title and description values
      const title = (document.getElementById('title') as HTMLInputElement)?.value || '';
      const description = (document.getElementById('description') as HTMLTextAreaElement)?.value || '';
      const prompt = `Write a catchy social media caption for this post idea.\nTitle: ${title}\nDescription: ${description}`;
      const response = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      });
      if (!response.ok) throw new Error('Failed to generate caption');
      const data = await response.json();
      setCaption(data.text || '');
    } catch (err: any) {
      setError('Failed to generate caption.');
    } finally {
      setGeneratingCaption(false);
    }
  };

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
    const dueDateStr = formData.get('dueDate') as string;
    const tags = formData.get('tags') as string;
    const captionValue = (formData.get('caption') as string) || caption;

    // Create a date at noon UTC to avoid timezone issues
    const dueDate = new Date(dueDateStr + 'T12:00:00Z').toISOString();

    const contentData = {
      userId: auth.currentUser.uid,
      title,
      description,
      platform,
      goal,
      status: 'idea' as ContentStatus,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      dueDate,
      updatedAt: new Date().toISOString(),
      caption: captionValue,
    };

    try {
      if (mode === 'add') {
        // Add new content idea
        await addContentIdea({
          ...contentData,
          createdAt: new Date().toISOString(),
        });
      } else {
        // Update existing content idea
        if (!initialData?.id) {
          throw new Error('Content ID is required for editing');
        }
        await updateContentIdea(initialData.id, contentData);
      }

      onAdd();
      onClose();
    } catch (err: any) {
      console.error('[AddContentModal] Error:', {
        error: err,
        code: err.code,
        message: err.message,
        stack: err.stack
      });
      setError(err.message || `Failed to ${mode} content idea. Please check your Firestore permissions.`);
      setLoading(false);
    }
  };

  return isOpen ? (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-lg border border-[#4CAF50]/10">
        <h2 className="text-xl font-bold mb-6">{mode === 'add' ? 'Add New Content Idea' : 'Edit Idea'}</h2>

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
              defaultValue={initialData?.title}
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
              defaultValue={initialData?.description}
              required
              rows={3}
              className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#4CAF50]/40"
              placeholder="Enter description"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="caption" className="block text-sm font-medium text-gray-300">
                Caption
              </label>
              <button
                type="button"
                onClick={handleGenerateCaption}
                disabled={generatingCaption}
                className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 font-medium px-0 py-0 bg-transparent border-none shadow-none focus:outline-none disabled:opacity-60"
                style={{ fontSize: '1rem', fontWeight: 500 }}
              >
                <span role="img" aria-label="magic-wand">✨</span> Generate Caption
              </button>
            </div>
            <textarea
              id="caption"
              name="caption"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={2}
              className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#4CAF50]/40"
              placeholder="Write or generate a caption for your post"
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
              defaultValue={initialData?.tags}
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
              defaultValue={initialData?.dueDate}
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
              {loading ? 'Saving...' : mode === 'add' ? 'Add Idea' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
} 