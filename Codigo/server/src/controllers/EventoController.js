import EventoService from '../services/EventoService.js';

export class EventoController {
    async createEvento(req, res) {
        try {
            console.log("Received request to create evento:", req.body);
            const evento = await EventoService.createEvento(req.body);
            res.status(201).json(evento);
        } catch (error) {
            console.error("Error in createEvento:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async getAllEventos(req, res) {
        try {
            console.log("Received request to fetch all eventos");
            const eventos = await EventoService.getAllEventos();
            res.status(200).json(eventos);
        } catch (error) {
            console.error("Error in getAllEventos:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async getEventoById(req, res) {
        try {
            console.log(`Received request to fetch evento with ID: ${req.params.id}`);
            const evento = await EventoService.getEventoById(req.params.id);
            if (!evento) {
                return res.status(404).json({ message: 'Evento not found' });
            }
            res.status(200).json(evento);
        } catch (error) {
            console.error("Error in getEventoById:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async updateEvento(req, res) {
        try {
            console.log(`Received request to update evento with ID: ${req.params.id}`, req.body);
            const evento = await EventoService.updateEvento(req.params.id, req.body);
            res.status(200).json(evento);
        } catch (error) {
            console.error("Error in updateEvento:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async deleteEvento(req, res) {
        try {
            console.log(`Received request to delete evento with ID: ${req.params.id}`);
            await EventoService.deleteEvento(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error("Error in deleteEvento:", error.message);
            res.status(500).json({ error: error.message });
        }
    }
}