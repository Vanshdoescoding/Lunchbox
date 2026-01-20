import { z } from 'zod'

export const stripeWebhookHeadersSchema = z.object({
  'stripe-signature': z.string().min(1),
})

export const webhookMetadataSchema = z.object({
  orderId: z.string().uuid().optional(),
  cookId: z.string().uuid().optional(),
})
