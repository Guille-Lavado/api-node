import { useEffect, useState } from 'react';
import './App.css';
import { FormCreate } from './components/FormCreate.jsx';
import { FormSearch } from './components/FormSearch.jsx';
import { Poem } from './components/Poem.jsx';

function App() {
  const [poems, setPoems] = useState([]);
  const [filteredPoems, setFilteredPoems] = useState([]);
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

  useEffect(() => {}, [filteredPoems])

  if (cargando) return <p>Cargando datos...</p>;

  return (
    <main>
      <section id="poemList">
        { filteredPoems.length === 0
          ? poems.map(poem => <Poem {...poem} />)
          : filteredPoems.map(poem => <Poem {...poem} />) }
      </section>
      <section id='formSection'>
        <h2>Crear Nuevo Poema</h2>
        <FormCreate handleNewPoem={(poem) => setPoems([...poems, poem])} />
        <h2>Buscar Poemas</h2>
        <FormSearch handleSearchPoem={setFilteredPoems}/>
      </section>
    </main>
  );
}

export default App;
