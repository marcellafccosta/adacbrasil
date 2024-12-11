import TarefaService from '../services/TarefaService.js';
import express from 'express';

export class TarefaController{
    async getAll(req, res) {
        try {
            const tarefas = await TarefaService.getAllTarefas();

            // if(req.query.format === 'json') {
                return res.status(200).json(tarefas);
            // }else{
            //     return res.render('tarefas', { tarefas });
            // }

        } catch (error) {
            res.status(500).json({
                message: 'Não foi possível recuperar as tarefas. Tente novamente mais tarde.'+ error,
            });
        }
    }

    async getAllTarefaUsuario(req, res) {

        try {
          const tarefas = await TarefaService.getAllTarefasUsuario();
          return res.status(200).json(tarefas);
        } catch (error) {
          res.status(500).json({
            message: 'Não foi possível recuperar as tarefas usuario. Tente novamente mais tarde.'+ error,
        });
        }
        const usuarioId = parseInt(req.params.usuarioId, 10);
      }

    async create(req, res) {
        try {

            console.log("Corpo body tarefa: " +req.body.tarefaData + " corpo usuario: " +req.body.usuariosIds);

            const tarefa = await TarefaService.createTarefa(req.body.tarefaData, req.body.usuariosIds);
            res.status(201).json(tarefa);
        } catch (error) {
            res.status(400).json({
                message: 'Não foi possível cadastrar a tarefa.',
            });
        }
    }

    async update(req, res) {
        try {
            const tarefa = await TarefaService.updateTarefa(req.params.id, req.body);
            res.status(200).json(tarefa);
        } catch (error) {
            res.status(400).json({
                message: 'Não foi possível atualizar a tarefa.',
            });
        }
    }

    async updtaeStatus(req, res) {
        try {
            const tarefa = await TarefaService.updateStatusTarefa(req.params.id, req.body);
            res.status(200).json(tarefa);
        } catch (error) {
            res.status(400).json({
                message: 'Não foi possível atualizar o status da tarefa.',
            });
        }
    }

    async updtaeOrder(req, res) {
        try {
            const tarefa = await TarefaService.updateOrderTarefa(req.body);
            res.status(200).json(tarefa);
        } catch (error) {
            res.status(400).json({
                message: 'Não foi possível atualizar a ordem da tarefa.',
            });
        }
    }

    async delete(req, res) {
        try {
            const tarefa = await TarefaService.deleteTarefa(req.params.id);
            res.status(204).json(tarefa);
        } catch (error) {
            res.status(400).json({
                message: 'Não foi possível excluir a tarefa.',
            });
        }
    }
}