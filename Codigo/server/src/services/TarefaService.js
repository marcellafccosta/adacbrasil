import { prismaClient } from "../database/prismaClient.js";

class TarefaService {
    async getAllTarefas() {
        try {
          return await prismaClient.tarefa.findMany({
            include: {
              usuario_tarefa: {
                include: {
                  usuario: {
                    select: {
                      id: true,
                      nome: true,
                      infovoluntario: {
                        select: {
                          tempoDisponivel: true
                        }
                      }
                    }
                  }
                }
              }
            }
          });
        } catch (error) {
          console.error("Erro ao buscar todas as tarefas", error);
          throw new Error("Não foi possível buscar as tarefas");
        }
      }

    async getTarefaById(id) {

        if (isNaN(id)) {
            throw new Error(`ID inválido: ${id}`);
        }

        try {
            return await prismaClient.tarefa.findUnique({
                where: { id: parseInt(id) },
                include: {
                    usuario_tarefa: true,
                }
            });
        } catch (error) {
            console.error('Erro ao buscar tarefa por ID', error);
            throw new Error('Não foi possível buscar a tarefa');
        }
    }

    async createTarefa(tarefaData, usuarioIds) {

        console.log('createTarefa', tarefaData.titulo)
        console.log('USUARIOS IDS', usuarioIds)

        try {
            const newDate = new Date();
            const tarefa = await prismaClient.tarefa.create({
                data: {
                    ...tarefaData,
                    dataCriada: newDate,
                }
            });
            console.log("Tarefa criada:", tarefa);

            try {
                if (Array.isArray(usuarioIds) && usuarioIds.length > 0) {
                    await Promise.all(
                        usuarioIds.map((usuarioId) => this.createUsuarioTarefa(tarefa.id, usuarioId))
                    );
                }

                console.log("Associado com sucesso")
            } catch (error) {
                console.error('Erro ao associar usuarios à tarefa', error);
            }

            return tarefa;
        } catch (error) {
            console.error('Erro ao criar tarefa', error);
            throw new Error('Não foi possível criar a tarefa');
        }
    }

    async updateTarefa(tarefaId, tarefaData) {
        try {
            console.log("Id no updateTarefa: " + tarefaId);
            const tarefa = await this.getTarefaById(parseInt(tarefaId)); 
            if (!tarefa) {
                throw new Error("Tarefa não encontrada.");
            }
            const newTarefa = await prismaClient.tarefa.update({
                where: { id: parseInt(tarefaId) },
                data: tarefaData,
            });
            console.log("Tarefa atualizada:", newTarefa);
            return newTarefa;
        } catch (error) {
            console.error('Erro ao atualizar tarefa', error);
            throw new Error('Não foi possível atualizar a tarefa');
        }
    }
    

    async updateStatusTarefa(tarefaId, newStatus) {
        try {

            console.log(newStatus)

            const tarefaData = this.getTarefaById(parseInt(tarefaId))

            if (!tarefaData) {
                throw new Error("Tarefa não encontrada.");
            }

            if (!['BACKLOG', 'FAZER', 'ANDAMENTO', 'CONCLUIDO'].includes(newStatus.status)) {
                throw new Error('Status inválido');
            }

            const tarefa = await prismaClient.tarefa.update({
                where: { id: parseInt(tarefaId) },
                data: {
                    status: newStatus.status
                },
            });
            console.log("Status de tarefa atualizada:", tarefa);
            return tarefa;
        } catch (error) {
            console.error('Erro ao atualizar tarefa', error);
            throw new Error('Não foi possível atualizar a tarefa');
        }
    }

    async updateOrderTarefa(tarefas) {
        try {
    
            for (const tarefa of tarefas) {                
                await prismaClient.tarefa.update({
                    where: { id: parseInt(tarefa.id) },
                    data: { order: tarefa.order },
                });
            }
            console.log("Ordem atualizada com sucesso no servidor!");
        } catch (error) {
            console.error("Erro ao atualizar a ordem das tarefas:", error);
            throw new Error('Erro ao atualizar a ordem das tarefas');
        }
    }
    

    async deleteTarefa(tarefaId) {
        try {

            console.log(tarefaId)
            const tarefa = await this.getTarefaById(tarefaId)

            if (!tarefa) {
                throw new Error("Tarefa não encontrada.");
            }

            await prismaClient.tarefa.delete({
                where: { id: parseInt(tarefaId) },
            });
            console.log("Tarefa deletada:", tarefa);
            return tarefa;
        } catch (error) {
            console.error('Erro ao deletar tarefa', error);
            throw new Error('Não foi possível deletar a tarefa');
        }
    }

    async createUsuarioTarefa(tarefaId, usuarioId) {
        try {
            const tarefa = this.getTarefaById(tarefaId)
            const usuario = await prismaClient.usuario.findUnique({
                where: { id: parseInt(usuarioId) },
            });

            if (!tarefa) {
                throw new Error("Tarefa não encontrada.");
            } else if (!usuario) {
                throw new Error("Usuario não encontrado.");
            }

            await prismaClient.usuario_tarefa.create({
                data: {
                    tarefaId: parseInt(tarefaId),
                    usuarioId: parseInt(usuarioId),
                }
            });
            console.log("Usuario adicionado à tarefa:", { tarefaId, usuarioId });
            return { tarefaId, usuarioId };
        } catch (error) {
            console.error('Erro ao adicionar usuario à tarefa', error);
            throw new Error('Não foi possível adicionar o usuario à tarefa');
        }
    }

    async getAllTarefasUsuario() {
        try {
            return await prismaClient.usuario_tarefa.findMany();
        } catch (error) {
            console.error('Erro ao buscar todas as relações Usuario_Tarefa', error);
            throw error;
        }
    }
}

export default new TarefaService();