"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { auth } from '@/lib/firebase/firebase';
import { getUserContentIdeas } from '@/lib/firebase/contentUtils';
import { ContentIdea } from '@/lib/types/content';
import AddContentModal from '@/components/AddContentModal';

type ViewMode = 'week' | 'month' | 'year';

// Add this new type for time slots
type TimeSlot = {
  hour: number;
  minute: number;
};

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  useEffect(() => {
    const loadContentIdeas = async () => {
      if (auth.currentUser) {
        const ideas = await getUserContentIdeas(auth.currentUser.uid);
        const allIdeas = Object.values(ideas).flat();
        setContentIdeas(allIdeas);
      }
    };

    loadContentIdeas();
  }, []);

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert to Monday-based
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getContentIdeasForDate = (date: Date): ContentIdea[] => {
    return contentIdeas.filter(idea => 
      new Date(idea.dueDate).toDateString() === date.toDateString()
    );
  };

  const getTodayContentIdeas = (): ContentIdea[] => {
    const today = new Date();
    return contentIdeas.filter(idea => 
      new Date(idea.dueDate).toDateString() === today.toDateString()
    );
  };

  const getUpcomingContentIdeas = (): ContentIdea[] => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return contentIdeas.filter(idea => {
      const dueDate = new Date(idea.dueDate);
      return dueDate > today && dueDate <= nextWeek;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idea': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'drafting': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'filming': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'scheduled': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // New functions for week view
  const getWeekDates = (date: Date): Date[] => {
    const week = [];
    const current = new Date(date);
    current.setDate(current.getDate() - current.getDay() + 1); // Start from Monday
    
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return week;
  };

  // New functions for year view
  const getMonthsInYear = (year: number): Date[] => {
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  };

  // Add these new helper functions for time-based views
  const getTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push({ hour, minute: 0 });
    }
    return slots;
  };

  const formatTime = (hour: number, minute: number): string => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const getContentIdeasForDateTime = (date: Date, hour: number): ContentIdea[] => {
    return contentIdeas.filter(idea => {
      const ideaDate = new Date(idea.dueDate);
      return ideaDate.toDateString() === date.toDateString() && 
             ideaDate.getHours() === hour;
    });
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates(currentMonth);
    const timeSlots = getTimeSlots();

    return (
      <div className="border border-border/50 rounded-lg bg-card/50">
        {/* Header with days */}
        <div className="grid grid-cols-8 text-sm font-medium border-b border-border/50">
          {/* Empty cell for time column */}
          <div className="p-4 text-center border-r border-border/50"></div>
          {/* Day columns */}
          {weekDates.map((date, i) => (
            <div 
              key={i}
              className={cn(
                "p-4 text-center border-r border-border/50",
                selectedDate.toDateString() === date.toDateString() && "bg-accent/20"
              )}
            >
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][i]}
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="relative">
          {timeSlots.map((slot, slotIndex) => (
            <div key={slotIndex} className="grid grid-cols-8">
              {/* Time marker */}
              <div className="p-2 text-xs text-gray-400 border-r border-border/50 text-center">
                {formatTime(slot.hour, slot.minute)}
              </div>
              
              {/* Day columns */}
              {weekDates.map((date, dateIndex) => {
                const ideas = getContentIdeasForDateTime(date, slot.hour);
                return (
                  <div 
                    key={dateIndex}
                    className={cn(
                      "p-2 border-r border-b border-border/50 min-h-[60px] relative",
                      selectedDate.toDateString() === date.toDateString() && "bg-accent/10"
                    )}
                  >
                    {ideas.map((idea, ideaIndex) => (
                      <div
                        key={ideaIndex}
                        className={cn(
                          "absolute left-1 right-1 p-1 rounded text-xs",
                          getStatusColor(idea.status)
                        )}
                        style={{
                          top: `${(new Date(idea.dueDate).getMinutes() / 60) * 100}%`,
                          minHeight: '24px'
                        }}
                      >
                        <div className="flex items-center gap-1">
                          {idea.platform === 'Instagram' && (
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                            </svg>
                          )}
                          {idea.platform === 'TikTok' && (
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                            </svg>
                          )}
                          <span className="truncate">{idea.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => (
    <div className="border border-border/50 rounded-lg p-6 bg-card/50">
      <div className="grid grid-cols-7 text-sm font-medium mb-4 text-center">
        <div>Lunes</div>
        <div>Martes</div>
        <div>Miércoles</div>
        <div>Jueves</div>
        <div>Viernes</div>
        <div>Sábado</div>
        <div>Domingo</div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: getFirstDayOfMonth(currentMonth) }, (_, i) => (
          <div key={`empty-${i}`} className="h-24" />
        ))}
        
        {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
          const ideas = getContentIdeasForDate(date);
          
          return (
            <div
              key={i}
              className={cn(
                "h-24 p-2 border border-border/50 rounded-lg",
                selectedDate.getDate() === i + 1 && 
                selectedDate.getMonth() === currentMonth.getMonth() && 
                selectedDate.getFullYear() === currentMonth.getFullYear() && 
                "bg-accent/50",
                "hover:bg-accent/30 cursor-pointer"
              )}
              onClick={() => setSelectedDate(date)}
            >
              <div className="font-medium mb-1">{i + 1}</div>
              <div className="space-y-1">
                {ideas.map((idea, ideaIndex) => (
                  <div 
                    key={ideaIndex}
                    className={`text-xs p-1 rounded truncate ${getStatusColor(idea.status)}`}
                  >
                    {idea.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderYearView = () => (
    <div className="border border-border/50 rounded-lg p-6 bg-card/50">
      <div className="grid grid-cols-3 gap-6">
        {getMonthsInYear(currentMonth.getFullYear()).map((date, monthIndex) => (
          <div key={monthIndex} className="space-y-2">
            <h3 className="font-medium">{months[monthIndex]}</h3>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: getDaysInMonth(date) }, (_, i) => {
                const dayDate = new Date(date.getFullYear(), date.getMonth(), i + 1);
                const hasEvents = getContentIdeasForDate(dayDate).length > 0;
                return (
                  <div
                    key={i}
                    className={cn(
                      "h-6 w-6 flex items-center justify-center text-xs rounded",
                      hasEvents && "bg-[#4CAF50]/20 text-[#4CAF50]",
                      selectedDate.toDateString() === dayDate.toDateString() && "bg-accent/50"
                    )}
                    onClick={() => {
                      setSelectedDate(dayDate);
                      setViewMode('month');
                      setCurrentMonth(dayDate);
                    }}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border/50 p-4 flex flex-col bg-card/50">
        {/* Today's Info */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Today Info</h2>
          <div className="space-y-3">
            {getTodayContentIdeas().map((idea, index) => (
              <div key={index} className={`p-3 rounded-lg ${getStatusColor(idea.status)}`}>
                <h3 className="font-medium text-sm">{idea.title}</h3>
                <p className="text-xs opacity-80 mt-1">{idea.description}</p>
              </div>
            ))}
            {getTodayContentIdeas().length === 0 && (
              <p className="text-sm text-gray-400">No content scheduled for today</p>
            )}
          </div>
        </div>

        {/* Next Days Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Next Days Info</h2>
          <div className="space-y-3">
            {getUpcomingContentIdeas().map((idea, index) => (
              <div key={index} className={`p-3 rounded-lg ${getStatusColor(idea.status)}`}>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium text-sm">{idea.title}</h3>
                  <span className="text-xs opacity-80">
                    {new Date(idea.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs opacity-80">{idea.description}</p>
              </div>
            ))}
            {getUpcomingContentIdeas().length === 0 && (
              <p className="text-sm text-gray-400">No upcoming content scheduled</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">Calendario de Contenido</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-accent/50 rounded-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-lg">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button 
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-accent/50 rounded-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* View Mode Filter */}
            <div className="bg-[#1a1a1a] rounded-lg p-1 flex items-center">
              <button
                onClick={() => setViewMode('week')}
                className={cn(
                  "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                  viewMode === 'week' ? "bg-[#4CAF50] text-white" : "text-gray-400 hover:text-white"
                )}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={cn(
                  "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                  viewMode === 'month' ? "bg-[#4CAF50] text-white" : "text-gray-400 hover:text-white"
                )}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('year')}
                className={cn(
                  "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                  viewMode === 'year' ? "bg-[#4CAF50] text-white" : "text-gray-400 hover:text-white"
                )}
              >
                Year
              </button>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] flex items-center"
            >
              Agregar evento de contenido
              <Plus className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'year' && renderYearView()}

        {/* Selected Date Events */}
        {getContentIdeasForDate(selectedDate).length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-4">
              Content Ideas for {selectedDate.toLocaleDateString()}
            </h2>
            <div className="space-y-3">
              {getContentIdeasForDate(selectedDate).map((idea, i) => (
                <div key={i} className={`p-4 rounded-lg ${getStatusColor(idea.status)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{idea.title}</span>
                    <span className="text-sm opacity-80 capitalize">({idea.status})</span>
                  </div>
                  <p className="text-sm opacity-80">{idea.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Content Modal */}
      {isAddModalOpen && (
        <AddContentModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={async () => {
            if (auth.currentUser) {
              const ideas = await getUserContentIdeas(auth.currentUser.uid);
              const allIdeas = Object.values(ideas).flat();
              setContentIdeas(allIdeas);
            }
          }}
        />
      )}
    </div>
  );
} 