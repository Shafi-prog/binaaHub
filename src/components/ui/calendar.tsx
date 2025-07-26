import React from 'react';

interface CalendarProps {
  mode?: 'single' | 'multiple' | 'range';
  selected?: Date | Date[] | null;
  onSelect?: (date: Date | Date[] | null | undefined) => void;
  className?: string;
  disabled?: (date: Date) => boolean;
}

export function Calendar({ mode = 'single', selected, onSelect, className, disabled }: CalendarProps) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const days: React.ReactElement[] = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const isSelected = selected instanceof Date && 
      date.toDateString() === selected.toDateString();
    const isDisabled = disabled ? disabled(date) : false;
    
    days.push(
      <button
        key={day}
        className={`p-2 text-sm rounded hover:bg-gray-100 ${
          isSelected ? 'bg-blue-500 text-white' : ''
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !isDisabled && onSelect?.(date)}
        disabled={isDisabled}
      >
        {day}
      </button>
    );
  }
  
  return (
    <div className={`p-4 border rounded-lg bg-white ${className}`}>
      <div className="grid grid-cols-7 gap-1 text-center">
        <div className="p-2 text-sm font-medium">Sun</div>
        <div className="p-2 text-sm font-medium">Mon</div>
        <div className="p-2 text-sm font-medium">Tue</div>
        <div className="p-2 text-sm font-medium">Wed</div>
        <div className="p-2 text-sm font-medium">Thu</div>
        <div className="p-2 text-sm font-medium">Fri</div>
        <div className="p-2 text-sm font-medium">Sat</div>
        {days}
      </div>
    </div>
  );
}
