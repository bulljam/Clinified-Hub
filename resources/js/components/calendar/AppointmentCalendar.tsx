import { Box, Paper, Typography } from '@mui/material';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface Appointment {
  id: number;
  user_id: number;
  provider_id: number;
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

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onSelectEvent?: (event: CalendarEvent) => void;
  view?: 'month' | 'week' | 'day';
}



export default function AppointmentCalendar({
  appointments,
  onSelectEvent,
  view: initialView = 'month',
}: AppointmentCalendarProps) {
  const [currentView, setCurrentView] = useState(initialView);


  // Remove events display - only show background highlighting
  const events: CalendarEvent[] = [];


  // Create sets of appointment days and exact time slots for efficient lookup
  const appointmentDays = new Set();
  const appointmentSlots = new Set();
  
  // Add hardcoded test appointment: August 25, 2025 at 10:00 AM
  appointmentDays.add('2025-08-25');
  appointmentSlots.add('2025-08-25T10:00');
  
  appointments.forEach(appointment => {
    // Extract date and parse appointment datetime
    const dateOnly = appointment.date.split('T')[0];
    const appointmentDate = new Date(`${dateOnly}T${appointment.time}`);
    
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
    
    // Check for exact match and also check the 30-minute slot that contains this time
    const exactMatch = appointmentSlots.has(slotKey);
    
    // Also check if this slot is within a 30-minute appointment window
    // Since appointments are typically 30 minutes, check if this slot falls within any appointment's time range
    let withinAppointmentWindow = false;
    for (const appointmentSlot of appointmentSlots) {
      const [appointmentDate, appointmentTime] = appointmentSlot.split('T');
      if (appointmentDate === `${year}-${month}-${day}`) {
        const [appointmentHours, appointmentMinutes] = appointmentTime.split(':').map(Number);
        const appointmentStart = appointmentHours * 60 + appointmentMinutes;
        const appointmentEnd = appointmentStart + 30; // 30-minute appointments
        
        const slotTime = parseInt(hours) * 60 + parseInt(minutes);
        
        if (slotTime >= appointmentStart && slotTime < appointmentEnd) {
          withinAppointmentWindow = true;
          break;
        }
      }
    }
      
    if (exactMatch || withinAppointmentWindow) {
      return {
        style: {
          backgroundColor: '#e6f3ff',
        }
      };
    }
    return {};
  };

  return (
    <Box>
      {events.length === 0 && (
        <Box mb={2} p={2} bgcolor="info.light" borderRadius={1}>
          <Typography variant="body2">
            No appointments found for the current filters. Events: {events.length}
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
          view={currentView as any}
          onView={(newView) => setCurrentView(newView)}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          dayPropGetter={dayPropGetter}
          slotPropGetter={slotPropGetter}
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