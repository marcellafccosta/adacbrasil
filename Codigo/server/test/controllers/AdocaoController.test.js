import {AdocaoController} from '../../src/controllers/AdocaoController.js';
import AdocaoService from '../../src/services/AdocaoService.js';

jest.mock('../../src/services/AdocaoService.js');

const mockRequest = (body = {}, params = {}, query = {}) => ({
    body,
    params,
    query,
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const nextFunction = jest.fn();

describe('AdocaoController', () => {
    let consoleSpy;
    let adocaoController;

    beforeEach(() => {
        adocaoController = new AdocaoController();
        jest.clearAllMocks();
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    test('Deve criar uma nova adoção', async () => {
        const req = mockRequest({ nome: 'Adoção 1' });
        const res = mockResponse();
        const novaAdocao = { id: 1, nome: 'Adoção 1' };

        AdocaoService.createAdocao.mockResolvedValue(novaAdocao);

        await adocaoController.createAdocao(req, res);

        expect(AdocaoService.createAdocao).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(novaAdocao);
    });

    test('Deve lidar com erro ao criar uma adoção', async () => {
        const req = mockRequest({ nome: 'Adoção Inválida' });
        const res = mockResponse();

        AdocaoService.createAdocao.mockRejectedValue(new Error('Erro ao criar adoção'));

        await adocaoController.createAdocao(req, res);

        expect(AdocaoService.createAdocao).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Não foi possível criar a adoção. Verifique os dados fornecidos e tente novamente.',
            error: 'Erro ao criar adoção',
        });
    });
});

export default mockRequest;
export { mockResponse, nextFunction };
