import { EventoController } from '../../src/controllers/EventoController.js';
import EventoService from '../../src/services/EventoService.js';

// Mocking EventoService methods
jest.mock('../../src/services/EventoService.js');

describe('EventoController', () => {
    let eventoController;
    let mockRequest;
    let mockResponse;

    beforeAll(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        console.log.mockRestore();
        console.error.mockRestore();
    });

    beforeEach(() => {
        eventoController = new EventoController();
        mockRequest = {
            body: {
                nome: 'Evento Teste',
                data: '2024-12-01T12:00:00Z',
                descricao: 'Descrição do evento',
                local: 'Local do evento'
            },
            params: {
                id: '1'
            }
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createEvento', () => {
        it('deve criar um evento com sucesso', async () => {
            EventoService.createEvento.mockResolvedValue(mockRequest.body);

            await eventoController.createEvento(mockRequest, mockResponse);

            expect(EventoService.createEvento).toHaveBeenCalledWith(mockRequest.body);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockRequest.body);
        });

        it('deve retornar erro 500 se ocorrer um erro', async () => {
            const errorMessage = 'Erro ao criar evento';
            EventoService.createEvento.mockRejectedValue(new Error(errorMessage));

            await eventoController.createEvento(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });

    describe('getAllEventos', () => {
        it('deve listar todos os eventos com sucesso', async () => {
            const eventos = [{ id: 1, nome: 'Evento Teste' }];
            EventoService.getAllEventos.mockResolvedValue(eventos);

            await eventoController.getAllEventos(mockRequest, mockResponse);

            expect(EventoService.getAllEventos).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(eventos);
        });

        it('deve retornar erro 500 se ocorrer um erro ao listar eventos', async () => {
            const errorMessage = 'Erro ao listar eventos';
            EventoService.getAllEventos.mockRejectedValue(new Error(errorMessage));

            await eventoController.getAllEventos(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });

    describe('getEventoById', () => {
        it('deve retornar um evento pelo ID com sucesso', async () => {
            const evento = { id: 1, nome: 'Evento Teste' };
            EventoService.getEventoById.mockResolvedValue(evento);

            await eventoController.getEventoById(mockRequest, mockResponse);

            expect(EventoService.getEventoById).toHaveBeenCalledWith(mockRequest.params.id);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(evento);
        });

        it('deve retornar 404 se evento não encontrado', async () => {
            EventoService.getEventoById.mockResolvedValue(null);

            await eventoController.getEventoById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Evento not found' });
        });

        it('deve retornar erro 500 se ocorrer um erro ao buscar evento', async () => {
            const errorMessage = 'Erro ao buscar evento';
            EventoService.getEventoById.mockRejectedValue(new Error(errorMessage));

            await eventoController.getEventoById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });

    describe('updateEvento', () => {
        it('deve atualizar um evento com sucesso', async () => {
            const updatedEvento = { id: 1, nome: 'Evento Atualizado' };
            EventoService.updateEvento.mockResolvedValue(updatedEvento);

            await eventoController.updateEvento(mockRequest, mockResponse);

            expect(EventoService.updateEvento).toHaveBeenCalledWith(mockRequest.params.id, mockRequest.body);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(updatedEvento);
        });

        it('deve retornar erro 500 se ocorrer um erro na atualização', async () => {
            const errorMessage = 'Erro ao atualizar evento';
            EventoService.updateEvento.mockRejectedValue(new Error(errorMessage));

            await eventoController.updateEvento(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });

    describe('deleteEvento', () => {
        it('deve excluir um evento com sucesso', async () => {
            EventoService.deleteEvento.mockResolvedValue();

            await eventoController.deleteEvento(mockRequest, mockResponse);

            expect(EventoService.deleteEvento).toHaveBeenCalledWith(mockRequest.params.id);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });

        it('deve retornar erro 500 se ocorrer um erro ao excluir evento', async () => {
            const errorMessage = 'Erro ao excluir evento';
            EventoService.deleteEvento.mockRejectedValue(new Error(errorMessage));

            await eventoController.deleteEvento(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });
});
