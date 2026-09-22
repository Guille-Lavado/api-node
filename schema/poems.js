import z from 'zod';

const poemSchema = z.object({
    poem: z.string(),
    writer: z.string(),
    year_publication: z.number().int().positive()
});

export function validatePoem(object) {
    return poemSchema.safeParse(object);
}

export function validatePartialPoem(object) {
    return poemSchema.partial().safeParse(object);
}
