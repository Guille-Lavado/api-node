import { useState } from "react";

export const FormCreate = ({ handleNewPoem }) => {
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

		const createBody = {
			writer: formData.writer,
			poem: formData.poem,
			year_publication: parseInt(formData.year_publication)
		}

		fetch(`http://localhost:1234/poems`, {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(createBody)
		})
			.then(res => {
				if (!res.ok) throw new Error('Error al crear un nuevo poema');
				return res.json();
			})
			.then(data => handleNewPoem({
				id: data.id,
				poem: data.poem,
				writer: data.writer,
				year_publication: data.year_publication
			}))
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
			<div>
				<label htmlFor="inputPoem">Poema</label>
				<textarea
					id="inputPoem"
					name="poem"
					value={formData.poem}
					onChange={handleChange}
				></textarea>
			</div>
			<div>
				<label htmlFor="inputFecha">Año</label>
				<input
					type="number"
					id="inputFecha"
					name="year_publication"
					value={formData.year_publication}
					onChange={handleChange}
				/>
			</div>
			<button type="submit">Enviar</button>
		</form>
	);
};