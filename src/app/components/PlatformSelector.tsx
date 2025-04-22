import { useState } from 'react';
import { motion } from 'framer-motion';

type Platform = 'TikTok' | 'Instagram';

interface PlatformSelectorProps {
  selectedPlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
}

export function PlatformSelector({ selectedPlatform, onPlatformChange }: PlatformSelectorProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-[#1a1a1a] rounded-lg border border-[#333]">
      {(['TikTok', 'Instagram'] as Platform[]).map((platform) => (
        <button
          key={platform}
          onClick={() => onPlatformChange(platform)}
          className={`relative px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedPlatform === platform
              ? 'text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {selectedPlatform === platform && (
            <motion.div
              layoutId="activePlatform"
              className="absolute inset-0 bg-[#4baf51]/80 rounded-md"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{platform}</span>
        </button>
      ))}
    </div>
  );
} 