"use client";

import * as React from "react";
import { useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

type ContentEvent = {
  date: Date;
  title: string;
  type: 'sale' | 'holiday' | 'launch' | 'social';
  description: string;
};

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  // Example content calendar events
  const contentEvents: ContentEvent[] = [
    {
      date: new Date(2024, 3, 15), // April 15, 2024
      title: "Spring Sale",
      type: "sale",
      description: "Major spring collection launch with 30% off"
    },
    {
      date: new Date(2024, 3, 22), // April 22, 2024
      title: "Earth Day",
      type: "social",
      description: "Sustainable products showcase"
    },
    {
      date: new Date(2024, 4, 1), // May 1, 2024
      title: "Summer Collection",
      type: "launch",
      description: "New summer collection preview"
    },
    {
      date: new Date(2024, 4, 12), // May 12, 2024
      title: "Mother's Day",
      type: "holiday",
      description: "Special mother's day promotion"
    }
  ];

  const todayEvents = [
    { time: "08:00", title: "Daily Standup", type: "meeting" },
    { time: "09:00", title: "Content Planning", type: "review" },
    { time: "10:00", title: "Social Media Review", type: "meeting" },
    { time: "11:00", title: "Campaign Progress", type: "meeting" },
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

  const getContentEventsForDate = (date: Date): ContentEvent[] => {
    return contentEvents.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const getEventTypeColor = (type: ContentEvent['type']) => {
    switch (type) {
      case 'sale': return 'bg-red-500';
      case 'holiday': return 'bg-blue-500';
      case 'launch': return 'bg-green-500';
      case 'social': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border/50 p-4 flex flex-col bg-card/50">
        <div className="mb-8">
          <h2 className="text-xl font-semibold">{months[new Date().getMonth()]}</h2>
          <div className="grid grid-cols-7 text-xs mt-4 mb-2">
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
            <div>S</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-sm">
            {Array.from({ length: 31 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "w-6 h-6 flex items-center justify-center rounded-full",
                  i + 1 === new Date().getDate() && "bg-primary text-primary-foreground"
                )}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            📅 Tareas de Contenido de Hoy
          </h3>
          <div className="space-y-2">
            {todayEvents.map((event, i) => (
              <div key={i} className="flex items-center text-sm">
                <span className="text-muted-foreground w-12">{event.time}</span>
                <span>{event.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Event Types */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Tipos de Eventos</h3>
          <div className="space-y-2">
            {(['sale', 'holiday', 'launch', 'social'] as const).map((type) => (
              <div key={type} className="flex items-center gap-2 text-sm">
                <div className={cn("w-3 h-3 rounded-full", getEventTypeColor(type))} />
                <span className="capitalize">
                  {type === 'sale' && 'Venta'}
                  {type === 'holiday' && 'Festivo'}
                  {type === 'launch' && 'Lanzamiento'}
                  {type === 'social' && 'Social'}
                </span>
              </div>
            ))}
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
            <button className="p-2 hover:bg-accent/50 rounded-lg border border-border/50">
              <Search className="h-4 w-4" />
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center">
              Agregar evento de contenido
              <Plus className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Calendar */}
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
            {/* Empty cells for days before the first day of the month */}
            {Array.from({ length: getFirstDayOfMonth(currentMonth) }, (_, i) => (
              <div key={`empty-${i}`} className="h-24" />
            ))}
            
            {/* Days of the month */}
            {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => {
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
              const events = getContentEventsForDate(date);
              
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
                    {events.map((event, eventIndex) => (
                      <div 
                        key={eventIndex}
                        className="text-xs p-1 rounded truncate"
                        style={{ backgroundColor: `${getEventTypeColor(event.type)}30` }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Events */}
        {getContentEventsForDate(selectedDate).length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-4">
              Eventos de Contenido para {selectedDate.toLocaleDateString()}
            </h2>
            <div className="space-y-3">
              {getContentEventsForDate(selectedDate).map((event, i) => (
                <div key={i} className="p-4 rounded-lg bg-card/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn("w-2 h-2 rounded-full", getEventTypeColor(event.type))} />
                    <span className="font-medium">{event.title}</span>
                    <span className="text-sm text-muted-foreground capitalize">({event.type})</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 