import { useState, useEffect } from 'react';
import '../styles/FeedbackSection.css';
import { Button, Modal, notification, Pagination } from "antd";
import NovoFeedback from '../pages/NovoFeedback';

const FeedbackSection = () => {
  const [feedback, setFeedbacks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [api, contextHolder] = notification.useNotification(); // Hook de notificação
  const [currentPage, setCurrentPage] = useState(1); // Estado para a página atual
  const [pageSize, setPageSize] = useState(3); // Número de feedbacks por página

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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const addFeedback = (newFeedback) => {
    setFeedbacks([...feedback, newFeedback]);
    handleClose();
  };

  // Função para notificar o sucesso no envio do feedback
  const notifySuccess = () => {
    api.success({
      message: 'Feedback Enviado',
      description: 'Seu feedback foi enviado com sucesso!',
      placement: 'topRight',
    });
  };

  const notifyError = () => {
    api.error({
      message: 'Erro ao Enviar Feedback',
      description: 'Houve um erro ao enviar seu feedback. Tente novamente.',
      placement: 'topRight',
    });
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentFeedbacks = feedback.slice(startIndex, endIndex);

  return (
    <section className="testimonials">
      {contextHolder}
      <div className="testimonials-heading">
        <h2 className='depoimentos'>Depoimentos</h2>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/e58501e0fcab8160b8c16a070e77d639904bcb58108b973b36fd0f704fa1b7d2?placeholderIfAbsent=true&apiKey=aa99ff00a10f4af2b8ec8267c7952fc6"
          alt="Heading underline"
          className="testimonials-heading-underline"
        />
      </div>
      <div className="testimonials-grid">
        <div className='cardss'>
        {feedback.length === 0 ? (
          <p className="no-feedback-message">Nenhum feedback ainda. Seja o primeiro!</p>
        ) : (
          <>
            {currentFeedbacks.map((feedbackItem, index) => (
              <div key={index} className="testimonial-card">
                <p className="testimonial-text">{`"${feedbackItem.text}"`}</p>
                <p className="testimonial-author">{`- ${feedbackItem.author}`}</p>
              </div>
            ))}
            {/* Preencher espaços em branco */}
            {Array(pageSize - currentFeedbacks.length)
              .fill(null)
              .map((_, index) => (
                <div key={`empty-${index}`} className="testimonial-card empty-card"></div>
              ))}
          </>
        )}
        </div>
        {feedback.length > pageSize && (
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={feedback.length}
            onChange={handlePageChange}
            style={{ textAlign: 'center', marginTop: '20px' }}
          />
        )}
      </div>

      <Button className="feedback-button" type="primary" onClick={showModal}>
        Quero dizer o que achei!
      </Button>

      <Modal
        title="Deixe seu feedback"
        open={isModalVisible}
        onCancel={handleClose}
        footer={null}
      >
        <NovoFeedback addFeedback={addFeedback} notifySuccess={notifySuccess} notifyError={notifyError} />
      </Modal>
    </section>
  );
};

export default FeedbackSection;
