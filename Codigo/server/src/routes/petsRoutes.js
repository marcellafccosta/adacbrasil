import { Router } from "express";

import { PetController } from "../controllers/PetController.js";
import upload from '../config/upload.js';

const router = Router();
const petController = new PetController();

router.post('/', upload.single('img'), petController.createPet);
router.get('/', petController.getAllPet);
router.get('/:id', petController.getPetById);
router.put('/:id', upload.single('img'), petController.updatePet);
router.delete('/:id', petController.deletePet);

export { router as PetRoutes }