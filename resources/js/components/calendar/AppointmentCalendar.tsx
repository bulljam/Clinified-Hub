import { Box, Paper, Typography } from '@mui/material';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import React, { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface Appointment {
  id: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'paid';
  user: {
    id: number;
    name: string;
    email: string;
  };
  provider: {
    id: number;
    name: string;
    email: string;
  };
}

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Appointment;
}

type CalendarView = 'month' | 'week' | 'day' | 'work_week' | 'agenda';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onSelectEvent?: (event: CalendarEvent) => void;
  view?: CalendarView;
  userRole?: 'admin' | 'provider' | 'client';
}



export default function AppointmentCalendar({
  appointments,
  onSelectEvent,
  view: initialView = 'month',
  userRole = 'admin',
}: AppointmentCalendarProps) {
  const [currentView, setCurrentView] = useState<CalendarView>(initialView);


  const events: CalendarEvent[] = appointments.map(appointment => {
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    const endDate = new Date(appointmentDate.getTime() + 30 * 60 * 1000);
    
    const displayName = userRole === 'client' 
      ? `Dr. ${appointment.provider.name}` 
      : appointment.user.name;
    
    const statusText = appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1);
    
    return {
      id: appointment.id,
      title: `${displayName} - ${statusText}`,
      start: appointmentDate,
      end: endDate,
      resource: appointment,
    };
  });


  // Create sets of appointment days and exact time slots for efficient lookup
  const appointmentDays = new Set();
  const appointmentSlots = new Set();
  
  appointments.forEach(appointment => {
    // Extract date and parse appointment datetime
    const dateOnly = appointment.date.split('T')[0];
    
    // For day-level highlighting (month view): store just the date string
    appointmentDays.add(dateOnly); // e.g., "2025-08-31"
    
    // For slot-level highlighting (week/day views): store full datetime string
    const slotKey = `${dateOnly}T${appointment.time.substring(0, 5)}`; // e.g., "2025-08-31T09:30"
    appointmentSlots.add(slotKey);
  });
  
  const dayPropGetter = (date: Date) => {
    // Only highlight in month view - show days that have appointments
    if (currentView !== 'month') {
      return {};
    }
    
    // Use local date string instead of UTC to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    if (appointmentDays.has(dateString)) {
      return {
        style: {
          backgroundColor: '#e6f3ff',
        }
      };
    }
    return {};
  };

  const slotPropGetter = (date: Date) => {
    // For week/day views: highlight specific time slots with appointments
    if (currentView === 'month') {
      return {};
    }
    
    // Use local date string instead of UTC to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const slotKey = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    // Find appointment that matches this time slot
    let matchingAppointment = null;
    
    for (const appointment of appointments) {
      // Handle both date formats - with or without time component
      const appointmentDate = appointment.date.includes('T') 
        ? appointment.date.split('T')[0] 
        : appointment.date;
      
      // Extract time - handle both HH:MM:SS and HH:MM formats
      const timeStr = appointment.time.includes(':') 
        ? appointment.time.split(':').slice(0, 2).join(':')
        : appointment.time;
      
      if (appointmentDate === `${year}-${month}-${day}`) {
        const [appointmentHours, appointmentMinutes] = timeStr.split(':').map(Number);
        const appointmentStart = appointmentHours * 60 + appointmentMinutes;
        const appointmentEnd = appointmentStart + 30; // 30-minute slots
        
        const currentSlot = parseInt(hours) * 60 + parseInt(minutes);
        
        // Check if this slot falls within the appointment time window
        if (currentSlot >= appointmentStart && currentSlot < appointmentEnd) {
          matchingAppointment = appointment;
          break;
        }
      }
    }
    
    if (matchingAppointment) {
      const displayName = userRole === 'client' 
        ? `Dr. ${matchingAppointment.provider.name}` 
        : `${matchingAppointment.user.name}`;
      
      const statusColor = matchingAppointment.status === 'confirmed' ? '#4caf50' : 
                         matchingAppointment.status === 'cancelled' ? '#f44336' : '#ff9800';
      
      return {
        style: {
          backgroundColor: statusColor,
          color: 'white',
          fontWeight: 'bold',
          fontSize: '10px',
          padding: '2px',
          borderRadius: '3px',
          position: 'relative',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          lineHeight: '1.2',
          '--appointment-name': `"${displayName}"`,
          '--appointment-status': `"${matchingAppointment.status.toUpperCase()}"`,
        } as React.CSSProperties & { '--appointment-name': string; '--appointment-status': string },
        className: 'appointment-slot-with-content',
      };
    }
    
    return {};
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const appointment = event.resource;
    let backgroundColor = '#3174ad';
    
    if (appointment.status === 'confirmed') {
      backgroundColor = '#4caf50';
    } else if (appointment.status === 'cancelled') {
      backgroundColor = '#f44336';
    } else if (appointment.status === 'pending') {
      backgroundColor = '#ff9800';
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '2px 4px'
      }
    };
  };

  return (
    <Box>
      <style>{`
        .appointment-slot-with-content::before {
          content: var(--appointment-name);
          display: block;
          font-size: 10px;
          font-weight: bold;
          line-height: 1.1;
        }
        .appointment-slot-with-content::after {
          content: var(--appointment-status);
          display: block;
          font-size: 8px;
          opacity: 0.9;
          line-height: 1.1;
          margin-top: 1px;
        }
      `}</style>
      
      {appointments.length === 0 && (
        <Box mb={2} p={2} bgcolor="info.light" borderRadius={1}>
          <Typography variant="body2">
            No appointments found for the current filters.
          </Typography>
        </Box>
      )}
      
      <Paper sx={{ p: 2, height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 550 }}
          view={currentView}
          onView={(newView) => setCurrentView(newView)}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          dayPropGetter={dayPropGetter}
          slotPropGetter={slotPropGetter}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={onSelectEvent}
          formats={{
            timeGutterFormat: 'h:mm A',
            eventTimeRangeFormat: ({ start, end }) => 
              `${moment(start).format('h:mm A')} - ${moment(end).format('h:mm A')}`,
          }}
          step={30}
          timeslots={2}
          min={moment().set({ hour: 6, minute: 0 }).toDate()}
          max={moment().set({ hour: 20, minute: 0 }).toDate()}
          popup={true}
          showMultiDayTimes={true}
        />
      </Paper>
    </Box>
  );
}