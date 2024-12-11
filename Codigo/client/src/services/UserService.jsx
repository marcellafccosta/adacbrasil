import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

class UsuarioService {

   async getAll() {
    return axios.get(`${API_URL}/usuarios`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }

 async getById(id) {
    return axios.get(`${API_URL}/usuarios/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }

  async getByEmail(email) {
    return axios.get(`${API_URL}/usuario/email/${email}`)
  
  }
  
    getAllVoluntarios() {
    return axios.get(`${API_URL}/voluntarios`) 
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }

  async deleteVoluntario(usuarioId) {
    return axios.delete(`${API_URL}/usuario/${usuarioId}/voluntario`) 
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
}

  async createUser(userData) {
    return axios.post(`${API_URL}/usuarios`, userData)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }

  async updateUser(id, userData) {
    return axios.put(`${API_URL}/usuarios/${id}`, userData)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }

  async deleteUser(id) {
    return axios.delete(`${API_URL}/usuarios/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }

  async addVoluntarioInfo(id, voluntarioData) {
    return axios.post(`${API_URL}/usuarios/${id}/voluntario`, voluntarioData)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }
}

export default new UsuarioService();
