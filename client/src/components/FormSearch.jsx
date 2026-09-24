import { useState } from 'react';

export const FormSearch = ({ handleSearchPoem }) => {
  const [formData, setFormData] = useState({
    poem: '',
    writer: '',
    year_publication: ''
  });

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

    const url = new URL("http://localhost:1234/poems");
    url.searchParams.append("writer", formData.writer);

		fetch(url)
			.then(res => {
				if (!res.ok) throw new Error('Error al buscar un poema');
				return res.json();
			})
			.then(data => handleSearchPoem(data))
			.catch(error => { console.log(error) });
	};

  return (
		<form className="poemForm" onSubmit={handleSubmit}>
			<div>
				<label htmlFor="inputAutor">Autor</label>
				<input
					type="text"
					id="inputAutor"
					name="writer"
					value={formData.writer}
					onChange={handleChange}
				/>
			</div>
			<button type="submit">Buscar</button>
    </form>
  );
};