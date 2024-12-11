import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Edit";
import "../styles/Tarefas.css";

const Card = ({ tarefa, index, onDelete, onUpdate }) => {
  return (
    <Draggable draggableId={tarefa.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="card"
        >
          <div className="card-content">
            <div className="card-actions">
              <h4>{tarefa.titulo}</h4>
              <div className="g-edit-delet">
                <button
                  className="update-btn"
                  onClick={() => onUpdate(tarefa.id)}
                  aria-label={`Update ${tarefa.titulo}`}
                >
                  <UpdateIcon />
                </button>

                <button
                  className="delete-btn"
                  onClick={() => onDelete(tarefa)}
                  aria-label={`Delete ${tarefa.titulo}`}
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>

            <p style={{fontSize: "0.9rem"}}>{tarefa.descricao}</p>

            <div className="inferior">
              <div className="voluntarios-list">
                <h5>Voluntários Designados:</h5>
                {
                  <ul>
                    {(tarefa.usuario_tarefa || []).map((usuarioTarefa) => (
                      <li key={usuarioTarefa.usuario.id}>
                        {usuarioTarefa.usuario.nome}
                      </li>
                    ))}
                  </ul>
                }
              </div>
              <p className="data-criada">
                {new Date(tarefa.dataCriada).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
