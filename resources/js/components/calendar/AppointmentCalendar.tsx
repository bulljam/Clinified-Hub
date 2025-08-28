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

const getEventStyle = (event: CalendarEvent) => {
  const { status, payment_status } = event.resource;
  
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

  return {
    style: {
      backgroundColor,
      borderColor,
      border: `2px solid ${borderColor}`,
      borderRadius: '4px',
      color: 'white',
      fontSize: '12px',
      padding: '2px 4px',
    },
  };
};

const EventComponent = ({ event }: { event: CalendarEvent }) => {
  const { user, provider, status, payment_status } = event.resource;
  
  return (
    <Box sx={{ fontSize: '11px', lineHeight: 1.2 }}>
      <Typography variant="caption" display="block" sx={{ fontWeight: 'bold' }}>
        {user.name}
      </Typography>
      <Typography variant="caption" display="block">
        Dr. {provider.name}
      </Typography>
      {payment_status === 'paid' && (
        <Typography variant="caption" display="block" sx={{ opacity: 0.9 }}>
          ✓ Paid
        </Typography>
      )}
    </Box>
  );
};

export default function AppointmentCalendar({
  appointments,
  onSelectEvent,
  view = 'month',
}: AppointmentCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const events: CalendarEvent[] = appointments.map((appointment) => {
    const startDateTime = moment(`${appointment.date} ${appointment.time}`).toDate();
    const endDateTime = moment(startDateTime).add(1, 'hour').toDate();

    return {
      id: appointment.id,
      title: `${appointment.user.name} - Dr. ${appointment.provider.name}`,
      start: startDateTime,
      end: endDateTime,
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
          eventPropGetter={getEventStyle}
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
          min={moment().set({ hour: 8, minute: 0 }).toDate()}
          max={moment().set({ hour: 18, minute: 0 }).toDate()}
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