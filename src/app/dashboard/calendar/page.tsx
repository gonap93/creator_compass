"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import { auth } from '@/lib/firebase/firebase';
import { getUserContentIdeas } from '@/lib/firebase/contentUtils';
import { ContentIdea } from '@/lib/types/content';
import AddContentModal from '@/components/AddContentModal';
import MiniCalendar from '@/components/MiniCalendar';
import Sidebar from '@/components/calendar/Sidebar';
import { getPlatformColor, getPlatformIcon, Platform } from '@/lib/utils/platformUtils';

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

  const formatDateRange = (start: Date, end: Date): string => {
    const startMonth = start.toLocaleString('default', { month: 'short' });
    const endMonth = end.toLocaleString('default', { month: 'short' });
    const startDay = start.getDate();
    const endDay = end.getDate();
    const year = start.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${startMonth} ${year}`;
    } else {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
    }
  };

  const getNavigationTitle = (): string => {
    switch (viewMode) {
      case 'year':
        return currentMonth.getFullYear().toString();
      case 'month':
        return currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
      case 'week':
        const weekDates = getWeekDates(currentMonth);
        return formatDateRange(weekDates[0], weekDates[6]);
      default:
        return '';
    }
  };

  const navigateView = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    
    switch (viewMode) {
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
    }
    
    setCurrentMonth(newDate);
    setSelectedDate(newDate);
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

  const getTomorrowContentIdeas = (): ContentIdea[] => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return contentIdeas.filter(idea => 
      new Date(idea.dueDate).toDateString() === tomorrow.toDateString()
    );
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

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentMonth(date);
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates(currentMonth);
    const timeSlots = getTimeSlots();
    const today = new Date();

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
                date.toDateString() === today.toDateString() && "bg-accent/20"
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
                      date.toDateString() === today.toDateString() && "bg-accent/10"
                    )}
                  >
                    {ideas.map((idea, ideaIndex) => {
                      const eventHeight = 24; // height in pixels
                      const verticalGap = 4; // gap between events
                      const topOffset = ideaIndex * (eventHeight + verticalGap);
                      
                      return (
                        <div
                          key={ideaIndex}
                          className={cn(
                            "absolute left-1 right-1 p-1 rounded text-xs",
                            getPlatformColor(idea.platform as Platform)
                          )}
                          style={{
                            top: `${topOffset}px`,
                            height: `${eventHeight}px`
                          }}
                        >
                          <div className="flex items-center gap-1 h-full overflow-hidden">
                            {getPlatformIcon(idea.platform as Platform)}
                            <span className="truncate">{idea.title}</span>
                          </div>
                        </div>
                      );
                    })}
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
                    className={cn(
                      "text-xs p-1 rounded truncate",
                      getPlatformColor(idea.platform as Platform)
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {getPlatformIcon(idea.platform as Platform)}
                      <span className="truncate">{idea.title}</span>
                    </div>
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

  // Mock vacations data - replace with real data later
  const mockVacations = [
    {
      name: "Summer Break",
      startDate: new Date(2024, 6, 1), // July 1
      endDate: new Date(2024, 6, 15), // July 15
    },
    {
      name: "Winter Holiday",
      startDate: new Date(2024, 11, 20), // December 20
      endDate: new Date(2024, 11, 31), // December 31
    },
  ];

  return (
    <div className="flex h-full">
      <Sidebar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        todayEvents={getTodayContentIdeas()}
        tomorrowEvents={getTomorrowContentIdeas()}
        vacations={mockVacations}
      />
      <div className="flex-1 p-6">
        {/* Existing calendar content */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">Calendar</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateView('prev')}
                className="p-2 hover:bg-accent/20 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-lg font-medium min-w-[200px] text-center">
                {getNavigationTitle()}
              </span>
              <button
                onClick={() => navigateView('next')}
                className="p-2 hover:bg-accent/20 rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-accent/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('week')}
                className={cn(
                  "px-3 py-1 rounded-md text-sm",
                  viewMode === 'week' && "bg-background"
                )}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={cn(
                  "px-3 py-1 rounded-md text-sm",
                  viewMode === 'month' && "bg-background"
                )}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('year')}
                className={cn(
                  "px-3 py-1 rounded-md text-sm",
                  viewMode === 'year' && "bg-background"
                )}
              >
                Year
              </button>
            </div>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-accent/20 hover:bg-accent/30 rounded-md"
            >
              Today
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          </div>
        </div>

        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'year' && renderYearView()}
      </div>

      {isAddModalOpen && (
        <AddContentModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={() => {
            setIsAddModalOpen(false);
            // Refresh content ideas
            if (auth.currentUser) {
              getUserContentIdeas(auth.currentUser.uid).then(ideas => {
                const allIdeas = Object.values(ideas).flat();
                setContentIdeas(allIdeas);
              });
            }
          }}
        />
      )}
    </div>
  );
} 