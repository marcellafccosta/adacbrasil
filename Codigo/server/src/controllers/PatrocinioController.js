import { PatrocinioService } from '../services/PatrocinioService.js';

const patrocinioService = new PatrocinioService();

export class PatrocinioController {

    async getAll(req, res) {
        try {
            const patrocinios = await patrocinioService.getAllPatrocinios();
            console.log(patrocinios);  // Remova esse log em produção
            return res.status(200).json(patrocinios);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const patrocinio = await patrocinioService.getPatrocinioById(id);
            if (!patrocinio) {
                return res.status(404).json({ error: 'Patrocínio não encontrado' });
            }
            return res.status(200).json(patrocinio);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            if (!req.file || !req.file.path) {
                return res.status(400).json({ message: "Imagem não fornecida." });
            }


            const imgUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            const patrocinio = await patrocinioService.createPatrocinio(req.body, imgUrl);

            return res.status(201).json(patrocinio);
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await patrocinioService.deletePatrocinio(id);
            if (result === 0) {
                return res.status(404).json({ error: 'Patrocínio não encontrado' });
            }
            return res.status(200).json({ message: 'Patrocínio excluído com sucesso!' });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const img = req.file ? req.file.path : null;

            console.log('Arquivo recebido:', req.file);
            console.log('Dados recebidos:', req.body);


            const updatedPatrocinio = await patrocinioService.updatePatrocinio(id, data, img);

            if (!updatedPatrocinio) {
                return res.status(404).json({ error: 'Patrocínio não encontrado' });
            }

            return res.status(200).json(updatedPatrocinio);
        } catch (error) {
            console.error("Erro ao atualizar patrocínio:", error.message);
            throw new Error("Erro ao atualizar patrocínio: " + error.message);
        }
    }
}
