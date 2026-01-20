import { z } from 'zod'

// Common validation primitives
export const emailSchema = z.string().email().toLowerCase().trim()

export const uuidSchema = z.string().uuid()

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional()

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const idParamSchema = z.object({
  id: uuidSchema,
})

export const slugSchema = z
  .string()
  .min(3)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')

// Sanitize string input
export const sanitizedStringSchema = (min = 1, max = 255) =>
  z
    .string()
    .min(min)
    .max(max)
    .trim()
    .transform((val) => val.replace(/[<>]/g, '')) // Basic XSS prevention

// Money amount in cents
export const moneySchema = z.coerce.number().int().nonnegative()

// Coordinates
export const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})
