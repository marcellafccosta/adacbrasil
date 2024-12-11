import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class FeedbackService {

  async getAll() {
    try {
      const feedbacks = await prisma.feedback.findMany();
      return feedbacks;
    } catch (error) {
      throw new Error('Erro ao buscar feedbacks');
    }
  }

  async addFeedback(data) {
    const { text, author } = data;

    // Validação básica para verificar se o texto do feedback foi fornecido
    if (!text) {
        throw new Error('Texto do feedback é obrigatório');
    }

    // Exemplo de validação para limitar o tamanho do texto (opcional)
    if (text.length > 1000) {
        throw new Error('O feedback é muito longo. Limite a 1000 caracteres.');
    }

    try {
        // Adiciona um log para verificar os dados que estão sendo enviados
        console.log('Adicionando feedback:', { text, author });

        const feedback = await prisma.feedback.create({
            data: {
                text: text.trim(),  // Remove espaços extras
                author: author ? author.trim() : 'Anônimo',  // Define "Anônimo" se o autor não for fornecido
            },
        });

        return feedback;  // Retorna o feedback para o controller
    } catch (error) {
        console.error('Erro ao adicionar feedback:', error);  // Loga o erro para depuração
        throw new Error('Erro ao adicionar feedback');  // Lança erro para ser tratado no controller
    }
}

async deleteFeedback(id) {
  try {
    // Verifica se o ID foi fornecido
    if (!id) {
      throw new Error('ID do feedback é obrigatório');
    }

    // Exclui o feedback com o ID fornecido
    const feedback = await prisma.feedback.delete({
      where: { id: parseInt(id) },  // Converte para número, caso o ID seja uma string
    });

    return feedback;  // Retorna o feedback deletado para confirmação
  } catch (error) {
    console.error('Erro ao deletar feedback:', error);  // Loga o erro para depuração
    throw new Error('Erro ao deletar feedback');  // Lança erro para ser tratado no controller
  }
}

}

export default new FeedbackService();
