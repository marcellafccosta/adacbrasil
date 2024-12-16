import axios from 'axios';

const API_URL = 'http://localhost:3001/api/eventos';

class EventoService {

  async getAll() {
    return await axios.get(`${API_URL}/`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }

  async getById(id) {
    return await axios.get(`${API_URL}/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }

  async createEvento(eventoData) {

    const createDateTime = (dateString, timeString) => {
      if (!dateString || !timeString) return null;
      return new Date(`${dateString}T${timeString}`);
    };

    const dataInicio = createDateTime(eventoData.data, eventoData.horaInicio);
    const dataFim = createDateTime(eventoData.data, eventoData.horaFim);

    const formattedData = {
      ...eventoData,
      data: dataInicio,
      horaInicio: dataInicio ? dataInicio.toISOString() : null,
      horaFim: dataFim ? dataFim.toISOString() : null,
    };

    return await axios.post(`${API_URL}`, formattedData)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }

  async updateEvento(id, eventoData) {
    const createDateTime = (dateString, timeString) => {
      if (!dateString || !timeString) return null;
      return new Date(`${dateString}T${timeString}`);
    };

    const dataInicio = createDateTime(eventoData.data, eventoData.horaInicio);
    const dataFim = createDateTime(eventoData.data, eventoData.horaFim);

    const formattedData = {
      ...eventoData,
      data: dataInicio,
      horaInicio: dataInicio ? dataInicio.toISOString() : null,
      horaFim: dataFim ? dataFim.toISOString() : null,
    };

    console.log("Updating evento with ID:", id, formattedData); // Mostra os dados formatados

    return await axios.put(`${API_URL}/${id}`, formattedData)
      .then(response => response.data)
      .catch(error => {
        console.error("Error updating evento:", error);
        throw error;
      });
  }

  async deleteEvento(id) {
    return await axios.delete(`${API_URL}/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }
}

export default new EventoService();
