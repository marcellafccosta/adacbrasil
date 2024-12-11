import { Router } from "express";

import { PatrocinioController } from "../controllers/PatrocinioController.js";
import upload from '../config/upload.js';

const router = Router();
const patrocinioController = new PatrocinioController();

router.get('/', patrocinioController.getAll);
router.get('/:id', patrocinioController.getById);
router.put('/:id', upload.single('img'), patrocinioController.update);
router.post('/', upload.single('img'), patrocinioController.create);
router.delete('/:id', patrocinioController.delete);

export { router as PatrocinioRoutes }