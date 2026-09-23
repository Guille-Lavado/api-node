import crypto from "node:crypto";
import mongoose from "mongoose";

const poemSchemaDB = mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomUUID(),
    },
    poem: {
        type: String,
        required: true,
    },
    writer:  {
        type: String,
        required: true,
    },
    year_publication:  {
        type: Number,
        required: true,
    }
});

const poemModel = mongoose.model('Poem', poemSchemaDB);

export class PoemModel {
    constructor() {
        this.connectDB();
    }

    async connectDB () {
        await mongoose.connect(process.env.MONGODB_URI).then(
            () => {
                console.info(`Connected to database`)
            },
            error => {
                console.error(`Connection error: ${error.stack}`)
                process.exit(1)
            }
        );
    };

    static async getAll ({ writer }) {
        if (writer) {
            return poemModel.find({ writer: { $regex: writer, $options: 'i' } });
        }
        return poemModel.find();
    }

    static async getById ({ id }) {
        return await poemModel.findById(id).exec();
    }

    static async create (data) {
        try {
            const newPoem = new poemModel(data);
            await newPoem.save();
            return { ok: true, data: newPoem };
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async update ({ id, data }) {
        try {
            const updatedPoem = await poemModel.findByIdAndUpdate(id, data, { new: true });
            if (!updatedPoem) return { ok: true, data: false };
            return { ok: true, data: updatedPoem };
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async delete ({ id }) {
        try {
            const result = await poemModel.findByIdAndDelete(id);
            if (!result) return { ok: true, data: false };
            return { ok: true, data: true };
        } catch (error) {
            return { ok: false, error };
        }
    }
}