import { prismaClient } from "../database/prismaClient.js"

export class PetService {
    async createPet({ nome, idade, sexo, porte, deficiencia, descricaoDeficiencia, comportamento, img,cor, peso, raca, especie, protetor, dataResgate, historico, conclusoes }) {
        try {
            const existingPet = await prismaClient.pet.findFirst({
                where: {
                    nome: nome
                }
            });

            if (existingPet) {
                throw new Error("Este pet já está cadastrado para o usuário.");
            }
            const pesoFloat = parseFloat(peso);
            if (isNaN(pesoFloat)) {
                return res.status(400).json({ message: "Peso deve ser um número válido." });
            }
            const pet = await prismaClient.pet.create({
                data: {
                    nome,
                    idade: parseInt(idade),
                    sexo,
                    porte,
                    deficiencia,
                    descricaoDeficiencia,
                    comportamento,
                    img, 
                    cor,
                    peso: pesoFloat,
                    raca,
                    especie,
                    protetor,
                    dataResgate,
                    historico,
                    conclusoes
                }
            });

            return pet;
        } catch (error) {
            throw new Error("Erro ao criar pet: " + error.message);
        }
    }

    async deletePet({ id }) {
        try {
            const existingPet = await prismaClient.pet.findUnique({
                where: {
                    id: parseInt(id),
                }
            });

            if (!existingPet) {
                throw new Error("Pet não encontrado ou não pertence a este usuário.");
            }

            await prismaClient.pet.delete({
                where: {
                    id: parseInt(id)
                }
            });

            return { message: "Pet excluído com sucesso!" };
        } catch (error) {
            throw new Error("Erro ao excluir pet: " + error.message);
        }
    }

    async updatePet({ id, nome, idade, sexo, porte, deficiencia, descricaoDeficiencia,comportamento, img,cor, peso, raca, especie, protetor, dataResgate, historico, conclusoes, exameClinico }) {
        try {
            const existingPet = await prismaClient.pet.findUnique({
                where: {
                    id: parseInt(id),
                }
            });

            if (!existingPet) {
                throw new Error("Pet não encontrado para esse usuário.");
            }

            const updatePet = {
                nome: nome || existingPet.nome,
                idade: idade || existingPet.idade,
                sexo: sexo || existingPet.sexo,
                porte: porte || existingPet.porte,
                deficiencia: deficiencia || existingPet.deficiencia,
                descricaoDeficiencia : descricaoDeficiencia || existingPet.descricaoDeficiencia,
                comportamento: comportamento || existingPet.comportamento,
                img: img || existingPet.img,
                cor: cor || existingPet.cor,
                peso: peso || existingPet.peso,
                raca: raca || existingPet.raca,
                especie : especie || existingPet.especie,
                protetor : protetor || existingPet.protetor,
                dataResgate : dataResgate || existingPet.dataResgate,
                historico : historico || existingPet.historico,
                conclusoes  : conclusoes || existingPet.conclusoes,
                exameClinico: exameClinico || existingPet.exameClinico
            };

            const updatedPet = await prismaClient.pet.update({
                where: { id: parseInt(id) },
                data: updatePet,
            });

            return updatedPet;
        } catch (error) {
            throw new Error("Erro ao atualizar pet: " + error.message);
        }
    }

    async getAllPets() {
        try {
            const pets = await prismaClient.pet.findMany();
            return pets;
        } catch (error) {
            throw new Error("Erro ao buscar pets: " + error.message);
        }
    }

    async getPetById({ id }) {
        try {
            const pet = await prismaClient.pet.findUnique({
                where: {
                    id: parseInt(id),
                }
            });

            if (!pet) {
                throw new Error("Pet não encontrado.");
            }

            return pet;
        } catch (error) {
            throw new Error("Erro ao buscar pet: " + error.message);
        }
    }


}