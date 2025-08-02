// Calendar.js
import React, { useState } from 'react';

function Calendar() {
  const [currentDate] = useState(new Date());
  
  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date().getDate();
  const todayMonth = new Date().getMonth();
  const todayYear = new Date().getFullYear();
  
  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get first day of month and number of days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
  
  // Create calendar grid
  const calendarDays = [];
  
  // Add previous month's trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPrevMonth: true
    });
  }
  
  // Add current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day: day,
      isCurrentMonth: true,
      isToday: day === today && currentMonth === todayMonth && currentYear === todayYear
    });
  }
  
  // Add next month's leading days to complete the grid
  const remainingDays = 42 - calendarDays.length; // 6 rows × 7 days = 42
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day: day,
      isCurrentMonth: false,
      isNextMonth: true
    });
  }
  
  return (
    <div className="calendar-card">
      <h3>Calendar - {monthNames[currentMonth]} {currentYear}</h3>
      
      <div className="calendar-grid">
        {/* Day headers */}
        <div className="calendar-header">
          {dayNames.map((dayName) => (
            <div key={dayName} className="calendar-day-header">
              {dayName}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="calendar-body">
          {calendarDays.map((dateObj, index) => (
            <div
              key={index}
              className={`calendar-day ${
                dateObj.isCurrentMonth ? 'current-month' : 'other-month'
              } ${dateObj.isToday ? 'today' : ''}`}
            >
              {dateObj.day}
            </div>
          ))}
        </div>
      </div>
      
      <div className="calendar-info">
        <p>Today: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default Calendar;