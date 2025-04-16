import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function MiniCalendar({ selectedDate, onDateSelect }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

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

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(newDate);
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#4CAF50]/10">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-1 hover:bg-[#4CAF50]/10 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        </button>
        <h3 className="text-sm font-medium text-gray-300">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={() => navigateMonth('next')}
          className="p-1 hover:bg-[#4CAF50]/10 rounded-lg transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
          <div key={day} className="text-center text-gray-400 py-1">
            {day}
          </div>
        ))}

        {Array.from({ length: getFirstDayOfMonth(currentMonth) }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => {
          const day = i + 1;
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={cn(
                "p-1 rounded-lg text-center hover:bg-[#4CAF50]/10 transition-colors",
                isSelected && "bg-[#4CAF50]/20 text-[#4CAF50]",
                isToday && !isSelected && "text-[#4CAF50]"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
} 