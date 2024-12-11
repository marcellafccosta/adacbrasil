import { Router } from "express";
import { AdocaoController } from "../controllers/AdocaoController.js";

const router = Router();
const adocaoController = new AdocaoController();

router.post('/', adocaoController.createAdocao.bind(adocaoController));
router.get('/', adocaoController.getAllAdocoes.bind(adocaoController));
router.delete('/:id', adocaoController.deleteAdocao.bind(adocaoController));
router.put('/:id', adocaoController.updateAdocao.bind(adocaoController));
router.get('/usuario/:usuarioId', adocaoController.getAdocoesByUsuarioId.bind(adocaoController));

export { router as adocaoRoutes };
