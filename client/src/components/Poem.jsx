import { useState } from "react";
import { FormUpdate } from "./FormUpdate.jsx";

export const Poem = ({ id, poem: initialPoem, writer: initialWriter, year_publication: initialYear }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPoem, setCurrentPoem] = useState({
    id,
    poem: initialPoem,
    writer: initialWriter,
    year_publication: initialYear
  });

  const handleUpdateSuccess = (updatedPoem) => {
    setCurrentPoem((prev) => ({ ...prev, ...updatedPoem }));
    setIsEditing(false);
  };

  const deletePoem = (e) => {
    const article = e.target.closest('article')

    fetch(`http://localhost:1234/poems/${id}`, {
      method: 'DELETE'
    })
      .then(res => { if (res.ok) article.remove() });
  };

  // Muestra el formulario si está en modo edición
  if (isEditing) {
    return (
      <FormUpdate
        poem={currentPoem}
        onCancel={() => setIsEditing(false)}
        onUpdateSuccess={handleUpdateSuccess}
      />
    );
  }

  // Muestra el article por defecto
  return (
    <article key={id} data-id={id}>
      <h2>{currentPoem.writer}</h2>
      <p>
        {currentPoem.poem}<br />
        <small>-- {currentPoem.year_publication} --</small>
      </p>
      <button className="editBtn" onClick={() => setIsEditing(true)}>Actualizar</button>
      <button className="deleteBtn" onClick={deletePoem} >Eliminar</button>
    </article>
  );
};