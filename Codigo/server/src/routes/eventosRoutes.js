import { Router } from "express";

import { EventoController } from "../controllers/EventoController.js";

const router = Router();
const eventoController = new EventoController();

router.post('/', eventoController.createEvento);
router.get('/', eventoController.getAllEventos);
router.get('/:id', eventoController.getEventoById);
router.put('/:id', eventoController.updateEvento);
router.delete('/:id', eventoController.deleteEvento);

export { router as EventoRoutes }