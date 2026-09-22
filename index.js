import express from 'express';
import { corsMiddleware } from './middlewares/cors.js'
import { poemsRouter } from './routes/poems.js'

const app = express()
const PORT = process.env.PORT ?? 1234;

app.disable('x-powered-by');    // Eliminamos x-powered-by de los headers
app.use(express.json());        // Middleware para parsear el cuerpo de peticiones JSON automáticamente
app.use(corsMiddleware);        // Middelware para políticas de CORS

// --- Rutas ---
app.get('/', (req, res) => {
    res.status(200).send('<h1>Hola Mundo</h1>')
});

// --- Rutas API ---
app.use('/poems', poemsRouter);

// Ruta default, la última que va ha mirar express
// Se coloca siempre al final
app.use((req, res) => {
    res.status(404).send('<h1>404</h1>');
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});