import { json } from 'express';
import TarefaUsuarioService from '../services/TarefaUsuarioService.js';

export default class TarefaUsuarioController {



  
  async createTarefaToUsuario(req, res) {
    const { tarefaId, usuarioId, tipoUsuario } = req.body;

    try {
      const result = await TarefaUsuarioService.createTarefaUsuario(parseInt(tarefaId), parseInt(usuarioId), tipoUsuario)
        
      res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }

  async deleteTarefaFromUsuario(req, res) {
    const { tarefaId, usuarioId, tipoUsuario } = req.body;

    try {
      const result = await TarefaUsuarioService.deleteTarefaUsuario(parseInt(tarefaId), parseInt(usuarioId), tipoUsuario);
      res.status(204).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTarefaByUsuario(req, res) {
    const usuarioId = parseInt(req.params.usuarioId, 10);

    try {
      const result = await TarefaUsuarioService.getTarefasByUsuario(parseInt(usuarioId));
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}