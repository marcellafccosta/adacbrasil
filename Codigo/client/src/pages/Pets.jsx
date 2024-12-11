import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import { useNavigate } from 'react-router-dom';
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Avatar, Card, Pagination, Button } from "antd"; // mantivemos apenas o que você precisa do Ant Design
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Menu from "../components/Menu";
import Header from '../components/Header';
import { Divider } from "@mui/material";
import AuthService from "../services/AuthService";
import "../styles/Pets.css";


const Pets = () => {
  const userLoggedIn = AuthService.getCurrentUser();
  const isAdmin = userLoggedIn.tipo === "ADMIN";
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [speciesFilter, setSpeciesFilter] = useState("");
  const petsPerPage = 15;

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/pet");
        if (!response.ok) {
          throw new Error("Erro ao buscar os pets");
        }
        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.error("Erro ao buscar os pets:", error);
      }
    };

    fetchPets();
  }, []);

  const filteredPets = speciesFilter
    ? pets.filter((pet) => pet.especie === speciesFilter)
    : pets;

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleSpeciesChange = (event) => {
    setSpeciesFilter(event.target.value);
    setCurrentPage(1);
  };

  const goToCadastro = () => {
    navigate(`/CadastroPet`)
  }

  return (
    <div style={{ display: "flex" }}>
      <Menu />
      <div style={{ height: '100vh', flex: 1, padding: "1rem" }}>
        
       <div style={{ display: "flex" }}>
           <Header headerName={'Pets'} />
          {isAdmin && (
            <Button className="pets-botao" type="primary" onClick={goToCadastro}>
              Cadastrar Pet
            </Button>
          )}
       
        </div>
  
        <Divider />

        {/* Filtro por Espécie */}
        <Box display="flex" alignItems="center" mb={2}>
          <FormControl
            variant="outlined"
            style={{ minWidth: 120, marginRight: "16px", marginTop: "16px" }}
          >
            <InputLabel id="species-select-label">Espécie</InputLabel>
            <Select
              labelId="species-select-label"
              value={speciesFilter}
              onChange={handleSpeciesChange}
              label="Espécie"
            >
              <MenuItem value="">
                <em>Todos</em>
              </MenuItem>
              <MenuItem value="canino">Canino</MenuItem>
              <MenuItem value="felino">Felino</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={5}>
          {currentPets.map((pet, index) => {
            return (
              <Grid item xs={12} sm={6} md={2.4} lg={2.4} key={index} style={{ marginBottom: "1vw" }}>
                <Link to={`/PetPerfil/${pet.id}`} style={{ textDecoration: "none" }}>
                  <Card
                    hoverable
                    className="pet-card"
                    cover={
                      <div>
                        <img
                          src={`http://localhost:3000/${pet.img}`}
                          alt={pet.nome}
                          style={{ height: "200px", width: "100%", objectFit: "contain", marginTop: "1vw" }}
                        />
                      </div>
                    }
                    style={{
                      border: "2px solid rgba(128, 128, 128, 0.5)",
                      overflow: 'hidden'
                    }}
                  >
                    <div className="pet-details">
                      <div className="pet-name">
                        <Typography
                          variant="h6"
                          component="h2"
                          style={{ fontWeight: "bold" }}
                        >
                          {pet.nome}
                        </Typography>
                      </div>
                      <div className="pet-info">
                        <span>{`${pet.idade} anos | ${pet.raca}`}</span>
                        {pet.sexo?.toLowerCase().trim() === "femea" ? (
                          <Avatar icon={<FemaleIcon />} className="female-icon" />
                        ) : (
                          <Avatar icon={<MaleIcon />} className="male-icon" />
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              </Grid>
            );
          })}
        </Grid>

        <Box display="flex" justifyContent="center" marginTop={2}>
          <Pagination
            current={currentPage}
            total={filteredPets.length}
            pageSize={petsPerPage}
            onChange={handleChangePage}
            showSizeChanger={false} // Oculta a opção de mudar o número de itens por página
          />
        </Box>
      </div>
    </div>
  );
};

export default Pets;
