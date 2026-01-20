import { PaymentRepository } from '@/lib/repositories/payment-repository'
import { OrderRepository } from '@/lib/repositories/order-repository'
import { ExternalServiceError } from '@/lib/errors/app-error'

export class PaymentService {
  constructor(
    private paymentRepo: PaymentRepository,
    private orderRepo: OrderRepository
  ) {}

  async handleCheckoutCompleted(params: {
    sessionId: string
    paymentIntentId: string
    orderId?: string
  }) {
    try {
      // Update payment status
      await this.paymentRepo.updatePaymentStatus({
        stripePaymentIntentId: params.paymentIntentId,
        status: 'succeeded',
        stripeCheckoutSessionId: params.sessionId,
      })

      // Update order if orderId exists
      if (params.orderId) {
        await this.orderRepo.updateOrderStatus(params.orderId, 'pending')
      }
    } catch (error) {
      throw new ExternalServiceError('Database', error)
    }
  }

  async handlePaymentSucceeded(paymentIntentId: string) {
    try {
      await this.paymentRepo.updatePaymentStatus({
        stripePaymentIntentId: paymentIntentId,
        status: 'succeeded',
      })
    } catch (error) {
      throw new ExternalServiceError('Database', error)
    }
  }

  async handleChargeRefunded(params: { paymentIntentId: string; refundAmount: number }) {
    try {
      await this.paymentRepo.updatePaymentStatus({
        stripePaymentIntentId: params.paymentIntentId,
        status: 'refunded',
        refundAmountCents: params.refundAmount,
      })
    } catch (error) {
      throw new ExternalServiceError('Database', error)
    }
  }
}
