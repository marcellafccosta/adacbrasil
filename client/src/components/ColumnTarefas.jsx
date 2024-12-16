import React, { useState, useEffect } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Modal, Button, Input, Select } from "antd";
import { CarryOutOutlined } from "@ant-design/icons";
import Card from "../components/CardTarefas";


const Column = ({ title, tarefas, setTarefas, status }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");
  const [descricao, setDescricao] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosSelecionado, setUsuariosSelecionado] = useState([]);

  const [tarefaToDelete, setTarefaToDelete] = useState(null);
  const [tarefaToUpdate, setTarefaToUpdate] = useState(null);

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleDeleteClick = (tarefa) => {
    setTarefaToDelete(tarefa);
    setShowDeleteModal(true);
  };

  const handleUpdateClick = (tarefa) => {
    setShowUpdateModal(true);
    setTarefaToUpdate({
      ...tarefa,
    });
    const usuarioIds = tarefa.usuario_tarefa.map(
      (usuario) => usuario.usuarioId
    );
    console.log(usuarioIds);
    setUsuariosSelecionado(usuarioIds);
  };

  const handleUserSelecionado = (ids) => {
    setUsuariosSelecionado(ids);
  };

  function maiorOrder() {
    let maxOrder = 0;
    tarefas.forEach((tarefa) => {
      if (tarefa.order > maxOrder) {
        maxOrder = tarefa.order;
      }
    });
    return maxOrder;
  }

  const handleFormSubmit = async () => {
    event.preventDefault();

    if (!taskTitle || !descricao) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const novaTarefa = {
      titulo: taskTitle,
      descricao: descricao,
      status: status,
      ordem: maiorOrder() + 1,
    };

    console.log(novaTarefa);

    try {
      const response = await fetch("http://localhost:3000/api/tarefa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify({
          tarefaData: novaTarefa,
          usuariosIds: usuariosSelecionado,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const tarefaId = { ...data, id: String(data.id) };
        setTarefas((prevTarefas) => {
          const updatedTarefas = [...prevTarefas, tarefaId];

          updatedTarefas.sort((a, b) => a.order - b.order);
          return updatedTarefas;
        });
        setShowAddModal(false);
      } else {
        console.error("Erro ao adicionar a tarefa:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao adicionar a tarefa:", error);
    }

    setTaskTitle("");
    setDescricao("");
  };

  const handleFormUpdate = async () => {
    console.log("usuarios " + tarefaToUpdate.usuariosSelecionado);

    const novaTarefa = {
      titulo: tarefaToUpdate.titulo,
      descricao: tarefaToUpdate.descricao,
      order: tarefaToUpdate.order,
      status: tarefaToUpdate.status,
      usuariosSelecionado: tarefaToUpdate.usuariosSelecionado,
    };

    console.log(`Atualizando a tarefa raiz ${tarefaToUpdate.id}`);

    console.log("Usuarios: " + tarefaToUpdate.usuariosSelecionado);

    try {

      // console.log(tarefaToUpdate.usuariosSelecionado)

      const response = await fetch(
        `http://localhost:3000/api/tarefa/${tarefaToUpdate.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novaTarefa),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const tarefaAtualizada = { ...data, id: String(data.id) };

        setTarefas((prevTarefas) =>
          prevTarefas.map((tarefa) =>
            tarefa.id === tarefaToUpdate.id ? tarefaAtualizada : tarefa
          )
        );

        setShowUpdateModal(false);
      } else {
        console.error("Erro ao atualizar a tarefa:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao atualizar a tarefa:", error);
    }
  };



  const handleFormDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/tarefa/${tarefaToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setTarefas((prevTarefas) =>
          prevTarefas.filter((tarefa) => tarefa.id !== tarefaToDelete.id)
        );
        setShowDeleteModal(false);
      } else {
        console.error("Erro ao excluir a tarefa:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao excluir a tarefa:", error);
    }
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:3000/api/usuario");
        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
        } else {
          console.error("Erro ao buscar usuarios:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao buscar usuarios:", error);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="column-container">
      <Droppable droppableId={status} type="list" direction="vertical">
        {(provided) => (
          <div
            className="column"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <div className="g-ttl-add">
              <h2>
                {title}
                <span className={`status ${status} length-status ${status}`}>
                  {tarefas.length}
                </span>
              </h2>
              <div className="add-btn">
                <Button
                  type="primary"
                  size="small"
                  shape="circle"
                  icon="+"
                  onClick={handleAddClick}
                />
              </div>
            </div>

            <div className="task-list">
              {tarefas.map((tarefa, index) => (
                <Card
                  key={tarefa.id}
                  tarefa={tarefa}
                  index={index}
                  status={status}
                  onDelete={() => handleDeleteClick(tarefa)}
                  onUpdate={() => handleUpdateClick(tarefa)}
                />
              ))}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>


      {/* MODAL ADD TAREFA */}
      <Modal
        title="Adicionar Tarefa"
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={null}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="form">
            {/* Título da Tarefa */}
            <div style={{ marginBottom: "16px" }}>
              <Input
                prefix={<CarryOutOutlined />}
                placeholder="Título da Tarefa"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
              />
            </div>

            {/* Seleção de Usuários */}
            <div style={{ marginBottom: "16px" }}>
              <Select
                mode="multiple"
                placeholder="Selecione Usuários"
                value={usuariosSelecionado}
                onChange={handleUserSelecionado}
                style={{ width: "100%" }}
              > 
                {usuarios.map((user) => (

                  user.infovoluntario != null && (
                  
                    <Select.Option key={user.id} value={user.id }>
                      {user.nome}
                      <br></br>
                      Tempo Disponível: {user.infovoluntario.tempoDisponivel}
                      
                    </Select.Option>
                  )
                ))}
              </Select>
            </div>

            {/* Descrição */}
            <div style={{ marginBottom: "24px", width: "100%" }}>
              <Input.TextArea
                placeholder="Digite a descrição da tarefa"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>

            {/* Botão de Adicionar */}
            <div style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit">
                Adicionar
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      
      
      {/* MODAL ATUALIZAR TAREFA */}
      <Modal
        title="Atualizar Tarefa"
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        footer={null}
      >
        <form onSubmit={handleFormUpdate}>
          {/* Campo de Título */}

          <div className="form">
            {/* Título da Tarefa */}
            <div style={{ marginBottom: "16px" }}>
              <Input
                prefix={<CarryOutOutlined />}
                placeholder="Título da Tarefa"
                value={tarefaToUpdate?.titulo}
                onChange={(e) =>
                  setTarefaToUpdate({
                    ...tarefaToUpdate,
                    titulo: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* Seleção de Usuários */}
            <div style={{ marginBottom: "16px" }}>
              <Select
                mode="multiple"
                placeholder="Selecione Usuários"
                value={usuariosSelecionado}
                onChange={handleUserSelecionado}
                style={{ width: "100%" }}
              >
              {usuarios.map((user) => (

              user.infovoluntario != null && (

                <Select.Option key={user.id} value={user.id }>
                  {user.nome}
                  <br></br>
                  Tempo Disponível: {user.infovoluntario.tempoDisponivel}
                  
                </Select.Option>
              )
              ))}
              </Select>
            </div>

            {/* Descrição */}
            <div style={{ marginBottom: "24px", width: "100%" }}>
              <Input.TextArea
                placeholder="Digite a descrição da tarefa"
                value={tarefaToUpdate?.descricao}
                onChange={(e) =>
                  setTarefaToUpdate({
                    ...tarefaToUpdate,
                    descricao: e.target.value,
                  })
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

      {/* MODAL EXCLUIR TAREFA */}
      <Modal
        title="Excluir Tarefa"
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onOk={handleFormDelete}
        okText="Excluir"
        cancelText="Cancelar"
      >
        <p>
          Tem certeza de que deseja excluir a tarefa {tarefaToDelete?.titulo}?
        </p>
      </Modal>
    </div>
  );
};

export default Column;
