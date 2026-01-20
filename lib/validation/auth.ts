import { z } from 'zod'
import { emailSchema, phoneSchema, sanitizedStringSchema } from './common'

export const signUpSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(100),
  name: sanitizedStringSchema(2, 100),
  phone: phoneSchema,
  role: z.enum(['customer', 'cook']).default('customer'),
})

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
})

export const resetPasswordSchema = z.object({
  email: emailSchema,
})

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
