import { FeedbackController } from '../../src/controllers/FeedbackController.js';
import FeedbackService from '../../src/services/FeedbackService.js';

jest.mock('../../src/services/FeedbackService.js'); // Mockando FeedbackService

describe('FeedbackController', () => {
    let feedbackController;

    beforeEach(() => {
        feedbackController = new FeedbackController();
        jest.spyOn(console, 'error').mockImplementation(() => {}); // Silenciar console.error nos testes
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('getAll', () => {
        it('deve retornar todos os feedbacks com status 200', async () => {
            const mockFeedbacks = [
                { id: 1, mensagem: 'Ótimo serviço!', usuario: 'João' },
                { id: 2, mensagem: 'Muito bom.', usuario: 'Maria' }
            ];
            FeedbackService.getAll.mockResolvedValue(mockFeedbacks);

            const mockRequest = {};
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await feedbackController.getAll(mockRequest, mockResponse);

            expect(FeedbackService.getAll).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockFeedbacks);
        });

        it('deve retornar status 500 se ocorrer um erro', async () => {
            FeedbackService.getAll.mockRejectedValue(new Error('Erro no serviço'));

            const mockRequest = {};
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await feedbackController.getAll(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Não foi possível buscar a lista de feedbacks. Por favor, tente novamente mais tarde.',
            });
        });
    });

    describe('addFeedback', () => {
        it('deve adicionar um feedback com status 201', async () => {
            const newFeedback = { mensagem: 'Serviço excelente!', usuario: 'Carlos' };
            FeedbackService.addFeedback.mockResolvedValue({ id: 3, ...newFeedback });

            const mockRequest = { body: newFeedback };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await feedbackController.addFeedback(mockRequest, mockResponse);

            expect(FeedbackService.addFeedback).toHaveBeenCalledWith(newFeedback);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({ id: 3, ...newFeedback });
        });

        it('deve retornar status 500 se ocorrer um erro ao adicionar feedback', async () => {
            FeedbackService.addFeedback.mockRejectedValue(new Error('Erro ao adicionar feedback'));

            const mockRequest = { body: { mensagem: 'Teste de erro', usuario: 'Carlos' } };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await feedbackController.addFeedback(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Erro ao adicionar feedback' });
        });
    });

    describe('deleteFeedback', () => {
        it('deve deletar um feedback com status 200', async () => {
            const mockFeedback = { id: 1, mensagem: 'Feedback para deletar', usuario: 'João' };
            FeedbackService.deleteFeedback.mockResolvedValue(mockFeedback);

            const mockRequest = { params: { id: '1' } };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await feedbackController.deleteFeedback(mockRequest, mockResponse);

            expect(FeedbackService.deleteFeedback).toHaveBeenCalledWith('1');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Feedback deletado com sucesso!',
                deletedFeedback: mockFeedback,
            });
        });

        it('deve retornar status 500 se ocorrer um erro ao deletar feedback', async () => {
            FeedbackService.deleteFeedback.mockRejectedValue(new Error('Erro ao deletar feedback'));

            const mockRequest = { params: { id: '1' } };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await feedbackController.deleteFeedback(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Erro ao deletar feedback' });
        });
    });
});
