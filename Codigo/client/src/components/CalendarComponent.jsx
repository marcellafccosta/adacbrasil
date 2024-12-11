/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Calendar, ConfigProvider, message } from 'antd';
import { Box, Button, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import locale from 'antd/es/locale/pt_BR';
import EventoService from '../services/EventoService';
import EventModal from '../components/EventModal';
import ListEventModal from '../components/ListEventModal';
import '../styles/CalendarComponent.css';
import '../styles/index.css';
import AuthService from "../services/AuthService";

const CalendarComponent = () => {
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [isListEventModalVisible, setIsListEventModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const userLoggedIn = AuthService.getCurrentUser();
  const isAdmin = userLoggedIn.tipo === "ADMIN";


  useEffect(() => {
    const fetchEvents = async () => {
      const eventsData = await EventoService.getAll();
      setEvents(eventsData ?? []);
    };

    fetchEvents();
  }, []);

  const cellRender = (current, info) => {
    if (info.type === 'date') {
      const formattedValue = current.format('YYYY-MM-DD');
      const eventsForDate = events.filter(item => item.data.startsWith(formattedValue));

      return (
        <div
          className={`calendar-date ${eventsForDate.length > 0 ? 'has-event' : ''}`}
          onClick={() => handleDateClick(eventsForDate)}
        >
          {eventsForDate.slice(0, 3).map((event, index) => (
            <div key={index} className="event-title" style={{ backgroundColor: event.color }}>
              {event.nome}
            </div>
          ))}
          {eventsForDate.length > 3 && (
            <div className="event-title">...{eventsForDate.length - 3} mais</div>
          )}
        </div>
      );
    }
    return info.originNode;
  };

  const handleDateClick = (eventsForDate) => {
    setSelectedDateEvents(eventsForDate);
    setIsListEventModalVisible(true);
  };

  const CustomHeader = ({ value, onChange }) => {
    const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' });
    const yearFormatter = new Intl.DateTimeFormat('pt-BR', { year: 'numeric' });
  
    let month = monthFormatter.format(value.toDate());
    month = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
  
    const year = yearFormatter.format(value.toDate());
  
    const handlePrevMonth = () => {
      onChange(value.clone().subtract(1, 'month'));
    };
  
    const handleNextMonth = () => {
      onChange(value.clone().add(1, 'month'));
    };
  
    const handleAddClick = () => {
      setModalTitle("Novo Evento");
      setSelectedEvent(null);
      setIsEventModalVisible(true);
    };
  
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <span className='calendar-title'>
          <span className='calendar-title-date'> Calendário - <span style={{color: '#1299E5'}}>{` ${month} de ${year}`}</span></span>
        </span>
  
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Button
            onClick={handlePrevMonth}
            sx={{
              minWidth: 0,
              padding: '0.2rem',
              '&:hover': { backgroundColor: '#d9d9d9' },
            }}
          >
            <KeyboardArrowLeft fontSize="medium" />
          </Button>
          <Button
            onClick={handleNextMonth}
            sx={{
              minWidth: 0,
              padding: '0.2rem',
              '&:hover': { backgroundColor: '#d9d9d9' },
            }}
          >
            <KeyboardArrowRight fontSize="medium" />
          </Button>

          {isAdmin && (
            <IconButton
              sx={{ color: "#1299E5", backgroundColor: 'transparent' }}
              onClick={handleAddClick}
            >
            <AddIcon fontSize='medium' />
          </IconButton> )}
        </Box>
      </div>
    );
  };

  const handleEventModalOk = (eventData) => {
    if (selectedEvent) {
      setEvents(events.map(event => event.id === selectedEvent.id ? eventData : event));
      message.success('Evento atualizado com sucesso!');
    } else {
      setEvents([...events, eventData]);
      message.success('Evento agendado com sucesso!');
    }
    setIsEventModalVisible(false);
  };

  const handleEventModalCancel = () => {
    setIsEventModalVisible(false);
  };

  const handleListEventModalCancel = () => {
    setIsListEventModalVisible(false);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setModalTitle(event.nome);
    setIsEventModalVisible(true);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    EventoService.deleteEvento(eventId);
    message.success('Evento excluído com sucesso!', 1);

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="calendar-container" style={{ height: '100vh', flex: 1, marginBottom: '6rem' }}>
      <ConfigProvider locale={locale}>
        <Calendar
          cellRender={cellRender}
          headerRender={({ value, onChange }) => (
            <CustomHeader value={value} onChange={onChange} />
          )}
          fullscreen={true}
        />
      </ConfigProvider>
      <EventModal
        open={isEventModalVisible}
        onOk={handleEventModalOk}
        onCancel={handleEventModalCancel}
        title={modalTitle}
        eventData={selectedEvent}
      />
     <ListEventModal
  open={isListEventModalVisible}
  onCancel={handleListEventModalCancel}
  events={selectedDateEvents}
  onEdit={isAdmin ? handleEditEvent : null}  // Condicional para editar
  onDelete={isAdmin ? handleDeleteEvent : null}  // Condicional para deletar
/>

    </div>
  );
};

export default CalendarComponent;
