import FeedbackService from '../services/FeedbackService.js';

export class FeedbackController {


    async getAll(req, res) {
        try {
            const feedbacks = await FeedbackService.getAll();
            res.status(200).json(feedbacks);
        } catch (error) {
            res.status(500).json({
                message: 'Não foi possível buscar a lista de feedbacks. Por favor, tente novamente mais tarde.',

            });
        }
    }
    async addFeedback(req, res) {
        try {
            const feedback = await FeedbackService.addFeedback(req.body);
            res.status(201).json(feedback);
        } catch (error) {
            console.error("Erro ao processar o feedback:", error); // Log detalhado
            res.status(500).json({ error: error.message });
        }
    }

    async deleteFeedback(req, res) {
        try {
            const { id } = req.params;  // Pega o ID do feedback a ser deletado via rota
            const deletedFeedback = await FeedbackService.deleteFeedback(id);
            res.status(200).json({
                message: 'Feedback deletado com sucesso!',
                deletedFeedback,
            });
        } catch (error) {
            console.error("Erro ao deletar o feedback:", error); // Log detalhado
            res.status(500).json({ error: error.message });
        }
    }
}