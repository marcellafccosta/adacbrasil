import { prismaClient } from "../database/prismaClient.js";

export class AdocaoService {
    async createAdocao(adocaoData) {
        try {
            const { petId, usuarioId, respostasFormulario } = adocaoData; // Inclua respostasFormulario
            const novaAdocao = await prismaClient.adocao.create({
                data: {
                    petId: petId,
                    usuarioId: usuarioId,
                    status: 'PENDENTE',
                    data: new Date(),
                    proximoAcompanhamento: null,
                    respostasFormulario: respostasFormulario // Adicione este campo
                },
            });
            return novaAdocao;
        } catch (error) {
            console.error('Erro ao criar adoção:', error.message);
            throw new Error('Não foi possível criar a adoção');
        }
        }
        
    async getAllAdocoes() {
        try {
            return await prismaClient.adocao.findMany();
        } catch (error) {
            console.error('Erro ao obter adoções:', error.message);
            throw new Error('Não foi possível obter as adoções');
        }
    }

    async deleteAdocao(id) {
        try {
            const deletedAdocao = await prismaClient.adocao.delete({
                where: {
                    id: parseInt(id),
                },
            });
            return deletedAdocao;
        } catch (error) {
            console.error('Erro ao deletar adoção:', error.message);
            throw new Error('Não foi possível deletar a adoção');
        }
    }

    async updateAdocao(id, adocaoData) {
        try {
            const { status, proximoAcompanhamento, petId, usuarioId } = adocaoData;
            const adocaoAtualizada = await prismaClient.adocao.update({
                where: { id: parseInt(id) },
                data: {
                    status,
                    proximoAcompanhamento,
                    petId,
                    usuarioId
                },
            });
            return adocaoAtualizada;
        } catch (error) {
            console.error('Erro ao atualizar adoção:', error.message);
            throw new Error('Não foi possível atualizar a adoção');
        }
    }

    async getAdocoesByUsuarioId(usuarioId) {
        try {
            // Ensure usuarioId is valid
            const parsedUsuarioId = parseInt(usuarioId);
            if (isNaN(parsedUsuarioId)) {
                throw new Error("ID de usuário inválido");
            }
    
            const adocoes = await prismaClient.adocao.findMany({
                where: { usuarioId: parsedUsuarioId },
                include: {
                    pet: true,      // Include related pet data
                    usuario: true,  // Include related usuario (adopter) data
                },
            });
    
            return adocoes;
        } catch (error) {
            console.error(`Erro ao obter adoções por ID do usuário (ID: ${usuarioId}):`, error.message);
            throw new Error('Não foi possível obter as adoções por ID do usuário');
        }
    }
}

export default new AdocaoService();
