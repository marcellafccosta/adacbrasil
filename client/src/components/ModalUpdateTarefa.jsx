import { Modal, Input, Select, TimePicker, Button } from 'antd';
import { UserOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const ModalUpdateTarefa = ({ showUpdateModal, setShowUpdateModal, tarefaToUpdate, setTarefaToUpdate, handleFormUpdate, usuarios }) => {

  const handleUserSelecionado = (selectedUsers) => {
    setTarefaToUpdate({ ...tarefaToUpdate, usuariosSelecionado: selectedUsers });
  };

  return (
    <Modal
      title="Atualizar Tarefa"
      open={showUpdateModal}
      onCancel={() => setShowUpdateModal(false)}
      onOk={handleFormUpdate}
      okText="Atualizar"
    >
      <form onSubmit={handleFormUpdate}>
        
        {/* Campo de Título */}
        <div className="form">
          <div style={{ marginBottom: '16px' }}>
            <Input
              prefix={<UserOutlined />}
              placeholder="Título da Tarefa"
              value={tarefaToUpdate?.titulo}
              onChange={(e) =>
                setTarefaToUpdate({ ...tarefaToUpdate, titulo: e.target.value })
              }
              required
            />
          </div>

          {/* Endereço */}
          <div style={{ marginBottom: '16px' }}>
            <Input
              prefix={<EnvironmentOutlined />}
              placeholder="Endereço"
              value={tarefaToUpdate?.endereco}
              onChange={(e) =>
                setTarefaToUpdate({ ...tarefaToUpdate, endereco: e.target.value })
              }
              required
            />
          </div>

          {/* Tipo de Tarefa */}
          <div style={{ marginBottom: '16px' }}>
            <Select
              placeholder="Selecione o Tipo"
              value={tarefaToUpdate?.tipo}
              onChange={(value) =>
                setTarefaToUpdate({ ...tarefaToUpdate, tipo: value })
              }
              style={{ width: "100%" }}
            >
              <Select.Option value="TAREFA">TAREFA</Select.Option>
              <Select.Option value="EVENTO">EVENTO</Select.Option>
              <Select.Option value="VISITA">VISITA</Select.Option>
            </Select>
          </div>

          {/* Horário */}
          <div style={{ marginBottom: '16px' }}>
            <TimePicker
              placeholder="Escolher Horário"
              value={tarefaToUpdate?.horario ? dayjs(tarefaToUpdate.horario, "HH:mm") : null}
              onChange={(time, timeString) =>
                setTarefaToUpdate({ ...tarefaToUpdate, horario: timeString })
              }
              format="HH:mm"
              style={{ width: "100%" }}
              required
            />
          </div>

          {/* Seleção de Usuários */}
          <div style={{ marginBottom: '16px' }}>
            <Select
              mode="multiple"
              placeholder="Selecione Usuários"
              value={tarefaToUpdate?.usuariosSelecionado} // Exibe os usuários já associados
              onChange={handleUserSelecionado}
              style={{ width: "100%" }}
            >
              {usuarios.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.nome}
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Descrição */}
          <div style={{ marginBottom: '24px', width: '100%' }}>
            <Input.TextArea
              placeholder="Digite a descrição da tarefa"
              value={tarefaToUpdate?.descricao}
              onChange={(e) =>
                setTarefaToUpdate({ ...tarefaToUpdate, descricao: e.target.value })
              }
              required
            />
          </div>

          {/* Botão de Atualizar */}
          <div style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              Atualizar
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ModalUpdateTarefa;
