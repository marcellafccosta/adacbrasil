/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Modal, Button, Input, Select, TimePicker, DatePicker } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, ClockCircleOutlined, TrophyOutlined, FormOutlined } from '@ant-design/icons';
import '../styles/CalendarEventPicker.css'; // Certifique-se de que está importando o CSS correto

const { Option } = Select;

const CompetitionModal = ({ visible, onOk, onCancel, title }) => {
  const [formData, setFormData] = useState({
    modalidade: '',
    local: '',
    data: null,
    hora: null,
    atletas: '',
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleOk = () => {
    onOk(formData);  // Aqui você pode enviar os dados preenchidos
  };

  return (
    <Modal
      title={`Cadastro de Competição - ${title}`}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width={'60rem'}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Confirmar
        </Button>,
      ]}
    >
      {/* Nome da Modalidade */}
      <Input
        prefix={<TrophyOutlined />}
        placeholder="Nome da Modalidade"
        value={formData.modalidade}
        onChange={(e) => handleChange('modalidade', e.target.value)}
        style={{ marginBottom: 16 }}
      />

      {/* Data */}
      <DatePicker
        prefix={<CalendarOutlined />}
        placeholder="Escolher Data"
        value={formData.data}
        onChange={(date) => handleChange('data', date)}
        style={{ marginBottom: 16, width: '100%' }}
      />

      {/* Horário */}
      <TimePicker
        prefix={<ClockCircleOutlined />}
        placeholder="Escolher Horário"
        value={formData.hora}
        onChange={(time) => handleChange('hora', time)}
        style={{ marginBottom: 16, width: '100%' }}
      />

      {/* Local */}
      <Input
        prefix={<EnvironmentOutlined />}
        placeholder="Local"
        value={formData.local}
        onChange={(e) => handleChange('local', e.target.value)}
        style={{ marginBottom: 16 }}
      />

      {/* Lista de Atletas */}
      <Select
        mode="tags"
        placeholder="Insira os atletas"
        value={formData.atletas}
        onChange={(value) => handleChange('atletas', value)}
        style={{ marginBottom: 16, width: '100%' }}
      >
        <Option value="Atleta1">Atleta 1</Option>
        <Option value="Atleta2">Atleta 2</Option>
        <Option value="Atleta3">Atleta 3</Option>
        {/* Aqui você pode adicionar os atletas manualmente ou dinamicamente */}
      </Select>

      {/* Observações */}
      <Input.TextArea
        prefix={<FormOutlined />}
        placeholder="Observações adicionais"
        value={formData.observacoes}
        onChange={(e) => handleChange('observacoes', e.target.value)}
        style={{ marginBottom: 16 }}
      />
    </Modal>
  );
};

export default CompetitionModal;
