import { z } from 'zod';

export const StatusResponseZod = z.object({
  success: z.boolean(),
  message: z.string()
});

export const LoginResponseZod = z.object({
  refreshToken: z.string().optional().default(''),
  accessToken: z.string().optional().default(''),
  status: StatusResponseZod
});

export type LoginResponse = (typeof LoginResponseZod)['_output'];
