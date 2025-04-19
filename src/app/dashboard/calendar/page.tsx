"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import { auth } from '@/lib/firebase/firebase';
import { getUserContentIdeas } from '@/lib/firebase/contentUtils';
import { ContentIdea } from '@/lib/types/content';
import AddContentModal from '@/components/AddContentModal';
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
      <div className="border border-[#333] rounded-lg bg-[#1a1a1a]">
        {/* Header with days */}
        <div className="grid grid-cols-8 text-sm font-medium border-b border-[#333]">
          {/* Empty cell for time column */}
          <div className="p-4 text-center border-r border-[#333] text-gray-400"></div>
          {/* Day columns */}
          {weekDates.map((date, i) => (
            <div 
              key={i}
              className={cn(
                "p-4 text-center border-r border-[#333] text-white",
                date.toDateString() === today.toDateString() && "bg-[#4CAF50]/10"
              )}
            >
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][i]}
              <div className="text-xs text-gray-400 mt-1">
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="relative">
          {timeSlots.map((slot, slotIndex) => (
            <div key={slotIndex} className="grid grid-cols-8">
              {/* Time marker */}
              <div className="p-2 text-xs text-gray-400 border-r border-[#333] text-center">
                {formatTime(slot.hour, slot.minute)}
              </div>
              
              {/* Day columns */}
              {weekDates.map((date, dateIndex) => {
                const ideas = getContentIdeasForDateTime(date, slot.hour);
                return (
                  <div 
                    key={dateIndex}
                    className={cn(
                      "p-2 border-r border-b border-[#333] min-h-[60px] relative",
                      date.toDateString() === today.toDateString() && "bg-[#4CAF50]/5"
                    )}
                  >
                    {ideas.map((idea, ideaIndex) => (
                      <div
                        key={ideaIndex}
                        className={cn(
                          "absolute left-1 right-1 p-1 rounded text-xs",
                          getPlatformColor(idea.platform as Platform),
                          "hover:opacity-90 transition-opacity cursor-pointer"
                        )}
                        style={{
                          top: `${ideaIndex * 28}px`,
                          height: '24px'
                        }}
                      >
                        <div className="flex items-center gap-1 h-full overflow-hidden">
                          {getPlatformIcon(idea.platform as Platform)}
                          <span className="truncate text-white">{idea.title}</span>
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

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const today = new Date();
    
    return (
      <div className="border border-[#333] rounded-lg bg-[#1a1a1a]">
        {/* Header */}
        <div className="grid grid-cols-7 text-sm font-medium border-b border-[#333]">
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, i) => (
            <div key={i} className="p-4 text-center border-r border-[#333] text-white last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {/* Empty cells for days before the first day of the month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2 border-r border-b border-[#333] min-h-[120px]" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
            const isToday = date.toDateString() === today.toDateString();
            const ideas = getContentIdeasForDate(date);

            return (
              <div
                key={i}
                className={cn(
                  "p-2 border-r border-b border-[#333] min-h-[120px] relative",
                  isToday && "bg-[#4CAF50]/5",
                  (i + firstDayOfMonth + 1) % 7 === 0 && "border-r-0"
                )}
              >
                <span className={cn(
                  "inline-block w-6 h-6 text-center rounded-full text-sm",
                  isToday && "bg-[#4CAF50] text-white"
                )}>
                  {i + 1}
                </span>
                <div className="mt-2 space-y-1">
                  {ideas.map((idea, ideaIndex) => (
                    <div
                      key={ideaIndex}
                      className={cn(
                        "p-1 rounded text-xs",
                        getPlatformColor(idea.platform as Platform),
                        "hover:opacity-90 transition-opacity cursor-pointer"
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {getPlatformIcon(idea.platform as Platform)}
                        <span className="truncate text-white">{idea.title}</span>
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
  };

  const renderYearView = () => (
    <div className="border border-[#333] rounded-lg bg-[#1a1a1a] p-6">
      <div className="grid grid-cols-3 gap-6">
        {getMonthsInYear(currentMonth.getFullYear()).map((date, monthIndex) => (
          <div key={monthIndex} className="space-y-2">
            <h3 className="font-medium text-white">{months[monthIndex]}</h3>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: getDaysInMonth(date) }, (_, i) => {
                const dayDate = new Date(date.getFullYear(), date.getMonth(), i + 1);
                const hasEvents = getContentIdeasForDate(dayDate).length > 0;
                const isToday = dayDate.toDateString() === new Date().toDateString();
                return (
                  <div
                    key={i}
                    className={cn(
                      "h-6 w-6 flex items-center justify-center text-xs rounded cursor-pointer hover:bg-[#4CAF50]/10 transition-colors",
                      hasEvents && "bg-[#4CAF50]/20 text-[#4CAF50]",
                      isToday && "ring-2 ring-[#4CAF50]",
                      selectedDate.toDateString() === dayDate.toDateString() && "bg-[#4CAF50]/30"
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

  const renderMiniCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    
    return (
      <div className="mb-8">
        <h2 className="text-xl mb-4">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} className="text-gray-400">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            
            return (
              <div
                key={i}
                className={cn(
                  "h-8 flex items-center justify-center rounded cursor-pointer hover:bg-gray-700/50",
                  isToday && "bg-blue-500/20",
                  isSelected && "ring-2 ring-blue-500"
                )}
                onClick={() => setSelectedDate(date)}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMainCalendar = () => {
    return (
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl">Calendar</h1>
            <div className="flex items-center gap-2">
              <button onClick={() => navigateView('prev')} className="p-2">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-lg">{getNavigationTitle()}</span>
              <button onClick={() => navigateView('next')} className="p-2">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex rounded-lg bg-gray-800">
              <button
                onClick={() => setViewMode('week')}
                className={cn(
                  "px-4 py-2 rounded-l-lg",
                  viewMode === 'week' && "bg-gray-700"
                )}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={cn(
                  "px-4 py-2",
                  viewMode === 'month' && "bg-gray-700"
                )}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('year')}
                className={cn(
                  "px-4 py-2 rounded-r-lg",
                  viewMode === 'year' && "bg-gray-700"
                )}
              >
                Year
              </button>
            </div>
            <button
              onClick={goToToday}
              className="px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Today
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Render the appropriate view based on viewMode */}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'year' && renderYearView()}
      </div>
    );
  };

  return (
    <div className="flex gap-8 p-6">
      {/* Left Sidebar */}
      <div className="w-80">
        <div className="border border-[#333] rounded-lg bg-[#1a1a1a] p-6 space-y-8">
          {renderMiniCalendar()}

          {/* Today's Events */}
          <div>
            <h3 className="text-lg font-medium mb-3">Today</h3>
            <div className="space-y-2">
              {getTodayContentIdeas().map((idea, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2"
                >
                  <div className={cn(
                    "flex items-center gap-2",
                    idea.platform.toLowerCase() === 'tiktok' && "text-blue-400",
                    idea.platform.toLowerCase() === 'instagram' && "text-purple-400"
                  )}>
                    {getPlatformIcon(idea.platform as Platform)}
                    <span>{idea.title}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(idea.dueDate).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
              ))}
              {getTodayContentIdeas().length === 0 && (
                <div className="text-gray-400">No events scheduled</div>
              )}
            </div>
          </div>

          {/* Tomorrow */}
          <div>
            <h3 className="text-lg font-medium mb-3">Tomorrow</h3>
            <div className="text-gray-400">
              No events scheduled
            </div>
          </div>
        </div>
      </div>

      {/* Main Calendar */}
      {renderMainCalendar()}

      {/* Add Content Modal */}
      <AddContentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async () => {
          if (auth.currentUser) {
            const userIdeas = await getUserContentIdeas(auth.currentUser.uid);
            const allIdeas = Object.values(userIdeas).flat();
            setContentIdeas(allIdeas);
          }
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
} 