import { useState, useEffect } from 'react';
import { Row, Col, Pagination, notification } from "antd";
import '../styles/Patrocinio.css';

const PatrocinioSection = () => {
  const [patrocinios, setPatrocinios] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8); // Exibe 8 itens por página

  const fetchPatrocinios = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/patrocinio', { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        setPatrocinios(data);
      } else {
        console.error('Erro ao buscar os patrocínios');
      }
    } catch (error) {
      console.error('Erro ao buscar os patrocínios:', error);
    }
  };

  useEffect(() => {
    fetchPatrocinios();
  }, []);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPatrocinios = patrocinios.slice(startIndex, endIndex);

  return (
    <section className="patrocinio-section">
      {contextHolder}
      <div className="testimonials-heading">
        <h2 className='patrocinadores'>Patrocinadores</h2>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/e58501e0fcab8160b8c16a070e77d639904bcb58108b973b36fd0f704fa1b7d2?placeholderIfAbsent=true&apiKey=aa99ff00a10f4af2b8ec8267c7952fc6"
          alt="Heading underline"
          className="testimonials-heading-underline"
        />
      </div>
      <Row gutter={[16, 16]} justify="center" className="patrocinio-grid">
        {currentPatrocinios.length > 0 ? (
          currentPatrocinios.map((patrocinio, index) => (
            <Col key={index} xs={12} sm={8} md={6} lg={4}>
              <div className="patrocinio-card">
                <img
                  alt={patrocinio.nome}
                  src={patrocinio.img || 'https://via.placeholder.com/100'}
                  className="patrocinio-image"
                />
                <p className="patrocinio-name">{patrocinio.nome}</p>
              </div>
            </Col>
          ))
        ) : (
          <p className="no-data-message">Nenhum patrocinador encontrado.</p>
        )}
      </Row>
      {patrocinios.length > pageSize && (
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={patrocinios.length}
          onChange={handlePageChange}
          style={{ textAlign: 'center', marginTop: '20px' }}
        />
      )}
    </section>
  );
};

export default PatrocinioSection;
