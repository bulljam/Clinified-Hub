import { 
  Box, 
  Typography, 
  Avatar, 
  Card, 
  CardContent, 
  Fade, 
  Stack,
  IconButton,
  Tooltip,
  Button,
  ButtonGroup
} from '@mui/material';
import { Calendar, momentLocalizer, Views, NavigateAction, ToolbarProps } from 'react-big-calendar';
import moment from 'moment';
import React, { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  CalendarMonth as CalendarIcon,
  ViewWeek as WeekIcon,
  Today as DayIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
} from '@mui/icons-material';

const localizer = momentLocalizer(moment);

interface Appointment {
  id: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'on_hold' | 'cancelled';
  requires_refund?: boolean;
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
  selectedProvider?: {
    id: number;
    name: string;
    email: string;
  };
}



interface CustomToolbarProps extends ToolbarProps<CalendarEvent, object> {
  selectedProvider?: {
    id: number;
    name: string;
    email: string;
  };
}

const CustomToolbar = ({ label, onNavigate, onView, view, selectedProvider }: CustomToolbarProps) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} p={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: '#5c6bc0', width: 48, height: 48 }}>
          <CalendarIcon />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="#5c6bc0">
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedProvider
              ? `Dr. ${selectedProvider.name} - Appointment Schedule`
              : 'Healthcare Appointment Schedule'
            }
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <ButtonGroup variant="outlined" size="small">
          <Tooltip title="Previous">
            <IconButton 
              onClick={() => onNavigate('PREV')}
              sx={{ 
                borderRadius: '8px 0 0 8px',
                bgcolor: '#5c6bc0',
                color: 'white',
                '&:hover': { bgcolor: '#26418f' }
              }}
            >
              <PrevIcon />
            </IconButton>
          </Tooltip>
          <Button 
            onClick={() => onNavigate('TODAY')}
            sx={{ 
              bgcolor: 'white',
              color: '#5c6bc0',
              fontWeight: 600,
              '&:hover': { bgcolor: '#5c6bc0', color: 'white' }
            }}
          >
            Today
          </Button>
          <Tooltip title="Next">
            <IconButton 
              onClick={() => onNavigate('NEXT')}
              sx={{ 
                borderRadius: '0 8px 8px 0',
                bgcolor: '#5c6bc0',
                color: 'white',
                '&:hover': { bgcolor: '#26418f' }
              }}
            >
              <NextIcon />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup variant="outlined" size="small">
          <Button
            onClick={() => onView('month')}
            startIcon={<CalendarIcon />}
            variant={view === 'month' ? 'contained' : 'outlined'}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600,
              ...(view === 'month' ? {
                bgcolor: '#5c6bc0',
                color: 'white',
                '&:hover': { bgcolor: '#26418f' }
              } : {
                borderColor: '#5c6bc0',
                color: '#5c6bc0',
                '&:hover': { borderColor: '#26418f', bgcolor: 'rgba(92, 107, 192, 0.08)' }
              })
            }}
          >
            Month
          </Button>
          <Button
            onClick={() => onView('week')}
            startIcon={<WeekIcon />}
            variant={view === 'week' ? 'contained' : 'outlined'}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600,
              ...(view === 'week' ? {
                bgcolor: '#5c6bc0',
                color: 'white',
                '&:hover': { bgcolor: '#26418f' }
              } : {
                borderColor: '#5c6bc0',
                color: '#5c6bc0',
                '&:hover': { borderColor: '#26418f', bgcolor: 'rgba(92, 107, 192, 0.08)' }
              })
            }}
          >
            Week
          </Button>
          <Button
            onClick={() => onView('day')}
            startIcon={<DayIcon />}
            variant={view === 'day' ? 'contained' : 'outlined'}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600,
              ...(view === 'day' ? {
                bgcolor: '#5c6bc0',
                color: 'white',
                '&:hover': { bgcolor: '#26418f' }
              } : {
                borderColor: '#5c6bc0',
                color: '#5c6bc0',
                '&:hover': { borderColor: '#26418f', bgcolor: 'rgba(92, 107, 192, 0.08)' }
              })
            }}
          >
            Day
          </Button>
        </ButtonGroup>
      </Stack>
    </Box>
  );
};

const EventComponent = ({ event }: { event: CalendarEvent }) => {
  const appointment = event.resource;
  const isConfirmed = appointment.status === 'confirmed';
  const isPending = appointment.status === 'pending';
  
  return (
    <Box
      sx={{
        p: 0.5,
        borderRadius: 1,
        backgroundColor: isConfirmed ? '#2ECC71' : isPending ? '#F39C12' : '#E74C3C',
        color: 'white',
        fontSize: '0.75rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        minHeight: '24px',
        overflow: 'hidden',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 2,
        },
        transition: 'all 0.2s ease',
      }}
    >
      <Avatar sx={{ width: 16, height: 16, fontSize: '0.6rem', bgcolor: 'rgba(255,255,255,0.2)' }}>
        {event.title.charAt(0)}
      </Avatar>
      <Typography variant="caption" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
        {event.title}
      </Typography>
    </Box>
  );
};

export default function AppointmentCalendar({
  appointments,
  onSelectEvent,
  view: initialView = 'month',
  userRole = 'admin',
  selectedProvider,
}: AppointmentCalendarProps) {
  const [currentView, setCurrentView] = useState<CalendarView>(initialView);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());


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


  const appointmentDays = new Set();
  const appointmentSlots = new Set();
  const appointmentCounts = new Map<string, number>();
  
  appointments.forEach(appointment => {
    const dateOnly = appointment.date.split('T')[0];
    
    appointmentDays.add(dateOnly);
    
    appointmentCounts.set(dateOnly, (appointmentCounts.get(dateOnly) || 0) + 1);
    
    const slotKey = `${dateOnly}T${appointment.time.substring(0, 5)}`;
    appointmentSlots.add(slotKey);
  });
  
  const dayPropGetter = (date: Date) => {
    if (currentView !== 'month') {
      return {};
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const count = appointmentCounts.get(dateString) || 0;
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const isToday = dateString === todayString;

    if (isToday) {
      return {
        style: {
          position: 'relative',
          '--appointment-count': `"${count}"`,
          '--today-indicator': '"Today"',
        } as React.CSSProperties & { '--appointment-count': string; '--today-indicator': string },
        className: count > 0 ? 'today-with-appointments' : 'today-without-appointments',
      };
    }

    if (count > 0) {
      return {
        style: {
          backgroundColor: '#fff3e0',
          border: '2px solid #ff9800',
          borderRadius: '4px',
          position: 'relative',
          cursor: 'pointer',
          '--appointment-count': `"${count}"`,
        } as React.CSSProperties & { '--appointment-count': string },
        className: 'day-with-appointments',
      };
    }
    return {};
  };

  const slotPropGetter = (date: Date) => {
    if (currentView === 'month') {
      return {};
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    
    let matchingAppointment = null;
    
    for (const appointment of appointments) {
      const appointmentDate = appointment.date.includes('T') 
        ? appointment.date.split('T')[0] 
        : appointment.date;
      
      const timeStr = appointment.time.includes(':') 
        ? appointment.time.split(':').slice(0, 2).join(':')
        : appointment.time;
      
      if (appointmentDate === `${year}-${month}-${day}`) {
        const [appointmentHours, appointmentMinutes] = timeStr.split(':').map(Number);
        const appointmentStart = appointmentHours * 60 + appointmentMinutes;
        const appointmentEnd = appointmentStart + 30;
        
        const currentSlot = parseInt(hours) * 60 + parseInt(minutes);
        
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
      
      const statusColor = matchingAppointment.status === 'confirmed' ? '#2ECC71' : 
                         matchingAppointment.status === 'cancelled' ? '#E74C3C' : '#F39C12';
      
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
    let backgroundColor = '#5c6bc0';
    
    if (appointment.status === 'confirmed') {
      backgroundColor = '#2ECC71';
    } else if (appointment.status === 'cancelled') {
      backgroundColor = '#E74C3C';
    } else if (appointment.status === 'pending') {
      backgroundColor = '#F39C12';
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

  const handleSelectSlot = ({ start }: { start: Date }) => {
    if (currentView === 'month') {
      setCurrentDate(start);
      setCurrentView('day');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <style>{`
        /* Enhanced React Big Calendar Styling */
        .rbc-calendar {
          font-family: 'Roboto', sans-serif !important;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .rbc-header {
          background: linear-gradient(135deg, #5c6bc0 0%, #26418f 100%);
          color: white !important;
          font-weight: 600 !important;
          padding: 12px 8px !important;
          border: none !important;
          font-size: 0.9rem !important;
        }
        
        .rbc-month-view {
          border: none !important;
        }
        
        .rbc-date-cell {
          padding: 8px !important;
          border: 1px solid #f0f0f0 !important;
          transition: all 0.2s ease !important;
        }
        
        .rbc-date-cell:hover {
          background-color: #f8f9fa !important;
          transform: scale(1.02);
        }
        
        .rbc-today {
          background: linear-gradient(135deg, #e0e3ff 0%, #ccf7f7 100%) !important;
          border: 2px solid #5c6bc0 !important;
          box-shadow: 0 2px 8px rgba(92, 107, 192, 0.2) !important;
        }
        
        .rbc-time-slot:has(.rbc-label) {
          background-color: transparent !important;
          color: inherit !important;
          font-weight: inherit !important;
          font-size: inherit !important;
          padding: inherit !important;
          border-radius: inherit !important;
          position: inherit !important;
          text-align: inherit !important;
          display: flex !important;
          flex-direction: inherit !important;
          justify-content: center !important;
          align-items: center !important;
          line-height: inherit !important;
        }
        
        .rbc-time-gutter .rbc-time-slot {
          border-right: 2px solid #5c6bc0 !important;
          background: linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%) !important;
          font-weight: 500 !important;
          color: #5c6bc0 !important;
        }
        
        .appointment-slot-with-content:not(:has(.rbc-label))::before {
          content: var(--appointment-name);
          display: block;
          font-size: 10px;
          font-weight: bold;
          line-height: 1.1;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .appointment-slot-with-content:not(:has(.rbc-label))::after {
          content: var(--appointment-status);
          display: block;
          font-size: 8px;
          opacity: 0.9;
          line-height: 1.1;
          margin-top: 1px;
        }
        
        .rbc-event {
          border-radius: 8px !important;
          border: none !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          transition: all 0.2s ease !important;
        }
        
        .rbc-event:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
        }
        
        .rbc-event-content {
          font-weight: 600 !important;
        }
        
        /* Appointment count display in month view */
        .day-with-appointments::after {
          content: var(--appointment-count);
          position: absolute;
          bottom: 2px;
          right: 2px;
          background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
          color: white;
          font-weight: bold;
          font-size: 10px;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          box-shadow: 0 2px 4px rgba(255, 152, 0, 0.3);
          border: 2px solid white;
          z-index: 10;
          min-width: 18px;
          font-family: 'Roboto', sans-serif;
        }
        
        .day-with-appointments {
          transition: all 0.2s ease !important;
        }

        .day-with-appointments:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
          border-color: #f57c00 !important;
          background-color: #fff8e1 !important;
        }

        .day-with-appointments:hover::after {
          transform: scale(1.1);
          box-shadow: 0 3px 6px rgba(255, 152, 0, 0.5);
        }

        /* Today indicators */
        .today-with-appointments::before {
          content: var(--today-indicator);
          position: absolute;
          top: 2px;
          left: 2px;
          background: linear-gradient(135deg, #5c6bc0 0%, #26418f 100%);
          color: white;
          font-weight: bold;
          font-size: 8px;
          border-radius: 8px;
          padding: 2px 6px;
          line-height: 1;
          box-shadow: 0 2px 4px rgba(92, 107, 192, 0.3);
          border: 1px solid white;
          z-index: 10;
          font-family: 'Roboto', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .today-with-appointments::after {
          content: var(--appointment-count);
          position: absolute;
          bottom: 2px;
          right: 2px;
          background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
          color: white;
          font-weight: bold;
          font-size: 10px;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          box-shadow: 0 2px 4px rgba(255, 152, 0, 0.3);
          border: 2px solid white;
          z-index: 10;
          min-width: 18px;
          font-family: 'Roboto', sans-serif;
        }

        .today-without-appointments::before {
          content: var(--today-indicator);
          position: absolute;
          top: 2px;
          left: 2px;
          background: linear-gradient(135deg, #5c6bc0 0%, #26418f 100%);
          color: white;
          font-weight: bold;
          font-size: 8px;
          border-radius: 8px;
          padding: 2px 6px;
          line-height: 1;
          box-shadow: 0 2px 4px rgba(92, 107, 192, 0.3);
          border: 1px solid white;
          z-index: 10;
          font-family: 'Roboto', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .today-without-appointments::after {
          content: "0";
          position: absolute;
          bottom: 2px;
          right: 2px;
          background: linear-gradient(135deg, #9e9e9e 0%, #757575 100%);
          color: white;
          font-weight: bold;
          font-size: 10px;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          box-shadow: 0 2px 4px rgba(158, 158, 158, 0.3);
          border: 2px solid white;
          z-index: 10;
          min-width: 18px;
          font-family: 'Roboto', sans-serif;
        }

        .today-with-appointments,
        .today-without-appointments {
          transition: all 0.2s ease !important;
        }

        .today-with-appointments:hover,
        .today-without-appointments:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 12px rgba(92, 107, 192, 0.3);
        }

        .today-with-appointments:hover::before,
        .today-without-appointments:hover::before {
          transform: scale(1.1);
          box-shadow: 0 3px 6px rgba(92, 107, 192, 0.5);
        }

        .today-with-appointments:hover::after {
          transform: scale(1.1);
          box-shadow: 0 3px 6px rgba(255, 152, 0, 0.5);
        }

        .today-without-appointments:hover::after {
          transform: scale(1.1);
          box-shadow: 0 3px 6px rgba(158, 158, 158, 0.5);
        }
      `}</style>
      
      
      {appointments.length === 0 ? (
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Avatar sx={{ bgcolor: 'grey.100', width: 80, height: 80, mx: 'auto', mb: 3 }}>
              <CalendarIcon sx={{ fontSize: 40, color: 'grey.400' }} />
            </Avatar>
            <Typography variant="h6" fontWeight="600" color="text.primary" mb={1}>
              No Appointments Scheduled
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No appointments found for the current filters. The calendar will display appointments when available.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Fade in={true} timeout={500}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 650, fontFamily: 'Roboto' }}
              view={currentView}
              date={currentDate}
              onNavigate={(date) => setCurrentDate(date)}
              onView={(newView) => setCurrentView(newView)}
              views={[Views.MONTH, Views.WEEK, Views.DAY]}
              dayPropGetter={dayPropGetter}
              slotPropGetter={slotPropGetter}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={onSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable={currentView === 'month'}
              components={{
                toolbar: (props: ToolbarProps<CalendarEvent, object>) => <CustomToolbar {...props} selectedProvider={selectedProvider} />,
                event: EventComponent,
              }}
              formats={{
                timeGutterFormat: 'h:mm A',
                eventTimeRangeFormat: ({ start, end }) => 
                  `${moment(start).format('h:mm A')} - ${moment(end).format('h:mm A')}`,
                dayHeaderFormat: (date) => moment(date).format('dddd, MMM D'),
                monthHeaderFormat: (date) => moment(date).format('MMMM YYYY'),
              }}
              step={30}
              timeslots={1}
              min={moment().set({ hour: 8, minute: 0 }).toDate()}
              max={moment().set({ hour: 17, minute: 0 }).toDate()}
              popup={true}
              showMultiDayTimes={true}
              scrollToTime={moment().set({ hour: 8, minute: 0 }).toDate()}
            />
          </Card>
        </Fade>
      )}
    </Box>
  );
}