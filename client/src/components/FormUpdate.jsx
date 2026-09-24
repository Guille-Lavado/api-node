import { useState } from "react";

export const FormUpdate = ({ poem, onCancel, onUpdateSuccess }) => {
  // Inicializamos el formulario con los datos actuales del poema
  const [formData, setFormData] = useState({
    writer: poem.writer,
    poem: poem.poem,
    year_publication: poem.year_publication
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedBody = {
      writer: formData.writer,
      poem: formData.poem,
      year_publication: parseInt(formData.year_publication)
    };

    fetch(`http://localhost:1234/poems/${poem.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedBody)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al actualizar un poema');
        return res.json();
      })
      .then(data => onUpdateSuccess({
        poem: data.poem,
        writer: data.writer,
        year_publication: data.year_publication
      }))
      .catch(error => console.error(error));
  };

  return (
    <form className="poemForm" onSubmit={handleSubmit}>
      <div>
        <label htmlFor={`inputAutor-${poem.id}`}>Autor</label>
        <input
          type="text"
          id={`inputAutor-${poem.id}`}
          name="writer"
          value={formData.writer}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor={`inputPoem-${poem.id}`}>Poema</label>
        <textarea
          id={`inputPoem-${poem.id}`}
          name="poem"
          value={formData.poem}
          onChange={handleChange}
        ></textarea>
      </div>
      <div>
        <label htmlFor={`inputFecha-${poem.id}`}>Año</label>
        <input
          type="number"
          id={`inputFecha-${poem.id}`}
          name="year_publication"
          value={formData.year_publication}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Guardar</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};