'use client';

import { useState, useEffect, useRef } from 'react';
import { ContentIdea, ContentStatus, Platform, ContentGoal } from '@/lib/types/content';
import anime from 'animejs/lib/anime.es.js';

const INITIAL_IDEAS: ContentIdea[] = [];

const DEMO_SEQUENCE = [
  // Create a new card in the idea column
  { type: 'create', delay: 0 },
  // Move card from idea to drafting
  { type: 'move', ideaId: '1', fromStatus: 'idea', toStatus: 'drafting', delay: 3000 },
  // Move card from drafting to filming
  { type: 'move', ideaId: '1', fromStatus: 'drafting', toStatus: 'filming', delay: 5000 },
];

export default function ProductPreview() {
  const [ideas, setIdeas] = useState<ContentIdea[]>(INITIAL_IDEAS);
  const [highlightedIdea, setHighlightedIdea] = useState<string | null>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case 'idea':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'drafting':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'filming':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const animateCreateCard = () => {
    const newIdea: ContentIdea = {
      id: '1',
      userId: 'demo',
      title: 'Create a new video about AI trends',
      description: 'A comprehensive guide to the latest AI developments and their impact on content creation',
      platform: 'YouTube' as Platform,
      goal: 'growth' as ContentGoal,
      status: 'idea',
      tags: ['ai', 'trends', 'tutorial'],
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setIdeas([newIdea]);

    // After React has updated, animate the new card
    setTimeout(() => {
      const cardEl = cardRefs.current['1'];
      if (cardEl) {
        anime({
          targets: cardEl,
          scale: [0, 1],
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 600,
          easing: 'spring(1, 80, 10, 0)',
        });
      }
    }, 0);
  };

  const animateCardMovement = (cardEl: HTMLElement, fromStatus: ContentStatus, toStatus: ContentStatus) => {
    const fromColumn = document.querySelector(`[data-status="${fromStatus}"]`);
    const toColumn = document.querySelector(`[data-status="${toStatus}"]`);
    
    if (!fromColumn || !toColumn) return;

    const fromRect = fromColumn.getBoundingClientRect();
    const toRect = toColumn.getBoundingClientRect();
    const cardRect = cardEl.getBoundingClientRect();

    // Set initial position
    cardEl.style.position = 'fixed';
    cardEl.style.top = `${cardRect.top}px`;
    cardEl.style.left = `${cardRect.left}px`;
    cardEl.style.width = `${cardRect.width}px`;
    cardEl.style.zIndex = '50';

    // Calculate the translation distance
    const translateX = toRect.left - cardRect.left;
    const translateY = toRect.top - cardRect.top;

    // Create a more natural movement with physics
    anime({
      targets: cardEl,
      translateX: [
        { value: translateX * 0.1, duration: 150, easing: 'easeOutQuad' },
        { value: translateX, duration: 600, easing: 'easeOutElastic(1, .6)' }
      ],
      translateY: [
        { value: translateY - 20, duration: 150, easing: 'easeOutQuad' },
        { value: translateY, duration: 600, easing: 'easeOutElastic(1, .6)' }
      ],
      scale: [
        { value: 1.05, duration: 150, easing: 'easeOutQuad' },
        { value: 1, duration: 600, easing: 'easeOutElastic(1, .6)' }
      ],
      complete: () => {
        // Reset the card's position after the animation
        cardEl.style.position = '';
        cardEl.style.top = '';
        cardEl.style.left = '';
        cardEl.style.width = '';
        cardEl.style.zIndex = '';
        cardEl.style.transform = '';
      }
    });

    // Animate the glow effect
    anime({
      targets: cardEl,
      boxShadow: [
        { value: '0 0 0 rgba(76, 175, 80, 0)', duration: 0 },
        { value: '0 0 20px rgba(76, 175, 80, 0.3)', duration: 300 },
        { value: '0 0 0 rgba(76, 175, 80, 0)', duration: 450 },
      ],
      easing: 'cubicBezier(.5, .05, .1, .3)'
    });
  };

  const simulateDragStart = (cardEl: HTMLElement) => {
    anime({
      targets: cardEl,
      scale: 1.05,
      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
      duration: 200,
      easing: 'easeOutQuad'
    });
  };

  const simulateDragEnd = (cardEl: HTMLElement) => {
    anime({
      targets: cardEl,
      scale: 1,
      boxShadow: '0 0 0 rgba(0,0,0,0)',
      duration: 400,
      easing: 'easeOutElastic(1, .6)'
    });
  };

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    const runDemoSequence = () => {
      // Reset to initial state
      setIdeas([]);
      setHighlightedIdea(null);

      // Run through demo sequence
      DEMO_SEQUENCE.forEach(action => {
        const timeout = setTimeout(() => {
          if (action.type === 'create') {
            animateCreateCard();
          } else if (action.type === 'move' && action.ideaId) {
            const { ideaId, fromStatus, toStatus } = action;
            setHighlightedIdea(ideaId);
            const cardEl = cardRefs.current[ideaId];
            if (cardEl) {
              simulateDragStart(cardEl);
              // First animate the movement
              animateCardMovement(cardEl, fromStatus as ContentStatus, toStatus as ContentStatus);
              // Then update the state after a delay to match the animation
              setTimeout(() => {
                setIdeas(currentIdeas =>
                  currentIdeas.map(idea =>
                    idea.id === ideaId
                      ? { ...idea, status: toStatus as ContentStatus }
                      : idea
                  )
                );
                simulateDragEnd(cardEl);
              }, 750);
            }
          }
        }, action.delay);
        timeouts.push(timeout);
      });

      // Clear highlight after sequence
      const clearHighlight = setTimeout(() => {
        setHighlightedIdea(null);
      }, Math.max(...DEMO_SEQUENCE.map(a => a.delay)) + 1000);
      timeouts.push(clearHighlight);
    };

    // Initial run
    runDemoSequence();

    // Set up interval for continuous demo
    const interval = setInterval(runDemoSequence, 8000);

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['idea', 'drafting', 'filming'].map((status) => (
          <div
            key={status}
            data-status={status}
            className="bg-[#1a1a1a] rounded-xl p-4 min-h-[400px] border border-[#4CAF50]/10"
          >
            <h3 className="text-lg font-semibold mb-4 capitalize">{status}</h3>
            <div className="space-y-4">
              {ideas
                .filter((idea) => idea.status === status)
                .map((idea) => (
                  <div
                    key={idea.id}
                    ref={(el) => {
                      if (el) cardRefs.current[idea.id] = el;
                    }}
                    className={`p-4 rounded-lg border ${getStatusColor(idea.status)} ${
                      highlightedIdea === idea.id ? 'ring-2 ring-[#4CAF50]' : ''
                    }`}
                  >
                    <div className="flex flex-col gap-2">
                      <h4 className="font-medium">{idea.title}</h4>
                      <p className="text-sm text-gray-400">{idea.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {idea.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-[#4CAF50]/10 text-[#4CAF50]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 