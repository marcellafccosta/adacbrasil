import Menu from '../components/Menu';
import Header from '../components/Header';
import VolunteerComponent from '../components/VolunteerComponent';
import SearchBar from '../components/SearchComponent';
import { useState } from 'react';
import '../styles/Voluntarios.css';
import { Divider } from "@mui/material";

const Voluntarios = () => {
    const [searchText, setSearchText] = useState('');

    const handleSearch = (text) => {
        setSearchText(text);
    };
    return (
        <div className="dashboard-container" style={{ display: "flex" }}>
            <Menu />
            <div className="volunteer-content" style={{ height: '100vh', flex: 1, padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <Header headerName={'Voluntários'} />
                    <SearchBar onSearch={handleSearch} style={{ flexGrow: 1, marginLeft: "20px" }} />
                </div>
                <Divider />
                <VolunteerComponent searchText={searchText} />
            </div>
        </div>
    );
}    


/*
 <div style={{ display: "flex" }}>
            <Menu />
            <div style={{ flex: 1, padding: "1rem" }}>
                <div style={{ display: "flex" }}>
                    <Header headerName={'Patrocínios'} />

                    <Button className="patrocinio-botao" type="primary" onClick={() => handleOpenModal()}>
                        Novo Patrocínio
                    </Button>
                </div>
                <Divider />

*/

export default Voluntarios;
