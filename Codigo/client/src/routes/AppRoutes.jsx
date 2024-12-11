// src/routes/AppRoutes.js

import { Route, Routes } from 'react-router-dom';
import Cadastro from '../pages/Cadastro';
import Formulario from '../pages/Formulario';
import Dashboard from '../pages/Dashboard';
import CadastroPet from '../pages/CadastroPet';
import PetPerfil from '../pages/PetPefil';
import Pets from '../pages/Pets';
import Perfil from '../pages/Perfil';
import LandingPage from '../pages/LandingPage';
import NovoFeedback from '../pages/NovoFeedback';
import CadastroVoluntario from '../pages/CadastroVoluntario';
import Login from '../pages/Login';
import Calendar from '../pages/Calendar';
import PrivateRoute from '../components/PrivateRoute';
import HistoricoAdocao from '../pages/HistoricoAdocao';
import AnalisarFeedback from '../pages/AnalisarFeedback';
import ResetPassword from '../pages/ResetPassword';
import RecoverPassword from '../pages/RecoverPassword';
import Tarefas from '../pages/Tarefas';
import Voluntarios from '../pages/Voluntarios'
import Patrocinio from '../pages/Patrocinio'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/Cadastro" element={<Cadastro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Formulario" element={<Formulario />} />
            <Route path="/reset-password" element={< ResetPassword/>} />
            <Route path="/recover-password" element={< RecoverPassword/>} />
            <Route path="/voluntarios" element={<Voluntarios />} />
            <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
            <Route path="/cadastrar-voluntario" element={<PrivateRoute><CadastroVoluntario /></PrivateRoute>} />
            <Route path="/Dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/Calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
            <Route path="/Pets" element={<PrivateRoute><Pets /></PrivateRoute>} />
            <Route path="/PetPerfil/:id" element={<PrivateRoute><PetPerfil /></PrivateRoute>} />
            <Route path="/CadastroPet" element={<PrivateRoute><CadastroPet /></PrivateRoute>} />
            <Route path="/NovoFeedback" element={<PrivateRoute><NovoFeedback /></PrivateRoute>} />
            <Route path="/HistoricoAdocao" element={<PrivateRoute><HistoricoAdocao /></PrivateRoute>} />
            <Route path="/AnalisarFeedback" element={<PrivateRoute><AnalisarFeedback /></PrivateRoute>} />
            <Route path="/Tarefas" element={<PrivateRoute><Tarefas /></PrivateRoute>} />
            <Route path="/Patrocinio" element={<PrivateRoute><Patrocinio /></PrivateRoute>} />
        </Routes>
    );
};

export default AppRoutes;
