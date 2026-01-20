import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/server'
import { PaymentService } from '@/lib/services/payment-service'
import { PaymentRepository } from '@/lib/repositories/payment-repository'
import { OrderRepository } from '@/lib/repositories/order-repository'
import { handleError } from '@/lib/errors/error-handler'
import { getCorrelationId, setCorrelationIdHeader } from '@/lib/middleware/correlation-id'
import { checkRateLimit } from '@/lib/middleware/rate-limit'
import { ValidationError } from '@/lib/errors/app-error'
import { env } from '@/lib/config/env'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const correlationId = getCorrelationId(req)

  try {
    // Rate limiting for webhook endpoint
    await checkRateLimit(req, { limit: 100, window: '1 m' })

    // Validate signature header
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new ValidationError('Missing stripe-signature header')
    }

    // Verify webhook signature
    const body = await req.text()
    let event: Stripe.Event

    try {
      event = constructWebhookEvent(body, signature, env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
      console.error('[Webhook] Signature verification failed', { correlationId })
      throw new ValidationError('Invalid webhook signature')
    }

    // Initialize repositories and service
    const supabase = await createAdminClient()
    const paymentRepo = new PaymentRepository(supabase)
    const orderRepo = new OrderRepository(supabase)
    const paymentService = new PaymentService(paymentRepo, orderRepo)

    // Handle webhook events
    console.log('[Webhook] Processing event', {
      correlationId,
      type: event.type,
      id: event.id,
    })

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await paymentService.handleCheckoutCompleted({
          sessionId: session.id,
          paymentIntentId: session.payment_intent as string,
          orderId: session.metadata?.orderId,
        })
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await paymentService.handlePaymentSucceeded(paymentIntent.id)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        await paymentService.handleChargeRefunded({
          paymentIntentId: charge.payment_intent as string,
          refundAmount: charge.amount_refunded,
        })
        break
      }

      default:
        console.log('[Webhook] Unhandled event type', { correlationId, type: event.type })
    }

    const response = NextResponse.json({ received: true })
    setCorrelationIdHeader(response.headers, correlationId)
    return response
  } catch (error) {
    return handleError(error, correlationId)
  }
}
