import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout, theme } from 'antd';
import Menu from '../components/Menu'; // Atualizado para incluir o ícone de perfil
import '../styles/Layout.css';

const { Header, Content } = Layout;

const App = () => {
  const [headerTitle, setHeaderTitle] = useState('Pets');
  const location = useLocation(); // Para obter a rota atual

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Hook para atualizar o título com base na rota
  useEffect(() => {
    if (location.pathname.includes('/layout/perfil')) {
      setHeaderTitle(''); // Não exibe título no perfil
    } else if (location.pathname.includes('/pets')) {
      setHeaderTitle('Pets');
    } else if (location.pathname.includes('/volunteers')) {
      setHeaderTitle('Voluntários');
    } else if (location.pathname.includes('/historicoAdocao/:id')) {
      setHeaderTitle('Adoção');
    } else if (location.pathname.includes('/calendar')) {
      setHeaderTitle('Calendário');
     } else if (location.pathname.includes('/AnalisarFeedback')) {
        setHeaderTitle('Analisar Feedbacks');
    } else {
      setHeaderTitle('ADAC'); 
    }
  }, [location.pathname]); // Roda o efeito sempre que a rota mudar

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Menu />
      <Layout>
        {/* Só exibe o Header se o título não for vazio */}
        {headerTitle && (
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              display: 'flex',
              justifyContent: 'center', // Centraliza o título
              alignItems: 'center',
            }}
          >
            <h2 style={{ margin: '0', padding: '0 16px', color: '#041E41' }}>{headerTitle}</h2>
          </Header>
        )}

        <Content
          style={{
            margin: '24px 16px',
            padding: '0 10px',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet /> {/* Renderiza as rotas aninhadas aqui */}
        </Content>
      </Layout>
    </div>
  );
};

export default App;
