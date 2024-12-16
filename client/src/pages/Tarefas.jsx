import React, { useState, useEffect } from "react";
import Column from "../components/ColumnTarefas.jsx";
import Menu from "../components/Menu";
import { DragDropContext } from "@hello-pangea/dnd";
import { Divider, Box } from "@mui/material";
import "../styles/Layout.css";
import Header from '../components/Header';
import "../styles/Tarefas.css";

const Tarefas = () => {
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    async function fetchTarefas() {
      try {
        const response = await fetch("http://localhost:3001/api/tarefa");
        if (response.ok) {
          const data = await response.json();
          const tarefasIdString = data.map((tarefa) => ({
            ...tarefa,
            id: String(tarefa.id),
          }));
          setTarefas(tarefasIdString);
        } else {
          console.error("Erro ao buscar tarefas:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    }
    fetchTarefas();
  }, []);

  function onDragEnd(result) {
    const { source, destination, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const updatedTarefas = Array.from(tarefas);
    const movedTaskIndex = updatedTarefas.findIndex((tarefa) => tarefa.id === draggableId);
    const movedTask = updatedTarefas[movedTaskIndex];

    updatedTarefas.splice(movedTaskIndex, 1);
    movedTask.status = destination.droppableId;
    updatedTarefas.splice(destination.index, 0, movedTask);

    
    const tarefasReordenadas = updatedTarefas.map((tarefa, index) => ({
      ...tarefa,
      ordem: index + 1, 
    }));

    console.log("Tarefas reordenadas: ", tarefasReordenadas);

    setTarefas(tarefasReordenadas);
    handleOrderUpdate(tarefasReordenadas); 
  }

  async function handleStatusUpdate(tarefaId, newStatus) {
    try {
      const response = await fetch(`http://localhost:3001/api/tarefa/${tarefaId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        const tarefaAtualizada = await response.json();
        setTarefas((prevTarefas) =>
          prevTarefas.map((tarefa) =>
            tarefa.id === tarefaId ? { ...tarefa, status: tarefaAtualizada.status } : tarefa
          )
        );
      } else {
        console.error("Erro ao atualizar tarefa:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao atualizar status da tarefa:", error);
    }
  }

  async function handleOrderUpdate(tarefasAtualizadas) {
    console.log(JSON.stringify(tarefasAtualizadas));

    try {
      const response = await fetch("http://localhost:3001/api/tarefa/update-ordem", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarefasAtualizadas),
      });

      if (response.ok) {
        console.log("Ordem atualizada com sucesso no servidor!");
      } else {
        console.error("Erro ao atualizar a ordem no servidor:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao enviar a ordem para o servidor:", error);
    }
  }

  // Filtra e ordena as tarefas com base no status e no campo 'ordem'
  const getTarefasByStatus = (status) =>
    tarefas
      .filter((tarefa) => tarefa.status === status)
      .sort((a, b) => a.ordem - b.ordem); // Ordena as tarefas pelo campo 'ordem'

  return (
    <div style={{ display: "flex" }}>
      <Menu />
      <div style={{ flex: 1, padding: "1rem", overflow: "inherit", height: '100vh'}}>
      
        <Header headerName={'Tarefas'} />
       
        <Divider />
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="task-board"  style={{marginTop:"8px"}}>
            <Column
              title="Lista de Tarefas"
              tarefas={getTarefasByStatus("BACKLOG")}
              status="BACKLOG"
              setTarefas={setTarefas}
              className="column"
            />
            <Column
              title="A Fazer"
              tarefas={getTarefasByStatus("FAZER")}
              status="FAZER"
              setTarefas={setTarefas}
              className="column"
            />
            <Column
              title="Em Andamento"
              tarefas={getTarefasByStatus("ANDAMENTO")}
              status="ANDAMENTO"
              setTarefas={setTarefas}
              className="column"
            />
            <Column
              title="Concluído"
              tarefas={getTarefasByStatus("CONCLUIDO")}
              status="CONCLUIDO"
              setTarefas={setTarefas}
              className="column"
            />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Tarefas;
