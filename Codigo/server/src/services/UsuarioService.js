import { prismaClient } from "../database/prismaClient.js";
import { Util } from '../util/Util.js'

function convertToISODate(dataNascimento) {
    const [dia, mes, ano] = dataNascimento.split('/'); // Divide a data no formato dd/mm/aa
    const isoDate = new Date(`${ano}-${mes}-${dia}`).toISOString(); // Converte para ISO
    return isoDate;
}

export class UsuarioService {

    async getAll() {
        try {
            const usuarios = await prismaClient.usuario.findMany({
                include: {
                    endereco: true,
                    infovoluntario: true,
                },
            });
            //console.log("Usuários encontrados:", usuarios);
            return usuarios;
        } catch (error) {
            console.error('Erro ao buscar todos os usuários', error);
            throw new Error('Não foi possível buscar os usuários');
        }
    }

    async getAllVoluntarios() {
        try {
            const voluntarios = await prismaClient.infovoluntario.findMany({
                include: {
                    usuario: {
                        select: {
                            nome: true,
                            email: true,
                        },
                    },
                },
            });
            console.log("Voluntários encontrados:", voluntarios);
            return voluntarios;
        } catch (error) {
            console.error('Erro ao buscar voluntários', error);
            throw new Error('Não foi possível buscar os voluntários');
        }
    }

    async deleteVoluntario(usuarioId) {
        try {
            const id = parseInt(usuarioId, 10);
            if (isNaN(id)) {
                throw new Error('ID de usuário inválido.');
            }

            const usuario = await prismaClient.usuario.findUnique({
                where: { id },
                include: { infovoluntario: true },
            });
    
            if (!usuario) {
                throw new Error('Usuário não encontrado.');
            }
    
            if (!usuario.infovoluntario) {
                throw new Error('O usuário não possui informações de voluntário para deletar.');
            }
    
            await prismaClient.infovoluntario.delete({
                where: { id: usuario.infovoluntario.id },
            });
    
            return { message: 'Informações de voluntário deletadas com sucesso.' };
        } catch (error) {
            console.error('Erro ao deletar informações de voluntariado:', error);
            throw new Error('Não foi possível deletar as informações de voluntário.');
        }
    }

    async getByEmail(email) {
        return await db('usuarios').where({ email }).first();
    }

    async savePasswordResetToken(id, token, expiration) {
        try {
            return await prismaClient.usuario.update({
                where: { id: parseInt(id) },
                data: {
                    password_reset_token: token,
                    password_reset_expires: new Date(expiration),
                },
            });
        } catch (error) {
            console.error('Erro ao salvar o token de recuperação de senha:', error);
            throw new Error('Não foi possível salvar o token de recuperação de senha');
        }
    }

    async getById(id) {
        try {
            return await prismaClient.usuario.findUnique({
                where: { id: parseInt(id) },
                include: {
                    endereco: true,
                    infovoluntario: true,
                },
            });
        } catch (error) {
            console.error('Erro ao buscar usuário:', error.message);
            throw new Error('Não foi possível buscar o usuário. Tente novamente mais tarde.');
        }
    }

    async getByEmail(email) {
        try {
            return await prismaClient.usuario.findUnique({
                where: { email: email },
            });
        } catch (error) {
            console.error('Erro ao buscar usuário:', error.message);
            throw new Error('Não foi possível buscar o usuário. Tente novamente mais tarde.');
        }
    }

    async createUser(userData) {
        try {
            const { endereco, dataNascimento, voluntario = false, profissao, tempoDisponivel, contribuicoes, senha, ...usuarioData } = userData;
    
            if (!endereco || Object.keys(endereco).length === 0) {
                throw new Error('Endereço é obrigatório e deve estar preenchido corretamente.');
            }
            
            const { hash, salt } = Util.encryptPassword(senha);
            const isoDate = convertToISODate(dataNascimento);

            console.log(isoDate);
    
            const novoUsuario = await prismaClient.usuario.create({
                data: {
                    ...usuarioData,
                    senha: hash,
                    senha_salt: salt,
                    dataNascimento: isoDate,
                    tipo: voluntario ? 'VOLUNTARIO' : 'CLIENTE',
                },
            });
    
            await prismaClient.endereco.create({
                data: {
                    ...endereco,
                    complemento: endereco.complemento || '',
                    usuario: {
                        connect: { id: novoUsuario.id },
                    },
                },
            });
    
            if (voluntario) {
                if (!profissao || !tempoDisponivel || !contribuicoes ) {
                    throw new Error('Os dados de voluntário são obrigatórios quando o voluntariado é marcado.');
                }
                
    
                await prismaClient.infovoluntario.create({
                    data: {
                        profissao,
                        tempoDisponivel,
                        contribuicoes: contribuicoes.join(', '),
                        usuario: {
                            connect: { id: novoUsuario.id },
                        },
                    },
                });
            }
    
            return novoUsuario;
        } catch (error) {
            console.error('Erro ao criar usuário:', error.message);
            throw new Error(`Não foi possível cadastrar o usuário: ${error.message}`);

        }
    }

    async updateUser(id, userData) {
        try {
            const { endereco, dataNascimento, infovoluntario, ...usuarioData } = userData;
    
            let isoDate;
            if (dataNascimento && !isNaN(new Date(dataNascimento))) {
                isoDate = new Date(dataNascimento).toISOString();
            }
    
            // Check if infovoluntario is provided, and if so, update tipo to VOLUNTARIO
            let updatedUserData = {
                ...usuarioData,
                dataNascimento: isoDate,
                endereco: {
                    upsert: {
                        create: endereco,
                        update: endereco,
                    },
                },
                infovoluntario: {
                    upsert: {
                        create: infovoluntario,
                        update: infovoluntario,
                    },
                },
            };
    
            // If infovoluntario data exists, set tipo to VOLUNTARIO
            if (infovoluntario) {
                updatedUserData = {
                    ...updatedUserData,
                    tipo: 'VOLUNTARIO', // Set the user type to VOLUNTARIO when updating volunteer info
                };
            }
    
            // Perform the update
            const usuarioAtualizado = await prismaClient.usuario.update({
                where: { id: parseInt(id) },
                data: updatedUserData,
                include: { endereco: true, infovoluntario: true },
            });
    
            return usuarioAtualizado;
        } catch (error) {
            console.error('Erro ao atualizar usuário', error.message);
            throw new Error('Não foi possível atualizar o usuário');
        }
    }
    


    async deleteUser(id) {
        try {
            // Deletar registros relacionados em Adocao
            await prismaClient.adocao.deleteMany({
                where: { usuarioId: parseInt(id) }
            });
    
            // Deletar registros relacionados em outras tabelas, como endereco, tarefa, etc.
            await prismaClient.endereco.deleteMany({
                where: { usuarioId: parseInt(id) }
            });
    
            // Agora, deletar o usuário
            const usuarioDeletado = await prismaClient.usuario.delete({
                where: { id: parseInt(id) },
            });
    
            return usuarioDeletado;
        } catch (error) {
            console.error('Erro ao deletar usuário', error);
            throw new Error('Não foi possível deletar o usuário');
        }
    }
    

    async addVoluntarioInfo(usuarioId, voluntarioData) {
        try {
            const id = parseInt(usuarioId, 10);
            if (isNaN(id)) {
                throw new Error('ID de usuário inválido');
            }
    
            const usuario = await prismaClient.usuario.findUnique({
                where: { id },
                include: { infovoluntario: true },
            });
    
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }
    
            // Se o usuário ainda não for voluntário, altere seu tipo
            if (!usuario.tipo || usuario.tipo !== 'VOLUNTARIO') {
                // Atualiza o tipo do usuário para 'VOLUNTARIO'
                await prismaClient.usuario.update({
                    where: { id },
                    data: {
                        tipo: 'VOLUNTARIO',
                    },
                });
            }
    
            const contribuicoesString = Array.isArray(voluntarioData.contribuicoes) 
                ? voluntarioData.contribuicoes.join(', ') 
                : voluntarioData.contribuicoes;
    
            const data = {
                ...voluntarioData,
                contribuicoes: contribuicoesString,
            };
    
            if (usuario.infovoluntario) {
                return await prismaClient.infovoluntario.update({
                    where: { id: usuario.infovoluntario.id },
                    data,
                });
            } else {
                return await prismaClient.infovoluntario.create({
                    data: {
                        ...data,
                        usuario: {
                            connect: { id },
                        },
                    },
                });
            }
        } catch (error) {
            console.error('Erro ao adicionar informações de voluntariado:', error.message);
            throw error;
        }
    }
    

}
    

export default new UsuarioService();
