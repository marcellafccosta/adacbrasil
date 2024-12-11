// services/PatrocinioService.js
import { prismaClient } from "../database/prismaClient.js";

export class PatrocinioService {
    
    async getAllPatrocinios() {
        try {
            return await prismaClient.patrocinio.findMany();
        } catch (error) {
            throw new Error("Erro ao buscar patrocínios: " + error.message);
        }
    }

    async getPatrocinioById(id) {
        try {
            const patrocinio = await prismaClient.patrocinio.findUnique({
                where: { id: parseInt(id) },
            });

            if (!patrocinio) {
                throw new Error("Patrocínio não encontrado.");
            }

            return patrocinio;
        } catch (error) {
            throw new Error("Erro ao buscar patrocínio: " + error.message);
        }
    }

    async createPatrocinio(data, imgUrl) {
        try {
            // const existingPatrocinio = await prismaClient.patrocinio.findFirst({
            //     where: { nome: data.nome },
            // });

            // if (existingPatrocinio) {
            //     throw new Error("Patrocínio já cadastrado.");
            // }

            const fullImgUrl = imgUrl.startsWith('http') ? imgUrl : `http://localhost:3000/${imgUrl}`;

            const patrocinio =  await prismaClient.patrocinio.create({
                data: { ...data, img: fullImgUrl },
            });

            console.log(patrocinio)

            return patrocinio
        } catch (error) {
            throw new Error("Erro ao criar patrocínio: " + error.message);
        }
    }

    async deletePatrocinio(id) {
        try {
            const patrocinio = await prismaClient.patrocinio.findUnique({
                where: { id: parseInt(id) },
            });

            if (!patrocinio) {
                throw new Error("Patrocínio não encontrado.");
            }

            await prismaClient.patrocinio.delete({
                where: { id: parseInt(id) },
            });

            return { message: "Patrocínio excluído com sucesso!" };
        } catch (error) {
            throw new Error("Erro ao excluir patrocínio: " + error.message);
        }
    }

    async updatePatrocinio(id, data, img) {
        const patrocinio = await prismaClient.patrocinio.findUnique({
            where: { id: parseInt(id) },
        });
    
        if (!patrocinio) {
            return null;
        }
    
        // Se uma nova imagem for enviada, atualiza o campo `img`
        const updatedData = {
            nome: data.nome || patrocinio.nome,
        };
    
        if (img) {

            const fullImgUrl = img.startsWith('http') ? img : `http://localhost:3000/${img}`;

            updatedData.img = fullImgUrl;
        }

        
    
        const updatedPatrocinio = await prismaClient.patrocinio.update({
            where: { id: parseInt(id) },
            data: updatedData,
        });

        console.log(updatedPatrocinio)
    
        return updatedPatrocinio;
    }
    
    
}
