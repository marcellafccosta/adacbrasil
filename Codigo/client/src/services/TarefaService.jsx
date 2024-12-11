const API_URL = "http://localhost:3001/api/tarefa";

export const TarefaService = {
  async addTarefa(novaTarefa, usuariosIds) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tarefaData: novaTarefa, usuariosIds }),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar a tarefa");
      }

      const savedTarefa = await response.json();
      return savedTarefa;
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      throw error;
    }
  },

  async updateTarefa(tarefaAtualizada) {
    try {
      const response = await fetch(`${API_URL}/${tarefaAtualizada.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tarefaAtualizada),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar a tarefa");
      }

      const updatedTarefa = await response.json();
      return updatedTarefa;
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      throw error;
    }
  },

  async deleteTarefa(tarefaId) {
    try {
      const response = await fetch(`${API_URL}/${tarefaId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir a tarefa");
      }
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      throw error;
    }
  },

  async fetchUsuarios() {
    try {
      const response = await fetch("http://localhost:3000/api/usuario");
      if (!response.ok) {
        throw new Error("Erro ao buscar usuários");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  },
};
