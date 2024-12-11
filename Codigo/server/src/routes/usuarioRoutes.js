import { Router } from "express";

import { UsuarioController } from "../controllers/UsuarioController.js";

const router = Router();
const usuarioController = new UsuarioController();

router.get('/', (req, res) => usuarioController.getAll(req, res));
router.get('/voluntarios', (req, res) => usuarioController.getAllVoluntarios(req, res));
router.get('/:id', (req, res) => usuarioController.getById(req, res));
router.get('/email/:email', (req, res) => usuarioController.getByEmail(req, res));
router.post('/', (req, res) => usuarioController.createUser(req, res));
router.post('/recover-password', (req, res) => usuarioController.requestPasswordReset(req, res));
router.post('/reset-password', (req, res) => usuarioController.resetPassword(req, res));
router.put('/:id', (req, res) => usuarioController.updateUser(req, res));
router.delete('/:id', (req, res) => usuarioController.deleteUser(req, res));
router.delete('/:id/voluntario', (req, res) => usuarioController.deleteVoluntario(req, res));

router.put('/:id/voluntario', (req, res) => usuarioController.addVoluntarioInfo(req, res));

export { router as UsuariosRoutes }