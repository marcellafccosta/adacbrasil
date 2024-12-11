import AdocaoService from '../services/AdocaoService.js';

export class AdocaoController {

    async createAdocao(req, res) {
        try {
            const adocaoData = req.body;
            console.log('Dados recebidos para criação de adoção:', adocaoData);

            if (!adocaoData || Object.keys(adocaoData).length === 0) {
                return res.status(400).json({
                    message: 'Dados de adoção inválidos ou ausentes.',
                    error: 'Os dados da adoção não foram fornecidos corretamente.'
                });
            }

            const novaAdocao = await AdocaoService.createAdocao(adocaoData);
            return res.status(201).json(novaAdocao);
        } catch (error) {
            console.error('Erro ao criar adoção:', error);
            return res.status(500).json({
                message: 'Não foi possível criar a adoção. Verifique os dados fornecidos e tente novamente.',
                error: error.message
            });
        }
    }

    async getAllAdocoes(req, res) {
        try {
            const adocoes = await AdocaoService.getAllAdocoes();
            return res.status(200).json(adocoes);
        } catch (error) {
            console.error('Erro ao obter adoções:', error);
            return res.status(500).json({
                message: 'Não foi possível obter as adoções.',
                error: error.message
            });
        }
    }

    async deleteAdocao(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    message: 'ID de adoção não fornecido.',
                    error: 'O ID da adoção deve ser especificado para exclusão.'
                });
            }

            await AdocaoService.deleteAdocao(id);
            return res.status(200).json({ message: 'Adoção deletada com sucesso.' });
        } catch (error) {
            console.error('Erro ao deletar adoção:', error);
            return res.status(500).json({
                message: 'Não foi possível deletar a adoção.',
                error: error.message
            });
        }
    }

    async updateAdocao(req, res) {
        try {
            const { id } = req.params; 
            const adocaoData = req.body;
            if (!id || !adocaoData || Object.keys(adocaoData).length === 0) {
                return res.status(400).json({
                    message: 'Dados inválidos para atualização de adoção.',
                    error: 'ID ou dados de adoção ausentes ou inválidos.'
                });
            }

            const adocaoAtualizada = await AdocaoService.updateAdocao(id, adocaoData);
            return res.status(200).json(adocaoAtualizada);
        } catch (error) {
            console.error('Erro ao atualizar adoção:', error);
            return res.status(500).json({
                message: 'Não foi possível atualizar a adoção.',
                error: error.message
            });
        }
    }

    async getAdocoesByUsuarioId(req, res) {
        try {
            const { usuarioId } = req.params; 
            if (!usuarioId) {
                return res.status(400).json({
                    message: 'ID de usuário não fornecido.',
                    error: 'O ID do usuário deve ser especificado para obter as adoções.'
                });
            }

            const adocoes = await AdocaoService.getAdocoesByUsuarioId(usuarioId);
            return res.status(200).json(adocoes);
        } catch (error) {
            console.error('Erro ao obter adoções por ID do usuário:', error);
            return res.status(500).json({
                message: 'Não foi possível obter as adoções.',
                error: error.message
            });
        }
    }
}
