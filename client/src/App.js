import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [poems, setPoems] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  useEffect(() => {
    fetch('http://localhost:1234/poems')
      .then(res => res.json())
      .then(poems => {
        setPoems(poems);
        setCargando(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const deletePoem = (e) => {
    const article = e.target.closest('article')
    const id = article.dataset.id;

    fetch(`http://localhost:1234/poems/${id}`, {
      method: 'DELETE'
    })
      .then(res => { if (res.ok) article.remove() });
  };

  if (cargando) return <p>Cargando datos...</p>;

  return (
    <>
      {poems.map(poem => (
        <article key={poem.id} data-id={poem.id}>
          <h2>{poem.writer}</h2>
          <p style={{ whiteSpace: 'pre-line' }}>{poem.poem}</p>
          <small>-- {poem.year_publication} --</small>
          <button className="deleteBtn" onClick={deletePoem} >Eliminar</button>
        </article>
      ))}
    </>
  );
}

export default App;
