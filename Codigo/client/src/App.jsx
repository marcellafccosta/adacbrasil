import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AppRoutes from './routes/AppRoutes';
import locale from 'antd/es/locale/pt_BR';
import './styles/App.css'

const App = () => {
  return (
    <ConfigProvider locale={locale}>
      <Router>
        <AppRoutes />
      </Router>
    </ConfigProvider>
  );
};

export default App;
