import { prismaClient } from '../database/prismaClient.js';

class EventoService {
    async createEvento(data) {
        console.log("Creating evento:", data);
        try {
            const evento = await prismaClient.evento.create({
                data: {
                    ...data,
                    numeroParticipantes: parseInt(data.numeroParticipantes)
                }
            });
            console.log("Evento created successfully:", evento);
            return evento;
        } catch (error) {
            console.error("Error creating evento:", error.message);
            throw new Error("Could not create evento");
        }
    }

    async getAllEventos() {
        console.log("Fetching all eventos");
        try {
            const eventos = await prismaClient.evento.findMany();
            console.log("Eventos fetched successfully:", eventos);
            return eventos;
        } catch (error) {
            console.error("Error fetching eventos:", error.message);
            throw new Error("Could not fetch eventos");
        }
    }

    async getEventoById(id) {
        console.log(`Fetching evento with ID: ${id}`);
        try {
            const evento = await prismaClient.evento.findUnique({
                where: { id: Number(id) },
            });
            if (!evento) {
                console.warn(`Evento with ID ${id} not found`);
            } else {
                console.log("Evento fetched successfully:", evento);
            }
            return evento;
        } catch (error) {
            console.error("Error fetching evento:", error.message);
            throw new Error("Could not fetch evento");
        }
    }

    async updateEvento(id, data) {
        console.log(`Updating evento with ID: ${id}`, data);
        try {
            const evento = await prismaClient.evento.update({
                where: { id: Number(id) },
                data,
            });
            console.log("Evento updated successfully:", evento);
            return evento;
        } catch (error) {
            console.error("Error updating evento:", error.message);
            throw new Error("Could not update evento");
        }
    }

    async deleteEvento(id) {
        console.log(`Deleting evento with ID: ${id}`);
        try {
            await prismaClient.evento.delete({
                where: { id: Number(id) },
            });
            console.log(`Evento with ID ${id} deleted successfully`);
        } catch (error) {
            console.error("Error deleting evento:", error.message);
            throw new Error("Could not delete evento");
        }
    }
}

export default new EventoService();