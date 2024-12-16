import React from "react";
import { Modal, Button } from 'antd';

const DeleteTarefaModal = ({ visible, onClose, onDelete, tarefa }) => (
  <Modal title="Excluir Tarefa" open={visible} onCancel={onClose} onOk={onDelete} okText="Excluir" cancelText="Cancelar">
    <p>Tem certeza de que deseja excluir a tarefa "{tarefa?.titulo}"?</p>
  </Modal>
);

export default DeleteTarefaModal;
