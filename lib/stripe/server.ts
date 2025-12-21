import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export async function createCheckoutSession(params: {
  orderId: string
  customerId: string
  amount: number
  customerEmail: string
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: params.customerEmail,
    line_items: [
      {
        price_data: {
          currency: 'aud',
          product_data: {
            name: 'LunchBox Order',
            description: `Order #${params.orderId}`,
          },
          unit_amount: params.amount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      orderId: params.orderId,
      customerId: params.customerId,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/orders/${params.orderId}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/checkout?canceled=true`,
  })

  return session
}

export async function createConnectAccount(params: {
  email: string
  cookId: string
}) {
  const account = await stripe.accounts.create({
    type: 'express',
    email: params.email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    metadata: {
      cookId: params.cookId,
    },
  })

  return account
}

export async function createConnectAccountLink(accountId: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/cook-dashboard/settings`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/cook-dashboard/settings?onboarding=complete`,
    type: 'account_onboarding',
  })

  return accountLink
}

export async function createTransfer(params: {
  amount: number
  destination: string
  orderId: string
}) {
  const transfer = await stripe.transfers.create({
    amount: params.amount,
    currency: 'aud',
    destination: params.destination,
    metadata: {
      orderId: params.orderId,
    },
  })

  return transfer
}

export async function refundPayment(paymentIntentId: string, amount?: number) {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount,
  })

  return refund
}

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  secret: string
) {
  return stripe.webhooks.constructEvent(payload, signature, secret)
}
