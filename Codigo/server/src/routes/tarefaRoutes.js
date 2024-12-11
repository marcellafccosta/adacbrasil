import { Router } from "express";

import { TarefaController } from "../controllers/TarefaController.js";

const router = Router();
const tarefaController = new TarefaController();

router.get('/terefa-usuario', tarefaController.getAllTarefaUsuario);

router.post('/', tarefaController.create)
router.get('/', tarefaController.getAll);
// router.get('/:id', tarefaController.getById);
router.put('/:id/status', tarefaController.updtaeStatus);
router.put('/update-order', tarefaController.updtaeOrder);  
router.put('/:id', tarefaController.update);             
 
router.delete('/:id', tarefaController.delete);

export { router as TarefaRoutes }