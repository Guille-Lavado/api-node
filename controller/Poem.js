import { PoemModel } from "../models/poem-local.js";
import { validatePoem, validatePartialPoem } from '../schema/poems.js';

new PoemModel();

export class PoemController {
    static async getAll (req, res) {
        const { writer } = req.query;
        const poems = await PoemModel.getAll({ writer });
        res.json(poems);
    }

    static async getById (req, res) {
        const { id } = req.params;
        const poem = await PoemModel.getById({ id });
        if (poem) return res.json(poem);
        res.status(404).json({ message: 'Poem not Found' });
    }

    static async create (req, res) {
        const result = validatePoem(req.body);
        
        if (result.error) {
            return res.status(400).json({
                error: JSON.parse(result.error.message)
            });
        }

        const newPoem = await PoemModel.create(result.data);
        
        if (!newPoem.ok) {
            console.log(newPoem.error);
            res.status(500).json({ message: 'Error to save poem' });
        } 

        res.status(201).json(newPoem.data);
    }

    static async update (req, res) {
        const result = validatePartialPoem(req.body);
        
        if (result.error) {
            return res.status(400).json({
                error: JSON.parse(result.error.message)
            });
        }

        const { id } = req.params;
        const updatePoem = await PoemModel.update({ id, data: result.data });

        if (!updatePoem.ok) {
            console.log(updatePoem.error);
            res.status(500).json({ message: 'Error to save poem' });
        }

        if (!updatePoem.data) {
            return res.status(404).json({ message: 'Poem not Found' });
        }

        res.status(201).json(updatePoem.data);
    }

    static async delete (req, res) {
        const { id } = req.params;
        const poemIndex = await PoemModel.delete({ id });

        if (!poemIndex.ok) {
            console.log(poemIndex.error);
            res.status(500).json({ message: 'Error to save poem' });
        }

        if (!poemIndex.data) {
            return res.status(404).json({ message: 'Poem not Found' });
        }

        res.json({ message: 'Poem deleted' });
    }
}