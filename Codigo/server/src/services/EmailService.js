import nodemailer from 'nodemailer';
import { prismaClient } from '../database/prismaClient.js';
import crypto from 'crypto';
import { Util } from '../util/Util.js';

export class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendEmail(to, subject, text, html) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text,
            html: html
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('E-mail enviado com sucesso:', info.response);
            return info;
        } catch (error) {
            console.error('Erro ao enviar o e-mail:', error);
            throw error;
        }
    }

    async sendRecoverPasswordEmail(to, subject, text, resetToken) {
        const html = `
            <div class="container" style="width: 80%; margin: 50px auto; display: flex; flex-direction: column; align-items: center; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                <div class="conteudo" style="text-align: center; padding: 20px; background-color: #fff; border-radius: 10px; border: 1px solid #ddd;">
                    <h1 class="titulo-principal" style="font-size: 26px; color: #4A90E2; margin-bottom: 20px;">Recuperação de Senha</h1>
                    <p style="font-size: 18px;">Olá, amigo dos animais! 🐾</p>
                    <p style="font-size: 16px;">Notamos que você solicitou a recuperação da senha da sua conta na ADAC. Não se preocupe, estamos aqui para ajudar!</p>
                    <p style="font-size: 16px;">Para redefinir sua senha e continuar fazendo o bem pelos nossos amigos peludos, clique no botão abaixo:</p>
                    <h3 style="font-size: 20px; color: #081c44; cursor: pointer;">${resetToken}</h3>
                    <a href="http://localhost:5173/reset-password?resetToken=${resetToken}&email=${to}">
                        <button class="botao-redefinir-senha" style="background-color: #081c44; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-top: 10px;">Redefinir Senha</button>
                    </a>
                    <p style="font-size: 16px; margin-top: 20px;">Se você não solicitou essa recuperação, fique tranquilo! Basta ignorar este email.</p>
                    <p style="font-size: 16px;">Com carinho,</p>
                    <p style="font-size: 16px;">A equipe da ADAC - Amantes dos Animais 🐶🐱</p>
                </div>
            </div>
        `;

        this.sendEmail(to, subject, text, html);
    }

    async sendConfirmAccountEmail(to, subject, text) {
        const html = `
        <div class="container" style="width: 80%; margin: 50px auto; display: flex; flex-direction: column; align-items: center;">
            <img class="logo" src="https://via.placeholder.com/107x35" alt="Drogaria Iporanga" style="width: 107px; height: 35px; margin-bottom: 20px;">
            <h1 class="titulo-principal" style="font-size: 24px; margin-bottom: 20px; text-align: center;">Esqueceu a Senha?</h1>
            <div class="conteudo" style="text-align: center; padding: 20px; background-color: #f0f0f0; border-radius: 10px;">
                <p>Olá! 👋</p>
                <p>Parece que alguém está desenterrando sua senha perdida no Drogaria Iporanga! Não se preocupe, estamos prontos
                    para colocar você de volta nos trilhos.</p>
                <p>Para recuperar o controle da sua conta e definir uma nova senha, clique no link abaixo. Vamos fazer isso de
                    forma rápida e sem estresse! 🔒🔑 </p>
                <button class="botao-redefinir-senha" style="background-color: #FF743C; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 15px;">Redefinir sua senha</button>
                <p>Se você não solicitou essa recuperação de senha, não se preocupe - apenas ignore este email e continue com o
                    seu dia.</p>
                <p>Atenciosamente,</p>
                <p>A equipe da Drogaria Iporanga 🚀</p>
            </div>
        </div>
        `;

        this.sendEmail(to, subject, text, html);
    }

    async requestPasswordReset(email) {

        try {

            const user = await prismaClient.usuario.findUnique({
                where: {
                    email: email,
                },
            });

            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            const number = 57894;
            const resetToken = crypto.createHash('sha256').update(String(number) + crypto.randomBytes(8).toString('hex')).digest('hex').slice(0, 8).toUpperCase();
            const resetTokenExpiryMillis = Date.now() + 3600000;
            const resetTokenExpiry = new Date(resetTokenExpiryMillis);

            await prismaClient.usuario.update({
                where: {
                    id: user.id,
                },
                data: {
                    resetToken,
                    resetTokenExpiry,
                },
            });

            const emailService = new EmailService();

            await emailService.sendRecoverPasswordEmail(email, "Recuperar Senha", "", resetToken);

            return { resetToken, resetTokenExpiry };

        } catch (error) {
            console.error('Erro durante a solicitação de recuperação de senha:', error);
            throw new Error('Erro durante a solicitação de recuperação de senha');
        }
    }

    async resetPassword(userAuthenticateId, token, password) {
        try {
            const user = null;
            if (!userAuthenticateId) {
                user = await prismaClient.usuario.findFirst({
                    where: {
                        resetToken: token,
                        resetTokenExpiry: {
                            gte: new Date(),
                        },
                    },
                });
            }

            if (!user && !userAuthenticateId) {
                throw new Error('Token de recuperação de senha inválido ou expirado');
            }

            const { hash, salt } = await Util.encryptPassword(password);

            await prismaClient.usuario.update({
                where: {
                    id: userAuthenticateId ?? user.id,
                },
                data: {
                    senha: hash,
                    senha_salt: salt,
                    resetToken: '',
                    resetTokenExpiry: new Date(),
                },
            });

            return { success: true, message: 'Senha redefinida com sucesso' };
        } catch (error) {
            console.error('Erro durante a redefinição de senha:', error);
            throw new Error('Erro durante a redefinição de senha');
        }
    }
}
