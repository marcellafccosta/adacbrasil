import UsuarioService from '../services/UsuarioService.js';
import { EmailService } from '../services/EmailService.js';
import { json } from 'express';

export class UsuarioController {

    async getAll(req, res) {
        try {
            const usuarios = await UsuarioService.getAll();
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).json({
                message: 'Não foi possível recuperar os usuários. Tente novamente mais tarde.',
            });
        }
    }

    async getAllVoluntarios(req, res){
        try {
            const voluntarios = await UsuarioService.getAllVoluntarios();
            res.status(200).json(voluntarios)
        }catch(error){
            res.status(500).json({
                message: 'Não foi possível recuperar os voluntários. Tente novamente mais tarde.',
            });
        }
    }

    async deleteVoluntario(req, res) {
        try {
            const { id } = req.params;
            const deletedUser = await UsuarioService.deleteVoluntario(id);

            if (deletedUser) {
                return res.status(204).send(); 
            } else {
                return res.status(404).json({ message: `Voluntário com ID ${id} não encontrado para exclusão.` });
            }
        } catch (error) {
            return res.status(500).json({
                message: 'Não foi possível deletar o voluntário. Verifique o ID e tente novamente.',
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            if (isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'ID inválido. Deve ser um número.' });
            }

            const usuario = await UsuarioService.getById(id);

            if (usuario) {
                res.status(200).json(usuario);
            } else {
                res.status(404).json({ message: `Usuário com ID ${id} não encontrado.` });
            }
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);

            res.status(500).json({
                message: 'Não foi possível buscar o usuário. Por favor, verifique o ID e tente novamente.',
                error: error.message,
            });
        }
    }

    async getByEmail(req, res) {
        try {
            const { email } = req.params;

            if (!email) {
                return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
            }

            const usuario = await UsuarioService.getByEmail(email);

            if (usuario) {
                res.status(200).json(usuario);
            } else {
                res.status(404).json({ message: `Usuário com Email ${email} não encontrado.` });
            }
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);

            res.status(500).json({
                message: 'Não foi possível buscar o usuário. Por favor, verifique o Email e tente novamente.',
                error: error.message,
            });
        }
    }

    async createUser(req, res) {
        try {
            const userData = req.body;
            console.log('Dados recebidos para criação:', userData); // Log dos dados recebidos

            const novoUsuario = await UsuarioService.createUser(userData);
            return res.status(201).json(novoUsuario);

        } catch (error) {
            console.error('Erro ao criar usuário:', error); // Log detalhado do erro
            return res.status(500).json({
                message: 'Não foi possível criar o usuário. Verifique os dados fornecidos e tente novamente.',
                error: error.message
            });
        }
    }


    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const userData = req.body;
            const updatedUser = await UsuarioService.updateUser(id, userData);

            if (updatedUser) {
                return res.status(200).json({ message: 'Usuário atualizado com sucesso.', usuario: updatedUser });
            } else {
                return res.status(404).json({ message: `Usuário com ID ${id} não encontrado.` });
            }
        } catch (error) {
            return res.status(500).json({
                message: 'Não foi possível atualizar o usuário. Verifique os dados e tente novamente.',
                error: error.message
            });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const deletedUser = await UsuarioService.deleteUser(id);

            if (deletedUser) {
                return res.status(204).send(); // 204 No Content não precisa de corpo na resposta
            } else {
                return res.status(404).json({ message: `Usuário com ID ${id} não encontrado para exclusão.` });
            }
        } catch (error) {
            return res.status(500).json({
                message: 'Não foi possível deletar o usuário. Verifique o ID e tente novamente.',
                error: error.message
            });
        }
    }

    async addVoluntarioInfo(req, res) {
        try {
            const { id } = req.params;
            const parsedId = parseInt(id, 10);
    
            if (isNaN(parsedId)) {
                return res.status(400).json({ message: 'ID de usuário inválido.' });
            }
    
            const voluntarioData = req.body;
            const voluntarioInfo = await UsuarioService.addVoluntarioInfo(parsedId, voluntarioData);
    
            return res.status(200).json({
                message: 'Voluntariado adicionado com sucesso',
                voluntario: voluntarioInfo,
            });
        } catch (error) {
            console.error('Erro ao adicionar voluntariado:', error);
            return res.status(500).json({ message: 'Erro ao adicionar informações de voluntariado.' });
        }
    }
    

    async resetPassword(req, res) {
        try {
            const { userAuthenticateId, token, password } = req.body;

            const { success, message } = await this.userResetPasswordService.resetPassword(parseInt(userAuthenticateId, 10), token, password);

            if (!success) {
                return res.status(400).json({ success:success, message: message });
            }

            res.status(201).json({ success:success, message:message });
        } catch (error) {
            res.status(500).json({ success: false , message: 'Erro durante a redefinição de senha' });
        }
    }

    async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;

            const emailService = new EmailService()

            const { resetToken, resetTokenExpiry, error } = await emailService.requestPasswordReset(email);

            res.status(200).json({
                success: true,
                message: 'Token de recuperação de senha enviado por e-mail',
                token: resetToken,
                resetTokenExpiry: resetTokenExpiry,
            });
    
        } catch (error) {
            console.error('Erro durante a solicitação de recuperação de senha:', error);
            res.status(500).json({ message: 'Erro durante a solicitação de recuperação de senha' });
        }
    }

    async resetPassword(req, res) {
        try {
            const { userAuthenticateId, token, password } = req.body;
    
            if (!userAuthenticateId || !token || !password) {
                return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
            }
    
            const emailService = new EmailService();
    
            const { success, message } = await emailService.resetPassword(
                parseInt(userAuthenticateId, 10),
                token,
                password
            );
    
            if (!success) {
                return res.status(400).json({ success: success, message: message });
            }
    
            res.status(200).json({ success: success, message: message }); // Código 200 para sucesso
        } catch (error) {
            console.error('Erro ao redefinir senha:', error); // Log do erro no servidor
            res.status(500).json({ success: false, message: 'Erro durante a redefinição de senha' });
        }
    }
    
}

