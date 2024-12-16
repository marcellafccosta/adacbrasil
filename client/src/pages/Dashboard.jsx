import Menu from '../components/Menu';
import Header from '../components/Header';
import '../styles/Dashboard.css';
import LineChartExample from '../components/LineChartExample';
import BarChartExample from '../components/BarChartExample';
import PieChartExample from '../components/PieChartExample';
import AuthService from '../services/AuthService';

const Dashboard = () => {
  const userLoggedIn = AuthService.getCurrentUser();

  if (!userLoggedIn) {
    return <p className="error-message">Usuário não está logado. Por favor, faça login.</p>;
  }

  return (
    <div className="dashboard-container">
      <Menu />
      <div className="dashboard-content">
        <h1 className="welcome-message">Seja bem vindo, {userLoggedIn.nome}</h1>
        <div className="dashboard-section">
          <div className="chart-column">
            <div className="chart-container">
              <LineChartExample />
              <BarChartExample />
            </div>
          </div>
          <div style={{marginRight: '23rem', paddingTop: '5rem', overflow: 'hidden !important'}}>
            <PieChartExample style={{overflow: 'hidden !important'}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
