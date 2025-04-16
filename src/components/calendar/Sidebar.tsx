"use client";

import * as React from "react";
import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentIdea } from "@/lib/types/content";
import { getPlatformColor, getPlatformIcon, Platform } from '@/lib/utils/platformUtils';
import { PLATFORM_COLORS } from '@/lib/utils/platformUtils';

interface SidebarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  todayEvents: ContentIdea[];
  tomorrowEvents: ContentIdea[];
  vacations: Array<{
    name: string;
    startDate: Date;
    endDate: Date;
  }>;
}

export default function Sidebar({
  selectedDate,
  onDateSelect,
  todayEvents,
  tomorrowEvents,
  vacations,
}: SidebarProps) {
  // Use the current month instead of maintaining a separate state
  const currentMonth = new Date();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert to Monday-based
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDateRange = (start: Date, end: Date) => {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="w-80 h-full rounded-lg border-r border-border/50 bg-card/50 p-4 overflow-y-auto">
      {/* Mini Calendar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        
        <div className="grid grid-cols-7 gap-0.5 text-center text-sm mb-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-muted-foreground">{day[0]}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: getFirstDayOfMonth(currentMonth) }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}
          
          {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            
            return (
              <button
                key={i}
                onClick={() => onDateSelect(date)}
                className={cn(
                  "p-1.5 rounded hover:bg-accent/20 text-sm",
                  isToday && "bg-accent/20 font-semibold",
                  isSelected && "ring-2 ring-primary"
                )}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Events */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Today</h3>
        <div className="space-y-2">
          {todayEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events scheduled</p>
          ) : (
            todayEvents.map((event, index) => (
              <div
                key={index}
                className="p-2 rounded bg-accent/10 hover:bg-accent/20 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className={PLATFORM_COLORS[event.platform as Platform].text}>
                      {getPlatformIcon(event.platform as Platform)}
                    </div>
                    <span className={PLATFORM_COLORS[event.platform as Platform].text}>
                      {event.title}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(new Date(event.dueDate))}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tomorrow's Events */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Tomorrow</h3>
        <div className="space-y-2">
          {tomorrowEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events scheduled</p>
          ) : (
            tomorrowEvents.map((event, index) => (
              <div
                key={index}
                className="p-2 rounded bg-accent/10 hover:bg-accent/20 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className={PLATFORM_COLORS[event.platform as Platform].text}>
                      {getPlatformIcon(event.platform as Platform)}
                    </div>
                    <span className={PLATFORM_COLORS[event.platform as Platform].text}>
                      {event.title}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(new Date(event.dueDate))}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Vacations */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Vacations</h3>
        <div className="space-y-2">
          {vacations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No vacations scheduled</p>
          ) : (
            vacations.map((vacation, index) => (
              <div
                key={index}
                className="p-2 rounded bg-accent/10"
              >
                <div className="font-medium text-primary">{vacation.name}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDateRange(vacation.startDate, vacation.endDate)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 