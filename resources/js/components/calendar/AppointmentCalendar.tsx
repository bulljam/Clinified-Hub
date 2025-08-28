import { Box, Paper, Typography } from '@mui/material';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';
import AppointmentModal from './AppointmentModal';

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


const EventComponent = ({ event }: { event: CalendarEvent }) => {
  const { user, provider, status, payment_status } = event.resource;
  
  let backgroundColor = '#9e9e9e';
  let borderColor = '#757575';
  
  switch (status) {
    case 'pending':
      backgroundColor = '#ffc107';
      borderColor = '#ff8f00';
      break;
    case 'confirmed':
      backgroundColor = '#4caf50';
      borderColor = '#2e7d32';
      break;
    case 'cancelled':
      backgroundColor = '#f44336';
      borderColor = '#c62828';
      break;
  }
  
  return (
    <div 
      style={{
        backgroundColor,
        border: `2px solid ${borderColor}`,
        borderRadius: '4px',
        color: 'white',
        fontSize: '11px',
        fontWeight: 'bold',
        padding: '2px 4px',
        lineHeight: 1.2,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div style={{ fontWeight: 'bold' }}>
        {user.name}
      </div>
      <div style={{ fontSize: '10px', opacity: 0.9 }}>
        Dr. {provider.name}
      </div>
      {payment_status === 'paid' && (
        <div style={{ fontSize: '9px', opacity: 0.9 }}>
          ✓ Paid
        </div>
      )}
    </div>
  );
};

export default function AppointmentCalendar({
  appointments,
  onSelectEvent,
  view = 'month',
}: AppointmentCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [modalOpen, setModalOpen] = useState(false);


  const events: CalendarEvent[] = (appointments || []).map((appointment) => {
    // Extract just the date part (YYYY-MM-DD) from the datetime string
    const dateOnly = appointment.date.split('T')[0];
    const dateTimeString = `${dateOnly}T${appointment.time}`;
    
    const start = new Date(dateTimeString);
    const end = new Date(start.getTime() + 30 * 60000);

    return {
      id: appointment.id,
      title: `${appointment.provider.name} – ${appointment.user.name}`,
      start: start,
      end: end,
      resource: appointment,
    };
  });

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setModalOpen(true);
    onSelectEvent?.(event);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
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
          defaultView={view as any}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          onSelectEvent={handleSelectEvent}
          components={{
            event: EventComponent,
          }}
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

      <AppointmentModal
        open={modalOpen}
        onClose={handleCloseModal}
        appointment={selectedEvent?.resource || null}
      />
    </Box>
  );
}