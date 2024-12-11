import { Router } from "express";

import { AuthController } from "../controllers/AuthController.js";

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login);
router.post('/logout', authController.logout);

export { router as AuthRoutes }