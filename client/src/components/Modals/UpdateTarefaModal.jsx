import React, { useState } from "react";
import { Modal, Button, Input, TimePicker, DatePicker, Select } from 'antd';
import { CarryOutOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const AddTarefaModal = ({ visible, onClose, onAdd, usuarios }) => {
  const [tipo, setTipo] = useState("");
  const [horario, setHorario] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataVisita, setDataVisita] = useState("");
  const [usuariosSelecionado, setUsuariosSelecionado] = useState([]);

  const handleFormSubmit = () => {
    if (!taskTitle || !descricao || !tipo) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    onAdd({
      titulo: taskTitle,
      horario: horario ? horario.format("HH:mm") : null,
      dataVisita,
      descricao,
      tipo,
      usuariosIds: usuariosSelecionado,
    });
    setTipo("");
    setTaskTitle("");
    setHorario(null);
    setDescricao("");
    setDataVisita("");
    onClose();
  };

  return (
    <Modal title="Adicionar Tarefa" open={visible} onCancel={onClose} footer={null}>
      <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
        <Input placeholder="Título" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
        <Select placeholder="Tipo" value={tipo} onChange={setTipo} style={{ width: "100%" }} required>
          <Option value="TAREFA">TAREFA</Option>
          <Option value="VISITA">VISITA</Option>
        </Select>
        {tipo === "VISITA" && (
          <>
            <DatePicker placeholder="Data" value={dataVisita} onChange={setDataVisita} style={{ width: "100%" }} />
            <TimePicker placeholder="Horário" value={horario} onChange={setHorario} format="HH:mm" style={{ width: "100%" }} />
          </>
        )}
        <Select mode="multiple" placeholder="Selecione Usuários" value={usuariosSelecionado} onChange={setUsuariosSelecionado} style={{ width: "100%" }}>
          {usuarios.map((user) => (<Option key={user.id} value={user.id}>{user.nome}</Option>))}
        </Select>
        <Input.TextArea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
        <Button type="primary" htmlType="submit">Adicionar</Button>
      </form>
    </Modal>
  );
};

export default AddTarefaModal;
