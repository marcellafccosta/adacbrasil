import Menu from '../components/Menu';
import CalendarComponent from '../components/CalendarComponent';
import '../styles/Dashboard.css';

const Calendar = () => {
    return (
        <div className="dashboard-container" style={{overflowY: 'hidden !important' }}>
            <Menu />
            <CalendarComponent />
        </div>
    );
};

export default Calendar;
