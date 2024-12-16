import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Button, Modal } from "antd";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import "../styles/PerfilPet.css";
import Menu from "../components/Menu";
import Header from "../components/Header";
import { Divider } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MoodIcon from "@mui/icons-material/Mood";
import HistoryIcon from "@mui/icons-material/History";
import PetsIcon from "@mui/icons-material/Pets";
import AuthService from "../services/AuthService";

const PetPerfil = () => {
  const userLoggedIn = AuthService.getCurrentUser();
  const isAdmin = userLoggedIn.tipo == "ADMIN";
  const isCliente = userLoggedIn.tipo == "CLIENTE";
  const isVoluntario = userLoggedIn.tipo == "VOLUNTARIO";

  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [idadeUnidade, setIdadeUnidade] = useState("anos");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/pet/${id}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar os detalhes do pet");
        }
        const data = await response.json();
        setPet(data);
        setFormData(data);

        if (data.idade < 1) {
          setIdadeUnidade("meses");
          setFormData({ ...data, idade: data.idade * 12 }); // Converter anos para meses
        } else {
          setIdadeUnidade("anos");
        }
      } catch (error) {
        console.error("Erro ao buscar os detalhes do pet:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleDeleteConfirmationChange = (e) => {
    const value = e.target.value;
    setDeleteConfirmation(value);
    setIsDeleteEnabled(value === "Quero deletar o pet");
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/pet/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setIsModalVisible(false);
        // Exibir modal de sucesso
        Modal.success({
          title: "Pet deletado com sucesso!",
          content:
            "O pet foi excluído e você será redirecionado para a lista de pets.",
          onOk: () => {
            navigate("/pets");
          },
        });
      } else {
        throw new Error("Falha ao deletar o pet");
      }
    } catch (error) {
      console.error("Erro ao deletar pet:", error);
      // Exibir modal de erro
      Modal.error({
        title: "Erro ao deletar o pet",
        content:
          "Ocorreu um erro ao tentar deletar o pet. Tente novamente mais tarde.",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const goBackToPets = () => {
    navigate('/Pets');
  };

  const handleSave = async () => {
    try {
      // Converte idade para o formato correto
      let idadeParaSalvar = formData.idade;

      // Se a unidade for "meses", converter para anos
      if (idadeUnidade === "meses") {
        idadeParaSalvar = formData.idade / 12;
      }

      const formDataToSend = {
        ...formData,
        peso: parseFloat(formData.peso),
        idade: Math.round(idadeParaSalvar), // Adiciona a unidade ao salvar
      };

      const response = await fetch(`http://localhost:3001/api/pet/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });
      if (!response.ok) {
        throw new Error("Erro ao atualizar o pet");
      }
      const updatedPet = await response.json();
      setPet(updatedPet);
      setFormData(updatedPet);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar as atualizações do pet:", error);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!pet) {
    return <p>Erro ao carregar os detalhes do pet.</p>;
  }

  const handleAdopt = () => {
    const userId = userLoggedIn.id; // Obtém o ID do usuário logado
    const petId = pet.id; // Obtém o ID do pet
    navigate(`/formulario?userId=${userId}&petId=${petId}`);
  };

  return (
    <div style={{ display: "flex" }}>
      <Menu />
      <div
        style={{
          flex: 1,
          padding: "1rem",
          overflow: "inherit",
        }}>
          
        <div style={{ display: "flex", alignItems: "center" }}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            size="1x"
            onClick={goBackToPets}
            style={{ cursor: "pointer", marginRight: "8px" }}
          />
          <Header headerName="Pets" />
        </div>


        <div className="image-container">
          <img
            width={500}
            src={`http://localhost:3001/${formData.img.replace(/\\/g, "/")}`}
            alt={formData.nome}
          />
        </div>

        <div className="dog-card">
          <div>
            {isEditing ? (
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
              />
            ) : (
              <h2 style={{ margin: "0" }}>{pet.nome}</h2>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "0.5rem",
              }}
            >
              {/* Raça sempre visível */}
              <p style={{ margin: "0", marginRight: "1rem" }}>
                {formData.raca}
              </p>

              {/* Edição da idade */}
              {isEditing ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="number"
                    name="idade"
                    value={formData.idade}
                    onChange={handleInputChange}
                    style={{ width: "4rem", marginRight: "0.5rem" }}
                  />
                  <select
                    value={idadeUnidade}
                    onChange={(e) => setIdadeUnidade(e.target.value)}
                  >
                    <option value="anos">Anos</option>
                    <option value="meses">Meses</option>
                  </select>
                </div>
              ) : (
                <p style={{ margin: "0" }}>{`${pet.idade} ${idadeUnidade}`}</p>
              )}
            </div>

          </div>

          <div className="icon-style">
            <span>{formData.sexo === "fêmea" ? "♀" : "♂"}</span>
          </div>
        </div>
        {(isCliente || isVoluntario) && (
          <div className="button-containerr">
            <Button className="buttonAdotar" type="primary" onClick={handleAdopt}>
              Adotar
            </Button>
          </div>
        )}

        {isAdmin && (
          <div className="edit-button-container">
            {isEditing ? (
              <Button onClick={handleSave} className="custom-button" >
                Salvar
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="custom-button" >
                Editar
              </Button>
            )}
          </div>
        )}



        <div className="info-section">
          <div className="section">
            <h2 className="section-title">
              <PetsIcon style={{ margin: "1rem" }} /> Sobre
            </h2>
            <div className="info-box">
              <div className="info-item">
                <strong>Peso</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="peso"
                    value={formData.peso}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="info-value">{pet.peso} kg</p>
                )}
              </div>
              <div className="info-item">
                <strong>Raça</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="raca"
                    value={formData.raca}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="info-value">{pet.raca}</p>
                )}
              </div>
              <div className="info-item">
                <strong>Cor</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="cor"
                    value={formData.cor}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="info-value">{pet.cor}</p>
                )}
              </div>
              <div className="info-item">
                <strong>Deficiência</strong>
                {isEditing ? (
                  <select
                    name="deficiencia"
                    value={formData.deficiencia}
                    onChange={handleInputChange}
                  >
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                ) : (
                  <p className="info-value">
                    {pet.deficiencia === "sim" ? "Sim" : "Não"}
                  </p>
                )}
              </div>
              <div className="info-item">
                <strong>Porte</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="porte"
                    value={formData.porte}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="info-value">{pet.porte}</p>
                )}
              </div>
              <div className="info-item">
                <strong>Espécie</strong>
                {isEditing ? (
                  <select
                    name="especie"
                    value={formData.especie}
                    onChange={handleInputChange}
                  >
                    <option value="canino">Canino</option>
                    <option value="felino">Felino</option>
                  </select>
                ) : (
                  <p className="info-value">{pet.especie}</p>
                )}
              </div>
              <div className="info-item">
                <strong>Protetor</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="protetor"
                    value={formData.protetor}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="info-value">{pet.protetor}</p>
                )}
              </div>
              <div className="info-item">
                <strong>Resgate</strong>
                {isEditing ? (
                  <input
                    type="date"
                    name="dataResgate"
                    value={formData.dataResgate?.slice(0, 10)}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="info-value">
                    {pet.dataResgate
                      ? new Date(pet.dataResgate).toLocaleDateString("pt-BR")
                      : "não possui."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Seção de Deficiência */}
          {pet.deficiencia === "sim" && (
            <div className="section">
              <h2 className="section-title">
                <MoodIcon style={{ margin: "1rem" }} /> Descrição da
                Deficiência/Doença
              </h2>
              {isEditing ? (
                <textarea
                  name="descricaoDeficiencia"
                  value={formData.descricaoDeficiencia || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="section-text">
                  {pet.descricaoDeficiencia || "Nenhuma descrição disponível."}
                </p>
              )}
            </div>
          )}

          <div className="section">
            <h2 className="section-title">
              <MoodIcon style={{ margin: "1rem" }} /> Comportamento
            </h2>
            {isEditing ? (
              <textarea
                name="comportamento"
                value={formData.comportamento || ""}
                onChange={handleInputChange}
              />
            ) : (
              <p className="section-text">
                {pet.comportamento || "Nenhum comportamento registrado."}
              </p>
            )}
          </div>
          <div className="section">
            <h2 className="section-title">
              <HistoryIcon style={{ margin: "1rem" }} /> Histórico
            </h2>
            {isEditing ? (
              <textarea
                name="historico"
                value={formData.historico || ""}
                onChange={handleInputChange}
              />
            ) : (
              <p className="section-text">
                {pet.historico || "Nenhum histórico registrado."}
              </p>
            )}
          </div>
          <div className="section">
            <h2 className="section-title">
              <HistoryIcon style={{ margin: "1rem" }} /> Exame Clínico
            </h2>
            {isEditing ? (
              <textarea
                name="exameClinico"
                value={formData.exameClinico || ""}
                onChange={handleInputChange}
              />
            ) : (
              <p className="section-text">
                {pet.exameClinico || "Sem exame clínico registrado."}
              </p>
            )}
          </div>

          <div className="section">
            <h2 className="section-title">
              <HistoryIcon style={{ margin: "1rem" }} /> Conclusões
            </h2>
            {isEditing ? (
              <textarea
                name="conclusoes"
                value={formData.conclusoes || ""}
                onChange={handleInputChange}
              />
            ) : (
              <p className="section-text">
                {pet.conclusoes || "Nenhuma conclusão registrada."}
              </p>
            )}
          </div>
        </div>
        <div></div>

        {isAdmin && (
          <div className="botaoDelete">
            <Button
              className="botaoDeletar"
              onClick={() => setIsModalVisible(true)}
            >
              Deletar Pet
            </Button>
          </div>
        )}

        <Modal
          visible={isModalVisible}
          onOk={handleConfirmDelete}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          bodyStyle={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '16px', // Espaço adicional no topo
          }}
          closeIcon={null}  // Removemos o ícone padrão do Ant Design
        >
          {/* Ícone de fechar personalizado */}
          <span
            style={{
              position: 'absolute',
              top: '9px',
              right: '16px',
              fontSize: '20px',
              cursor: 'pointer',
            }}
            onClick={() => setIsModalVisible(false)}
          >
            ✖
          </span>

          {/* Título centralizado */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <h2>Confirmação de Deleção</h2>
          </div>

          <p style={{ textAlign: 'center', marginBottom: '12px' }}>
            Para confirmar a exclusão do pet, digite: <strong>Quero deletar o pet</strong>
          </p>

          <Input
            value={deleteConfirmation}
            onChange={handleDeleteConfirmationChange}
            placeholder="Digite aqui..."
            style={{ width: '100%', maxWidth: '300px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
            <Button
              style={{ backgroundColor: '#04448B', borderColor: '#04448B', color: 'white', width: '140px' }}
              onClick={() => setIsModalVisible(false)}
            >
              Cancelar
            </Button>

            <Button
              type="primary"
              danger
              onClick={handleConfirmDelete}
              disabled={!isDeleteEnabled}
              style={{
                backgroundColor: isDeleteEnabled ? '#8b0404' : '#d9d9d9',
                width: '12vw',
              }}
            >
              Confirmar Deleção
            </Button>
          </div>
        </Modal>




      </div>
    </div>
  );
};

export default PetPerfil;
