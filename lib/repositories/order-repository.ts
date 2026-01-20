import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/database.types'

type OrderStatus = Database['public']['Enums']['order_status']

export class OrderRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getOrderById(orderId: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error) throw error
    return data
  }
}
