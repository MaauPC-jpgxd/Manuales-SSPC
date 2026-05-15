import { z } from 'zod'

import { UserRole } from '@/types/roles'

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, 'Nombre demasiado corto'),

  email: z
    .string()
    .email('Correo inválido'),

  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres'),

  confirmPassword: z.string(),

  role: z.enum([
    UserRole.ROOT,
    UserRole.ADMIN,
    UserRole.LECTOR,
  ]),
})
.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  }
)

export type RegisterSchema =
  z.infer<typeof registerSchema>