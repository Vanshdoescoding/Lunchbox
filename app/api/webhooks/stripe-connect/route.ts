import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = constructWebhookEvent(
      body,
      signature,
      process.env.STRIPE_CONNECT_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Connect webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  try {
    switch (event.type) {
      case 'account.updated': {
        const account = event.data.object as Stripe.Account
        const cookId = account.metadata?.cookId

        if (!cookId) break

        const chargesEnabled = account.charges_enabled
        const detailsSubmitted = account.details_submitted

        await supabase
          .from('cooks')
          .update({
            stripe_onboarding_complete: chargesEnabled && detailsSubmitted,
          })
          .eq('id', cookId)

        break
      }

      case 'payout.paid': {
        const payout = event.data.object as Stripe.Payout

        await supabase
          .from('payouts')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString(),
          })
          .eq('stripe_transfer_id', payout.id)

        break
      }

      case 'payout.failed': {
        const payout = event.data.object as Stripe.Payout

        await supabase
          .from('payouts')
          .update({ status: 'failed' })
          .eq('stripe_transfer_id', payout.id)

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Connect webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
