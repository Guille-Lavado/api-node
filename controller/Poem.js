import { PoemModel } from "../models/poem-mongodb.js";
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
        
        try {
            const newPoem = await PoemModel.create(result.data);
            res.status(201).json(newPoem);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error to save poem' });
        }
    }

    static async update (req, res) {
        const result = validatePartialPoem(req.body);

        if (result.error) {
            return res.status(400).json({
                error: JSON.parse(result.error.message)
            });
        }

        try {
            const { id } = req.params;
            const updatePoem = await PoemModel.update({ id, data: result.data });

            if (!updatePoem.ok) {
                return res.status(404).json({ message: 'Poem not Found' });
            }

            res.status(201).json(updatePoem.poem);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error to save poem' });
        }
    }

    static async delete (req, res) {
        try {
            const { id } = req.params;
            const poemIndex = await PoemModel.delete({ id });

            if (!poemIndex) {
                return res.status(404).json({ message: 'Poem not Found' });
            }

            res.json({ message: 'Poem deleted' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error to save poem' });
        }
    }
}