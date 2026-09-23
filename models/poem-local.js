import fs from 'node:fs';
import crypto from 'node:crypto';

const url_poems = new URL('../poems.json', import.meta.url);
const poems = JSON.parse(fs.readFileSync(url_poems, 'utf-8'));

export class PoemModel {
    static async getAll ({ writer }) {
        if (writer) {
            return poems.filter(
                poem => poem.writer.toLowerCase().includes(writer.toLowerCase())
            );
        }
        return poems;
    }

    static async getById ({ id }) {
        return poems.find(poem => poem.id === id);
    }

    static async create (data) {
        try {
            const newPoem = {
                id: crypto.randomUUID(), // uuid v4
                ...data
            };

            // Modificar el array en memoria
            poems.push(newPoem);

            // Guardar el array actualizado en el archivo físico
            fs.writeFileSync(url_poems, JSON.stringify(poems, null, 2));

            return { ok: true, data: newPoem };
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async update ({ id, data }) {
        try {
            const poemIndex = poems.findIndex(poem => poem.id === id);
            if (poemIndex === -1) return { ok: true, data: false };

            const updatePoem = {
                ...poems[poemIndex],
                ...data
            };

            poems[poemIndex] = updatePoem;
            fs.writeFileSync(url_poems, JSON.stringify(poems, null, 2));

            return { ok: true, data: updatePoem };
        } catch (error) {
            return { ok: false, error };
        }

    }

    static async delete ({ id }) {
        try {
            const poemIndex = poems.findIndex(poem => poem.id === id);
            if (poemIndex === -1) return { ok: true, data: false };

            poems.splice(poemIndex, 1);
            fs.writeFileSync(url_poems, JSON.stringify(poems, null, 2));

            return { ok: true, data: true };
        } catch (error) {
            return { ok: false, error };
        }
    }
}