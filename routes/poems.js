import { Router } from "express";
import { PoemController } from "../controller/poem.js";

export const poemsRouter = Router();

// --- Rutas del Recurso Poemas de la API ---
poemsRouter.get('/', PoemController.getAll);
poemsRouter.get('/:id', PoemController.getById);
poemsRouter.post('/', PoemController.create);
poemsRouter.patch('/:id', PoemController.update);
poemsRouter.delete('/:id', PoemController.delete);
