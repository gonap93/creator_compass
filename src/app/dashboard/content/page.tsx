'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserContentIdeas, updateContentStatus, deleteContentIdea, updateContentIdea } from '@/lib/firebase/contentUtils';
import { ContentIdea, ContentStatus, Platform } from '@/lib/types/content';
import AddContentModal from '@/components/AddContentModal';

const statusColors = {
  idea: 'from-blue-500/10 to-blue-500/5',
  drafting: 'from-purple-500/10 to-purple-500/5',
  filming: 'from-orange-500/10 to-orange-500/5',
  scheduled: 'from-yellow-500/10 to-yellow-500/5',
  published: 'from-green-500/10 to-green-500/5',
};

const statusProgressColors = {
  idea: 'bg-blue-500',
  drafting: 'bg-purple-500',
  filming: 'bg-orange-500',
  scheduled: 'bg-yellow-500',
  published: 'bg-green-500',
};

const statusTooltips = {
  idea: 'Ideas y conceptos iniciales de contenido',
  drafting: 'Contenido en fase de escritura o planificación',
  filming: 'Contenido siendo grabado o producido',
  scheduled: 'Contenido listo para ser publicado',
  published: 'Contenido publicado y disponible para la audiencia',
};

const statusIcons = {
  idea: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
    </svg>
  ),
  drafting: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  ),
  filming: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
    </svg>
  ),
  scheduled: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
  ),
  published: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
};

const formatPlatformName = (platform: string) => {
  if (platform === 'YouTube') return 'YouTube';
  if (platform === 'LinkedIn') return 'LinkedIn';
  return platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase();
};

const getDueDateColor = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilDue < 0) {
    return 'bg-red-500/20 text-red-400 border border-red-500/30'; // Past due
  } else if (daysUntilDue <= 5) {
    return 'bg-orange-500/20 text-orange-400 border border-orange-500/30'; // Due soon (within 5 days)
  } else {
    return 'bg-green-500/20 text-green-400 border border-green-500/30'; // Due in more than 5 days
  }
};

type DragTarget = ContentStatus | 'trash' | null;

// Add these type definitions before the Dashboard component
const nextStatusMap: Record<Exclude<ContentStatus, 'published'>, ContentStatus> = {
  idea: 'drafting',
  drafting: 'filming',
  filming: 'scheduled',
  scheduled: 'published'
};

const prevStatusMap: Record<Exclude<ContentStatus, 'idea'>, ContentStatus> = {
  drafting: 'idea',
  filming: 'drafting',
  scheduled: 'filming',
  published: 'scheduled'
};

// Add platform color mapping after the existing color constants
const platformColors = {
  YouTube: {
    bg: 'bg-red-500',
    text: 'text-red-400',
    progressBg: 'bg-red-500/20',
    border: 'border-red-500/30'
  },
  TikTok: {
    bg: 'bg-blue-500',
    text: 'text-blue-400',
    progressBg: 'bg-blue-500/20',
    border: 'border-blue-500/30'
  },
  Instagram: {
    bg: 'bg-purple-500',
    text: 'text-purple-400',
    progressBg: 'bg-purple-500/20',
    border: 'border-purple-500/30'
  },
  LinkedIn: {
    bg: 'bg-sky-500',
    text: 'text-sky-400',
    progressBg: 'bg-sky-500/20',
    border: 'border-sky-500/30'
  },
  Twitter: {
    bg: 'bg-cyan-500',
    text: 'text-cyan-400',
    progressBg: 'bg-cyan-500/20',
    border: 'border-cyan-500/30'
  },
  Other: {
    bg: 'bg-gray-500',
    text: 'text-gray-400',
    progressBg: 'bg-gray-500/20',
    border: 'border-gray-500/30'
  }
} as const;

// Add these utility functions at the top of the file, after the imports
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateForInput = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
};

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedOverStatus, setDraggedOverStatus] = useState<DragTarget>(null);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'title'>('dueDate');
  const [ideas, setIdeas] = useState<{
    idea: ContentIdea[];
    drafting: ContentIdea[];
    filming: ContentIdea[];
    scheduled: ContentIdea[];
    published: ContentIdea[];
  }>({
    idea: [],
    drafting: [],
    filming: [],
    scheduled: [],
    published: [],
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/signin');
        return;
      }

      try {
        const userIdeas = await getUserContentIdeas(user.uid);
        setIdeas(userIdeas);
      } catch (error) {
        console.error('Error fetching ideas:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setIsDragging(true);
    const element = e.currentTarget as HTMLElement;
    element.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    setDraggedOverStatus(null);
    const element = e.currentTarget as HTMLElement;
    element.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent, status: ContentStatus) => {
    e.preventDefault();
    setDraggedOverStatus(status);
  };

  const handleDragLeave = () => {
    setDraggedOverStatus(null);
  };

  const handleDrop = async (e: React.DragEvent, status: ContentStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    
    // Find the card in the current state
    let cardToMove: ContentIdea | null = null;
    let sourceStatus: ContentStatus | null = null;
    
    Object.entries(ideas).forEach(([currentStatus, items]) => {
      const foundCard = items.find(item => item.id === id);
      if (foundCard) {
        cardToMove = foundCard;
        sourceStatus = currentStatus as ContentStatus;
      }
    });

    if (!cardToMove || !sourceStatus) return;

    // Optimistically update the local state
    setIdeas(prevIdeas => {
      const newIdeas = { ...prevIdeas };
      // Remove from source
      newIdeas[sourceStatus as keyof typeof newIdeas] = newIdeas[sourceStatus as keyof typeof newIdeas].filter((item: ContentIdea) => item.id !== id);
      // Add to destination
      newIdeas[status] = [...newIdeas[status], { ...cardToMove!, status }];
      return newIdeas;
    });

    setIsDragging(false);
    setDraggedOverStatus(null);

    // Update Firebase in the background
    try {
      await updateContentStatus(id, status);
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert the optimistic update if the Firebase update fails
      if (auth.currentUser) {
        const userIdeas = await getUserContentIdeas(auth.currentUser.uid);
        setIdeas(userIdeas);
      }
    }
  };

  const handleTrashDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    
    // Find the card in the current state
    let sourceStatus: ContentStatus | null = null;
    Object.entries(ideas).forEach(([currentStatus, items]) => {
      if (items.some((item: ContentIdea) => item.id === id)) {
        sourceStatus = currentStatus as ContentStatus;
      }
    });

    if (!sourceStatus) return;

    // Optimistically update the local state
    setIdeas(prevIdeas => {
      const newIdeas = { ...prevIdeas };
      newIdeas[sourceStatus as keyof typeof newIdeas] = newIdeas[sourceStatus as keyof typeof newIdeas].filter((item: ContentIdea) => item.id !== id);
      return newIdeas;
    });

    setIsDragging(false);
    setDraggedOverStatus(null);

    // Delete from Firebase in the background
    try {
      await deleteContentIdea(id);
    } catch (error) {
      console.error('Error deleting content:', error);
      // Revert the optimistic update if the Firebase delete fails
      if (auth.currentUser) {
        const userIdeas = await getUserContentIdeas(auth.currentUser.uid);
        setIdeas(userIdeas);
      }
    }
  };

  // Add handler for card click
  const handleCardClick = (e: React.MouseEvent, id: string) => {
    if (isDragging) return;
    e.preventDefault();
    setEditingCard(id);
  };

  // Add handler for edit form submission
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>, item: ContentIdea) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dueDateStr = formData.get('dueDate') as string;
    // Create a date at noon UTC on the selected date to avoid timezone issues
    const dueDate = new Date(dueDateStr + 'T12:00:00Z');
    
    const updates = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      platform: formData.get('platform') as Platform,
      dueDate: dueDate.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await updateContentIdea(item.id, updates);
      if (auth.currentUser) {
        const userIdeas = await getUserContentIdeas(auth.currentUser.uid);
        setIdeas(userIdeas);
      }
      setEditingCard(null);
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  // Add EditModal component at the top level of the component
  const EditModal = ({ item, onClose, onSubmit }: { 
    item: ContentIdea; 
    onClose: () => void; 
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  }) => {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-[#1a1a1a] w-full max-w-md rounded-xl border border-white/10 shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Editar Contenido</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Plataforma</label>
              <select
                name="platform"
                defaultValue={item.platform}
                className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4CAF50]/40"
              >
                <option value="YouTube">YouTube</option>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Título</label>
              <input
                name="title"
                type="text"
                defaultValue={item.title}
                className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4CAF50]/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Descripción</label>
              <textarea
                name="description"
                defaultValue={item.description}
                rows={4}
                className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4CAF50]/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Fecha de Publicación</label>
              <input
                name="dueDate"
                type="date"
                defaultValue={formatDateForInput(item.dueDate)}
                className="w-full bg-[#0a0a0a] border border-[#4CAF50]/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4CAF50]/40"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-lg transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Filter and sort function
  const getFilteredAndSortedItems = (items: ContentIdea[]) => {
    return items
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlatform = selectedPlatform === 'all' || item.platform === selectedPlatform;
        return matchesSearch && matchesPlatform;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return a.title.localeCompare(b.title);
      });
  };

  // Update the keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent, item: ContentIdea, status: ContentStatus) => {
    const currentCard = e.currentTarget as HTMLElement;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setEditingCard(item.id);
        break;
      case 'ArrowRight':
        e.preventDefault();
        const nextStatus = nextStatusMap[status as Exclude<ContentStatus, 'published'>];
        if (nextStatus) {
          handleDrop(e as unknown as React.DragEvent, nextStatus);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        const prevStatus = prevStatusMap[status as Exclude<ContentStatus, 'idea'>];
        if (prevStatus) {
          handleDrop(e as unknown as React.DragEvent, prevStatus);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevCard = currentCard.previousElementSibling as HTMLElement;
        if (prevCard) {
          prevCard.focus();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        const nextCard = currentCard.nextElementSibling as HTMLElement;
        if (nextCard) {
          nextCard.focus();
        }
        break;
      case 'Delete':
      case 'Backspace':
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          handleTrashDrop(e as unknown as React.DragEvent);
        }
        break;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-48 bg-gray-700/50 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-gray-700/50 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-[#1a1a1a] rounded-xl p-4 border border-[#4CAF50]/10">
              <div className="h-6 w-24 bg-gray-700/50 rounded-lg animate-pulse mb-4" />
              <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-32 bg-gray-700/50 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4CAF50] to-[#45a049] bg-clip-text text-transparent">
              Tablero de Contenido
            </h1>
            <p className="text-gray-400 mt-1">Gestiona y organiza tus ideas de contenido</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 sm:px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#4CAF50]/20 hover:shadow-[#4CAF50]/30 whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Agregar Idea</span>
            <span className="sm:hidden">Agregar</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar contenido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#4CAF50]/40"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="relative">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full appearance-none bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#4CAF50]/40"
            >
              <option value="all">Todas las Plataformas</option>
              <option value="YouTube">YouTube</option>
              <option value="TikTok">TikTok</option>
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter</option>
              <option value="Other">Otra</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'title')}
              className="w-full appearance-none bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#4CAF50]/40"
            >
              <option value="dueDate">Ordenar por Fecha de Publicación</option>
              <option value="title">Ordenar por Título</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Cantidad de Ideas:</span>
            <span className="text-white font-medium">
              {Object.values(ideas).flat().length}
            </span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div 
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2"
        role="grid"
        aria-label="Content Board"
      >
        {Object.entries(ideas).map(([status, items]) => {
          const filteredItems = getFilteredAndSortedItems(items);
          return (
            <div
              key={status}
              className={`bg-gradient-to-b ${statusColors[status as keyof typeof statusColors]} rounded-xl p-2 border transition-all duration-200 ${
                draggedOverStatus === status
                  ? 'border-white/30 shadow-lg shadow-white/10'
                  : 'border-white/5'
              } shadow-xl backdrop-blur-sm min-w-0`}
              onDragOver={(e) => handleDragOver(e, status as ContentStatus)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status as ContentStatus)}
              role="gridcell"
              aria-label={`${status} column`}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 min-w-0 group relative">
                  <div className="text-white/80 flex-shrink-0" aria-hidden="true">
                    {statusIcons[status as keyof typeof statusIcons]}
                  </div>
                  <h2 
                    className="text-base sm:text-lg font-semibold capitalize truncate"
                    id={`${status}-heading`}
                  >
                    {status}
                  </h2>
                  <div 
                    className="absolute invisible group-hover:visible bg-[#1a1a1a] text-sm text-gray-400 px-3 py-2 rounded-lg shadow-xl -top-10 left-0 whitespace-nowrap"
                    role="tooltip"
                  >
                    {statusTooltips[status as keyof typeof statusTooltips]}
                  </div>
                </div>
                <span 
                  className="text-xs sm:text-sm text-white/60 bg-white/5 px-2 py-1 rounded-full flex-shrink-0 ml-2"
                  aria-label={`${filteredItems.length} elementos`}
                >
                  {filteredItems.length}
                </span>
              </div>
              <div 
                className="space-y-3 sm:space-y-4"
                role="list"
                aria-labelledby={`${status}-heading`}
              >
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => handleCardClick(e, item.id)}
                    onKeyDown={(e) => handleKeyDown(e, item, status as ContentStatus)}
                    className={`group bg-[#0a0a0a]/50 backdrop-blur-sm rounded-lg p-2 cursor-move border transition-all duration-200 hover:shadow-lg hover:shadow-black/20 min-w-0 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent ${
                      focusedCardId === item.id
                        ? 'border-[#4CAF50]'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                    tabIndex={0}
                    role="listitem"
                    aria-label={`${item.title} - ${item.platform} - Due ${new Date(item.dueDate).toLocaleDateString()}`}
                  >
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${platformColors[item.platform as keyof typeof platformColors].progressBg} ${platformColors[item.platform as keyof typeof platformColors].text} ${platformColors[item.platform as keyof typeof platformColors].border} w-fit font-medium shrink-0`}>
                          {formatPlatformName(item.platform)}
                        </span>
                      </div>
                      
                      <div className="min-w-0">
                        <h3 className="font-medium group-hover:text-[#4CAF50] transition-colors truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 group-hover:text-white/80 transition-colors break-words">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        {item.dueDate && (
                          <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${getDueDateColor(item.dueDate)} shrink-0`}>
                            Publicación {formatDate(item.dueDate)}
                          </span>
                        )}
                        
                        {/* Quick action buttons */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCard(item.id);
                            }}
                            className="p-1 hover:bg-white/10 rounded-full shrink-0"
                            title="Editar"
                            aria-label={`Editar ${item.title}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle duplicate
                            }}
                            className="p-1 hover:bg-white/10 rounded-full shrink-0"
                            title="Duplicar"
                            aria-label={`Duplicar ${item.title}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                              <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trash Can */}
      {isDragging && (
        <div
          className={`fixed bottom-8 right-8 rounded-full p-6 transition-all duration-200 ${
            draggedOverStatus === 'trash'
              ? 'bg-red-500/30 border-2 border-red-500 shadow-lg shadow-red-500/20'
              : 'bg-red-500/20 border-2 border-red-500'
          } hover:scale-110`}
          onDragOver={(e) => {
            e.preventDefault();
            setDraggedOverStatus('trash');
          }}
          onDragLeave={handleDragLeave}
          onDrop={handleTrashDrop}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
      )}

      {/* Add Content Modal */}
      <AddContentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async () => {
          if (auth.currentUser) {
            const userIdeas = await getUserContentIdeas(auth.currentUser.uid);
            setIdeas(userIdeas);
          }
        }}
      />

      {/* Add EditModal at the bottom of the return statement, before the closing tag */}
      {editingCard && (
        <EditModal
          item={Object.values(ideas).flat().find(item => item.id === editingCard)!}
          onClose={() => setEditingCard(null)}
          onSubmit={(e) => handleEditSubmit(e, Object.values(ideas).flat().find(item => item.id === editingCard)!)}
        />
      )}
    </div>
  );
} 