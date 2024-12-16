import axios from 'axios';

const API_URL = 'https://ongadac-server-flax.vercel.app/api';

class AuthService {

    async login(email, senha) {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, senha });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token); // Store token
                localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user
                return response.data;
            }
        } catch (error) {
            console.error("Login error: ", error.response ? error.response.data : error.message);
            throw error; // Re-throw the error after logging it
        }
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // Remove o token também
    }

    isLoggedIn() {
        const token = localStorage.getItem('token'); // Verifica se o token está presente
        return token ? true : false;
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user')); // Retorna o usuário diretamente
    }

    isSessionExpired() {
        const token = localStorage.getItem('token');
        if (!token) return true;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        return Date.now() >= exp;
    }

    async recoverPassword(email) {
        return await axios.post(`${API_URL}/usuario/recover-password`, email)
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    }

    async resetPassword(data) {
        return await axios.post(`${API_URL}/usuario/reset-password`, data)
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    }

}

export default new AuthService();
