import { PetService } from '../services/PetService.js';

const petService = new PetService();


export class PetController {
    
    async createPet(req, res) {
        try {

            // Extrair os dados enviados no corpo da requisição
            const { nome, idade, sexo, porte, deficiencia, descricaoDeficiencia, comportamento, cor, peso, raca, especie, protetor, dataResgate} = req.body;
    
            // Verificar se a imagem foi enviada via multer
            if (!req.file) {
                return res.status(400).json({ message: "Imagem não fornecida." });
            }
    
            // Pegar o caminho da imagem enviada via multer
            const imgUrl = req.file.path;
            
    
            const pet = await petService.createPet({
                nome,
                idade,
                sexo,
                porte,
                deficiencia,
                descricaoDeficiencia: deficiencia === 'sim' ? descricaoDeficiencia : null,
                comportamento,
                img: imgUrl, // Usar imgUrl aqui
                cor,
                peso,
                raca,
                especie,
                protetor,
                dataResgate: dataResgate ? new Date(dataResgate) : null
            });
    
            return res.status(201).json(pet);
        } catch (error) {
            console.error('Erro ao criar pet:', error);
            return res.status(400).json({ error: error.message });
        }
        
    }

    async deletePet(req, res) {
        try {
            const { id } = req.params;

            await petService.deletePet({
                id
            });

            return res.status(200).json({ message: 'Pet excluído com sucesso!' });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async updatePet(req, res) {
        try {
            const { id } = req.params;
            const { nome, idade, sexo, porte, deficiencia, descricaoDeficiencia, comportamento, cor, peso, raca, especie, protetor, dataResgate, historico, conclusoes,exameClinico } = req.body;
    
            const img = req.file ? req.file.path : null;
            const dataResgateFormatted = dataResgate ? new Date(dataResgate) : null;
    
            const updatedPet = await petService.updatePet({
                id,
                nome,
                idade,
                sexo,
                porte,
                deficiencia,
                descricaoDeficiencia: deficiencia === 'sim' ? descricaoDeficiencia : null,
                comportamento,
                img, 
                cor,
                peso,
                raca,
                especie,
                protetor,
                dataResgate: dataResgateFormatted,
                historico, 
                conclusoes,
                exameClinico
            });
    
            return res.status(200).json(updatedPet);
        } catch (error) {
            console.error("Erro ao atualizar o pet:", error.message);
            return res.status(400).json({ error: error.message });
        }
    }

    async getAllPet(req, res) {
        try {
            const pets = await petService.getAllPets();
            return res.status(200).json(pets);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getPetById(req, res) {
        try {
            const { id } = req.params;
            const pet = await petService.getPetById({ id });
            return res.status(200).json(pet);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

   
}