'use client';

import { useState } from 'react';
import { FiLoader, FiSearch, FiAlertCircle, FiCheckCircle, FiHash, FiCoffee, FiHeart, FiPenTool } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentIdea {
  title: string;
  description: string;
  hashtags: string[];
}

interface ApiResponse {
  username: string;
  ideas: ContentIdea[];
}

export default function CreatorAIPage() {
  const [username, setUsername] = useState('');
  const [recommendations, setRecommendations] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const getIdeaIcon = (title: string) => {
    if (title.toLowerCase().includes('desayuno') || title.toLowerCase().includes('comida')) {
      return <FiCoffee className="w-5 h-5" />;
    } else if (title.toLowerCase().includes('mascota') || title.toLowerCase().includes('gato')) {
      return <FiHeart className="w-5 h-5" />;
    } else if (title.toLowerCase().includes('arte') || title.toLowerCase().includes('creativ')) {
      return <FiPenTool className="w-5 h-5" />;
    }
    return <FiHash className="w-5 h-5" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setRecommendations([]);

    try {
      const response = await fetch('/api/creator-ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data: ApiResponse = await response.json();
      setRecommendations(data.ideas);
      setSuccess(true);
    } catch (err) {
      setError('Failed to fetch recommendations. Please try again later.');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">AI Content Recommendations</h1>
        <p className="text-gray-400 text-lg">Get personalized content ideas based on any TikTok creator&apos;s style</p>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter TikTok username (e.g. username.tiktok)"
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4CAF50] transition-colors text-lg"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#4CAF50] text-white px-8 py-3 rounded-lg hover:bg-[#45a049] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[220px] justify-center text-lg font-medium"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                Analyzing Profile...
              </>
            ) : (
              'Generate Ideas'
            )}
          </button>
        </div>
      </form>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 mb-6 flex items-center gap-2"
          >
            <FiAlertCircle className="flex-shrink-0" />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#4CAF50]/10 border border-[#4CAF50]/20 rounded-lg p-4 text-[#4CAF50] mb-6 flex items-center gap-2"
          >
            <FiCheckCircle className="flex-shrink-0" />
            Successfully generated {recommendations.length} content ideas for @{username}
          </motion.div>
        )}

        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {recommendations.map((idea, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 hover:border-[#4CAF50]/30 transition-all duration-200 group hover:shadow-lg hover:shadow-[#4CAF50]/5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-[#4CAF50]/10 text-[#4CAF50] group-hover:bg-[#4CAF50]/20 transition-colors">
                    {getIdeaIcon(idea.title)}
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-[#4CAF50] transition-colors line-clamp-2">
                    {idea.title}
                  </h3>
                </div>
                <p className="text-gray-400 mb-4 leading-relaxed min-h-[80px]">
                  {idea.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {idea.hashtags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-[#4CAF50]/10 text-[#4CAF50] px-3 py-1.5 rounded-full text-sm hover:bg-[#4CAF50]/20 transition-colors cursor-default font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 