import { AuthController } from '../../src/controllers/AuthController.js';
import AuthService from '../../src/services/AuthService.js';

jest.mock('../../src/services/AuthService.js'); // Mocking AuthService

describe('AuthController', () => {
    let authController;

    beforeEach(() => {
        authController = new AuthController();
        // Silenciar console.error para não aparecer no teste
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('login', () => {
        it('should login successfully with correct credentials', async () => {
            const mockRequest = {
                body: {
                    email: 'test@example.com',
                    senha: 'password123'
                },
                session: {}
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mocking the authenticate method of AuthService
            AuthService.authenticate = jest.fn().mockResolvedValue({
                usuario: { id: 1, email: 'test@example.com', nome: 'Test User', tipo: 'admin' },
                token: 'valid-token'
            });

            await authController.login(mockRequest, mockResponse);

            expect(AuthService.authenticate).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Login realizado com sucesso!',
                user: {
                    id: 1,
                    email: 'test@example.com',
                    nome: 'Test User',
                    tipo: 'admin'
                },
                token: 'valid-token'
            });
        });

        it('should return 400 if invalid credentials are provided', async () => {
            const mockRequest = {
                body: {
                    email: 'test@example.com',
                    senha: 'wrongpassword'
                },
                session: {}
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            AuthService.authenticate = jest.fn().mockResolvedValue({ usuario: null, token: null });

            await authController.login(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Usuário ou senha inválidos' });
        });

        it('should return 500 if an error occurs during login', async () => {
            const mockRequest = {
                body: {
                    email: 'test@example.com',
                    senha: 'password123'
                },
                session: {}
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            AuthService.authenticate = jest.fn().mockRejectedValue(new Error('Authentication error'));

            await authController.login(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Erro ao realizar login. Tente novamente mais tarde.' });
        });
    });

    describe('logout', () => {
        it('should log out successfully', async () => {
            const mockRequest = {
                session: { user: { id: 1 } }
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            mockRequest.session.destroy = jest.fn((callback) => callback(null));

            await authController.logout(mockRequest, mockResponse);

            expect(mockRequest.session.destroy).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Logout realizado com sucesso!' });
        });

        it('should return 500 if an error occurs during logout', async () => {
            const mockRequest = {
                session: { user: { id: 1 } }
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            mockRequest.session.destroy = jest.fn((callback) => callback(new Error('Logout error')));

            await authController.logout(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Erro ao fazer logout.' });
        });
    });

    describe('checkSession', () => {
        it('should return loggedIn true if session exists', async () => {
            const mockRequest = {
                session: {
                    user: { id: 1, email: 'test@example.com', nome: 'Test User' }
                }
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await authController.checkSession(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ loggedIn: true, user: mockRequest.session.user });
        });

        it('should return loggedIn false if no session exists', async () => {
            const mockRequest = { session: {} };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await authController.checkSession(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ loggedIn: false });
        });
        
    });
});
