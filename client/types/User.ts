import { z } from 'zod';

export const UserZod = z.object({
    id: z.string(),
    username: z.string(),
    fullName: z.string(),
    biography: z.string().optional().default(''),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    exp: z.number(),
    iat: z.number()
});

export type User = (typeof UserZod)['_output'];
