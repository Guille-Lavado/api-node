import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import poems from './poems.json' with { type: "json" };
import { validatePoem, validatePartialPoem } from './schema/poems.js';

const app = express()
const PORT = process.env.PORT ?? 1234;

const ACCEPTED_ORIGINS = [
    'http://localhost:8080'
];

// Eliminamos x-powered-by de los headers
app.disable('x-powered-by');

// Middleware para parsear el cuerpo de peticiones JSON automáticamente
app.use(express.json());

// Middelware para políticas de CORS
// Crear cabeceras para evitar problemas de CORS
app.use((req, res, next) => {
    const origin = req.header('origin');
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        // Permitir que URLs acceden a la web
        res.header('Access-Control-Allow-Origin', origin || '*');
        // Permitir que métodos se pueden usar
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    }

    // Responder inmediatamente a las peticiones Preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// --- Rutas ---
app.get('/', (req, res) => {
    res.status(200).send('<h1>Hola Mundo</h1>')
});

// --- API ---
app.get('/poems', (req, res) => {
    // desestructuración
    const { writer } = req.query;
    if (writer) {
        const filteredPoems = poems.filter(poem => poem.writer.toLowerCase().includes(writer.toLowerCase()));
        return res.json(filteredPoems);
    }
    res.json(poems);
});

app.get('/poems/:id', (req, res) => {
    const { id } = req.params;
    const poem = poems.find(poem => poem.id.toString() === id);
    if (poem) return res.json(poem);

    res.status(404).json({ message: 'Poem not Found' });
});

app.post('/poems', async (req, res) => {
    const result = validatePoem(req.body);

    if (result.error) {
        return res.status(400).json({
            error: JSON.parse(result.error.message)
        });
    }
    
    const newPoem = {
        id: crypto.randomUUID(), // uuid v4
        ...result.data
    };

    // Modificar el array en memoria
    poems.push(newPoem);

    // Guardar el array actualizado en el archivo físico
    try {
        await fs.writeFile(
            new URL('./poems.json', import.meta.url), 
            JSON.stringify(poems, null, 2)
        );
        res.status(201).json(newPoem);
    } catch (error) {
        res.status(500).json({ message: 'Error to save poem' });
    }

    res.status(201).json(newPoem);
});

app.patch('/poems/:id', async (req, res) => {
    const result = validatePartialPoem(req.body);

    if (result.error) {
        return res.status(400).json({
            error: JSON.parse(result.error.message)
        });
    }

    const { id } = req.params;
    const poemIndex = poems.findIndex(poem => poem.id.toString() === id);

    if (poemIndex === -1) {
        return res.status(404).json({ message: 'Poem not Found' });
    }

    const updatePoem = {
        ...poems[poemIndex],
        ...result.data
    };

    poems[poemIndex] = updatePoem;

    try {
        await fs.writeFile(
            new URL('./poems.json', import.meta.url), 
            JSON.stringify(poems, null, 2)
        );
        res.status(201).json(updatePoem);
    } catch (error) {
        res.status(500).json({ message: 'Error to save poem' });
    }
});

app.delete('/poems/:id', async (req, res) => {
    const { id } = req.params;
    const poemIndex = poems.findIndex(poem => poem.id.toString() === id);

    if (poemIndex === -1) {
        return res.status(404).json({ message: 'Poem not Found' });
    }

    poems.splice(poemIndex, 1);

    try {
        await fs.writeFile(
            new URL('./poems.json', import.meta.url), 
            JSON.stringify(poems, null, 2)
        );
        res.json({ message: 'Poem deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error to save poem' });
    }
});

// Ruta default, la última que va ha mirar express
// Se coloca siempre al final
app.use((req, res) => {
    res.status(404).send('<h1>404</h1>');
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});