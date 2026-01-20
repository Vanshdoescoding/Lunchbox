import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/database.types'

export class PaymentRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async updatePaymentStatus(params: {
    stripePaymentIntentId: string
    status: 'succeeded' | 'failed' | 'refunded'
    stripeCheckoutSessionId?: string
    refundAmountCents?: number
  }) {
    const { data, error } = await this.supabase
      .from('payments')
      .update({
        status: params.status,
        ...(params.stripeCheckoutSessionId && {
          stripe_checkout_session_id: params.stripeCheckoutSessionId,
        }),
        ...(params.refundAmountCents !== undefined && {
          refund_amount_cents: params.refundAmountCents,
        }),
      })
      .eq('stripe_payment_intent_id', params.stripePaymentIntentId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getPaymentByIntentId(intentId: string) {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('stripe_payment_intent_id', intentId)
      .single()

    if (error) throw error
    return data
  }
}
