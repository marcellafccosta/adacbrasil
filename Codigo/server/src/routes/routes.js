import { Router } from "express";
import { PetRoutes } from "./petsRoutes.js";
import { AuthRoutes } from "../routes/authRoutes.js";
import { UsuariosRoutes } from './usuarioRoutes.js'
import { TarefaRoutes } from './tarefaRoutes.js'
import { FeedbackRoutes } from "../routes/feedbackRoutes.js";
import { PatrocinioRoutes } from "../routes/patrocinioRoutes.js";
import { adocaoRoutes } from "../routes/adocaoRoutes.js";
import { EventoRoutes } from '../routes/eventosRoutes.js'

const routes = Router();

// Adicionando as rotas
routes.use('/pet', PetRoutes);
routes.use('/usuario', UsuariosRoutes);
routes.use('/tarefa', TarefaRoutes)
routes.use('/feedback', FeedbackRoutes);
routes.use('/auth', AuthRoutes);
routes.use('/patrocinio', PatrocinioRoutes);
routes.use('/adocao', adocaoRoutes);
routes.use('/eventos', EventoRoutes);

export default routes;
