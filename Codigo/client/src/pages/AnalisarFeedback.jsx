import React, { useState, useEffect } from 'react';
import { Button, message, Card, Modal, Pagination } from "antd";
import Menu from '../components/Menu';
import { Divider } from "@mui/material";
import '../styles/FeedbackList.css';
import Header from "../components/Header";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null); // Armazena o ID do feedback a ser deletado
  const [currentPage, setCurrentPage] = useState(1); // Estado da página atual
  const [pageSize] = useState(9); // Número de feedbacks por página

  const showModal = (id) => {
    setSelectedFeedbackId(id); // Armazena o ID do feedback selecionado para deleção
    setIsModalVisible(true); // Abre o modal
  };

  const handleOk = () => {
    deleteFeedback(selectedFeedbackId); // Chama a função de deletar feedback com o ID selecionado
    setIsModalVisible(false); // Fecha o modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Fecha o modal
  };

  // Função para buscar feedbacks
  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/feedback', {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data);
      } else {
        console.error('Erro ao buscar os feedbacks');
      }
    } catch (error) {
      console.error('Erro ao buscar os feedbacks:', error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Função para deletar um feedback
  const deleteFeedback = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/feedback/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Remove o feedback da lista local
        setFeedbacks(feedbacks.filter((item) => item.id !== id));

        // Exibe mensagem de sucesso
        message.success('Feedback deletado com sucesso!');

      } else {
        message.error('Erro ao deletar feedback. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao deletar o feedback:', error);
      message.error('Erro ao deletar feedback. Tente novamente.');
    }
  };

  // Função para mudar a página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Cálculo para obter feedbacks da página atual
  const startIndex = (currentPage - 1) * pageSize;
  const currentFeedbacks = feedbacks.slice(startIndex, startIndex + pageSize);

  return (
    <div style={{ display: "flex" }}>
      <Menu />
      <div style={{ height: '100vh', flex: 1, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Header headerName="Analisar Feedbacks" />
        </div>
        <Divider />
  
        <div className="feedback-list-grid">
          {feedbacks.length === 0 ? (
            <p className="no-feedback-message">Nenhum feedback disponível no momento.</p>
          ) : (
            currentFeedbacks.map((feedback, index) => (
              <Card key={index} className="feedback-card" title={`Autor: ${feedback.author}`}>
                <p className="feedback-text">{`"${feedback.text}"`}</p>
  
                <Button className="botaoDeletar" danger onClick={() => showModal(feedback.id)}>
                  Deletar
                </Button>
  
                {/* Modal de confirmação de exclusão */}
                <Modal
                  title="Confirmar Exclusão"
                  open={isModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  okText="Sim, deletar"
                  cancelText="Cancelar"
                  okButtonProps={{
                    style: {
                      backgroundColor: '#8b0404', // Cor do botão "Sim"
                      borderColor: '#8b0404',
                      color: 'white'
                    }
                  }}
                  cancelButtonProps={{
                    style: { backgroundColor: '#04448B', borderColor: '#04448B', color: 'white' } // Cor do botão "Cancelar"
                  }}
                >
                  <p>Tem certeza de que deseja deletar este feedback? Esta ação é irreversível!</p>
                </Modal>
              </Card>
            ))
          )}
        </div>
  
        {/* Componente de Paginação */}
        {feedbacks.length > pageSize && (
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={feedbacks.length}
            onChange={handlePageChange}
            style={{ textAlign: 'center', marginTop: '20px' }}
          />
        )}
      </div>
    </div>
  );
}

export default FeedbackList;
