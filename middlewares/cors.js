import { request, response } from "express";

const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:3000'
];

// Crear cabeceras para evitar problemas de CORS
export const corsMiddleware = (req=request, res=response, next) => {
    const origin = req.header('origin');
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        // Permitir que URLs acceden a la web
        res.header('Access-Control-Allow-Origin', origin || '*');
        // Permitir que métodos se pueden usar
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        // Permitir la cabecera Content-Type
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    // Responder inmediatamente a las peticiones Preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
};