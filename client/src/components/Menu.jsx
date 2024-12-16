import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person'; 
import FeedbackIcon from '@mui/icons-material/Feedback';
import HandshakeIcon from '@mui/icons-material/Handshake';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import logo from '../assets/adaclogoredonda.png';
import AuthService from '../services/AuthService'; 
import { Link } from 'react-router-dom';

const Menu = () => {
    const navigate = useNavigate();
    const userLoggedIn = AuthService.getCurrentUser();
    const isAdmin = userLoggedIn.tipo === 'ADMIN';
    const isCliente = userLoggedIn.tipo === 'CLIENTE';
    const isVoluntario = userLoggedIn.tipo === 'VOLUNTARIO';
    

    const handleClick = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        AuthService.logout(); // Chame o método de logout do AuthService
        navigate('/login');   // Redirecione para a página de login
    };

    const menuItems = [
        { text: 'Home', icon: <DashboardIcon sx={{ color: '#fff' }} />, path: '/dashboard'},
        { text: 'Pets', icon: <PetsIcon sx={{ color: '#fff' }} />, path: '/pets' },
        { 
            text: 'Voluntários', 
            icon: <VolunteerActivismIcon sx={{ color: '#fff' }} />, 
            path: '/voluntarios', 
            visible: isAdmin || isVoluntario // Visível para ADMIN ou VOLUNTÁRIO
        },
        { text: 'Histórico de adoções', icon: <FavoriteIcon sx={{ color: '#fff' }} />, path: '/historicoAdocao'},
        { text: 'Calendário', icon: <CalendarTodayIcon sx={{ color: '#fff' }} />, path: '/calendar'},
        { 
            text: 'Tarefas de Voluntários', 
            icon: <SettingsIcon sx={{ color: '#fff' }} />, 
            path: '/Tarefas', 
            visible: isAdmin || isVoluntario // Visível para ADMIN ou VOLUNTÁRIO
        },
        ...(isAdmin
            ? [
                { text: 'Analisar Feedbacks', icon: <FeedbackIcon sx={{ color: '#fff' }} />, path: '/AnalisarFeedback' },
                { text: 'Patrocínios', icon: <HandshakeIcon sx={{ color: '#fff' }} />, path: '/Patrocinio' }
              ]
            : []
        ),
        { text: 'Perfil', icon: <PersonIcon sx={{ color: '#fff' }} />, path: '/perfil' },
        { text: 'Logout', icon: <LogoutIcon sx={{ color: '#fff' }} />, action: handleLogout } // Botão de logout
    ];


    const filteredMenuItems = menuItems.filter(item => item.visible !== false);

    return (
        <div style={{ minWidth: '240px', backgroundColor: '#081c44', padding: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', fontSize: '5px' }}>
            <Link to="/">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img src={logo} alt="Logo" style={{ width: '50px', height: '50px', padding: '1rem' }} />
                </div>
            </Link>
            <List>
            {filteredMenuItems.map((item, index) => (
                    <ListItem
                        key={index}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => item.action ? item.action() : handleClick(item.path)}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} sx={{ color: 'white' }} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default Menu;
