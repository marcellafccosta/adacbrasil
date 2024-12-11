import { prismaClient } from '../database/prismaClient.js';

class TarefaUsuarioService {



    async createTarefaUsuario(tarefaId, usuarioId, tipoUsuario) {

        try {
            return await prismaClient.usuario_tarefa.create({
                data: {
                    tarefa: { connect: { id: parseInt(tarefaId) } },
                    usuario: { connect: { id: parseInt(usuarioId) } },
                    tipoUsuario: tipoUsuario
                },
            })
        } catch (error) {
            console.error('Erro ao criar Usuario_Tarefa', error);
            throw error;
        }
    }

    async deleteTarefaUsuario(tarefaId, usuarioId, tipoUsuario) {
        try {
            return await prismaClient.usuario_tarefa.deleteMany({
                where: {
                    tarefaId: parseInt(tarefaId),
                    usuarioId: parseInt(usuarioId),
                    tipoUsuario: tipoUsuario
                },
            })
        } catch (error) {
            console.error('Erro ao deletar Usuario_Tarefa', error);
            throw error;
        }
    }

    async getTarefasByUsuario(usuarioId) {
        try {
            return await prismaClient.usuario_tarefa.findMany({
                where: {usuarioId: usuarioId},
                include: {
                    usuario_tarefa: {
                        include: {
                            tarefa: true,
                        },
                    },
                },
            })
        } catch (error) {
            console.error('Erro ao buscar Tarefas por Usuario', error);
            throw error;
        }
    }
    

}

export default new TarefaUsuarioService();