import { prismaClient } from '../database/prismaClient.js';
import { Util } from '../util/Util.js';
import jwt from 'jsonwebtoken';

class AuthService {
    
    static async authenticate(email, senha) {
        const usuario = await prismaClient.usuario.findUnique({
            where: { email },
        });
    
        // Verifica se o usuário existe
        if (!usuario) {
            throw new Error('Usuário não encontrado.');
        }
    
        // Verifica se a senha é válida
        const isPasswordValid = Util.verifyPassword({ salt: usuario.senha_salt, hash: usuario.senha }, senha);
        if (!isPasswordValid) {
            throw new Error('Senha inválida.');
        }
    
        // Gera um token JWT
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
    
        // Remove a senha e o salt do objeto de usuário antes de retornar
        const usuarioSeguro = {
            id: usuario.id,
            email: usuario.email,
            nome: usuario.nome,
            tipo: usuario.tipo
        };
    
        // Retorna o usuário seguro e o token
        return { usuario: usuarioSeguro, token };
    }
    
    
}

export default AuthService;
