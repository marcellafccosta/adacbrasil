  /* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Modal, Input, DatePicker, TimePicker, Button as AntButton, Select, Row, Col, ColorPicker, message } from 'antd';
import { useState, useEffect } from 'react';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  SketchOutlined,
  InfoCircleOutlined,
  NumberOutlined,
  UserOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import EventoService from '../services/EventoService';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const EventModal = ({ open, onOk, onCancel, title, eventData }) => {
  const [eventDetails, setEventDetails] = useState({
    nome: '',
    data: null,
    horaInicio: null,
    horaFim: null,
    tipoEvento: 'Visita',
    descricao: '',
    local: '',
    organizador: '',
    numeroParticipantes: '',
    url: '',
    color: '#e6f7ff',
  });

  useEffect(() => {
    if (eventData) {
      setEventDetails({
        ...eventData,
        data: eventData.data ? moment(eventData.data) : null,
        horaInicio: eventData.horaInicio ? moment(eventData.horaInicio, 'HH:mm:ss') : null,
        horaFim: eventData.horaFim ? moment(eventData.horaFim, 'HH:mm:ss') : null,
      });
    } else {
      setEventDetails({
        nome: '',
        data: null,
        horaInicio: null,
        horaFim: null,
        tipoEvento: 'Visita',
        descricao: '',
        local: '',
        organizador: '',
        numeroParticipantes: '',
        url: '',
        color: '#e6f7ff',
      });
    }
  }, [eventData]);

  const handleChange = (field, value) => {
    setEventDetails((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleOk = async () => {
    try {
      const formattedData = {
        ...eventDetails,
        data: eventDetails.data ? eventDetails.data.format('YYYY-MM-DD') : null,
        horaInicio: eventDetails.horaInicio ? eventDetails.horaInicio.format('HH:mm:ss') : null,
        horaFim: eventDetails.horaFim ? eventDetails.horaFim.format('HH:mm:ss') : null,
      };

      if (eventData) {
        await EventoService.updateEvento(formattedData.id, formattedData);
        message.success('Evento atualizado com sucesso!', 3);
      } else {
        await EventoService.createEvento(formattedData);
        message.success('Evento criado com sucesso!'), 3;
      }

      setTimeout(() => {
        onCancel();
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      message.error('Erro ao salvar evento. Tente novamente.', 3);
    }
  };

  return (
    <Modal
      title={`Agendar Evento - ${title}`}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      centered={true}
      width={'50vw'}
      footer={null}
    >
      <div className="event-modal-content">
        <Row gutter={16}>
          <Col span={24}>
            <Input
              placeholder="Nome do Evento"
              value={eventDetails.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              style={{ marginBottom: 16 }}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col span={12}>
            <DatePicker
              placeholder="Escolher data"
              value={eventDetails.data}
              onChange={(date) => handleChange('data', date)}
              style={{ marginBottom: 16, width: '100%' }}
              suffixIcon={<CalendarOutlined />}
            />
          </Col>
          <Col span={6}>
            <TimePicker
              placeholder="Hora de Início"
              value={eventDetails.horaInicio}
              onChange={(time) => handleChange('horaInicio', time)}
              style={{ marginBottom: 16, width: '100%' }}
              suffixIcon={<ClockCircleOutlined />}
            />
          </Col>
          <Col span={6}>
            <TimePicker
              placeholder="Hora de Término"
              value={eventDetails.horaFim}
              onChange={(time) => handleChange('horaFim', time)}
              style={{ marginBottom: 16, width: '100%' }}
              suffixIcon={<ClockCircleOutlined />}
            />
          </Col>
          <Col span={12}>
            <Select
              style={{ width: '100%', marginBottom: 16 }}
              placeholder="Selecione o Tipo de Evento"
              value={eventDetails.tipoEvento}
              onChange={(value) => handleChange('tipoEvento', value)}
            >
              <Option value="Evento">Evento</Option>
              <Option value="Feira">Feira</Option>
              <Option value="Visita">Visita</Option>
            </Select>
          </Col>
          <Col span={12}>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <SketchOutlined style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
              <ColorPicker
                value={eventDetails.color}
                onChange={(color) => {
                  const { r, g, b } = color.metaColor;
                  const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                  handleChange('color', hexColor);
                }}
                style={{ width: '100%', paddingLeft: '32px' }}
              />
            </div>
          </Col>
          <Col span={12}>
            <Input
              placeholder="Organizador"
              value={eventDetails.organizador}
              onChange={(e) => handleChange('organizador', e.target.value)}
              style={{ marginBottom: 16 }}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col span={12}>
            <Input
              type="number"
              placeholder="Número de Participantes"
              value={eventDetails.numeroParticipantes}
              onChange={(e) => handleChange('numeroParticipantes', e.target.value)}
              style={{ marginBottom: 16 }}
              prefix={<NumberOutlined />}
            />
          </Col>
          <Col span={24}>
            <Input
              placeholder="URL do Evento"
              value={eventDetails.url}
              onChange={(e) => handleChange('url', e.target.value)}
              style={{ marginBottom: 16 }}
              prefix={<LinkOutlined />}
            />
          </Col>
          <Col span={24}>
            <TextArea
              placeholder="Descrição"
              value={eventDetails.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              style={{ marginBottom: 16 }}
              prefix={<InfoCircleOutlined />}
            />
          </Col>
        </Row>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <AntButton onClick={onCancel} className="btn-cancelar">
          Cancelar
        </AntButton>
        <AntButton type="primary" onClick={handleOk} style={{ marginLeft: 8 }}>
          {eventData ? 'Atualizar' : 'Agendar'}
        </AntButton>
      </div>
    </Modal>
  );
};

export default EventModal;
