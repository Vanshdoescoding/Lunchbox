export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'customer' | 'cook' | 'admin'
          email: string
          phone: string | null
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: 'customer' | 'cook' | 'admin'
          email: string
          phone?: string | null
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'customer' | 'cook' | 'admin'
          email?: string
          phone?: string | null
          name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cooks: {
        Row: {
          id: string
          user_id: string
          slug: string
          bio: string
          story: string
          cuisine_tags: string[]
          status: 'draft' | 'pending_approval' | 'approved' | 'suspended'
          identity_verified: boolean
          certificate_verified: boolean
          kitchen_verified: boolean
          stripe_account_id: string | null
          stripe_onboarding_complete: boolean
          rating_avg: number
          rating_count: number
          delivery_radius_km: number
          pickup_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slug: string
          bio: string
          story?: string
          cuisine_tags?: string[]
          status?: 'draft' | 'pending_approval' | 'approved' | 'suspended'
          identity_verified?: boolean
          certificate_verified?: boolean
          kitchen_verified?: boolean
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean
          rating_avg?: number
          rating_count?: number
          delivery_radius_km?: number
          pickup_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          slug?: string
          bio?: string
          story?: string
          cuisine_tags?: string[]
          status?: 'draft' | 'pending_approval' | 'approved' | 'suspended'
          identity_verified?: boolean
          certificate_verified?: boolean
          kitchen_verified?: boolean
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean
          rating_avg?: number
          rating_count?: number
          delivery_radius_km?: number
          pickup_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cook_documents: {
        Row: {
          id: string
          cook_id: string
          type: 'identity' | 'food_safety_certificate' | 'insurance' | 'other'
          status: 'pending' | 'approved' | 'rejected'
          file_url: string
          file_name: string
          expiry_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cook_id: string
          type: 'identity' | 'food_safety_certificate' | 'insurance' | 'other'
          status?: 'pending' | 'approved' | 'rejected'
          file_url: string
          file_name: string
          expiry_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cook_id?: string
          type?: 'identity' | 'food_safety_certificate' | 'insurance' | 'other'
          status?: 'pending' | 'approved' | 'rejected'
          file_url?: string
          file_name?: string
          expiry_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      kitchens: {
        Row: {
          id: string
          cook_id: string
          type: 'home' | 'partner'
          address: string
          address_line2: string | null
          city: string
          state: string
          postcode: string
          latitude: number
          longitude: number
          verified: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cook_id: string
          type: 'home' | 'partner'
          address: string
          address_line2?: string | null
          city: string
          state: string
          postcode: string
          latitude: number
          longitude: number
          verified?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cook_id?: string
          type?: 'home' | 'partner'
          address?: string
          address_line2?: string | null
          city?: string
          state?: string
          postcode?: string
          latitude?: number
          longitude?: number
          verified?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          cook_id: string
          title: string
          description: string
          price_cents: number
          photos: string[]
          tags: string[]
          allergens: string[]
          dietary_tags: string[]
          spice_level: number
          prep_time_minutes: number
          is_available: boolean
          preorder_enabled: boolean
          preorder_cutoff_hours: number | null
          max_daily_orders: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cook_id: string
          title: string
          description: string
          price_cents: number
          photos?: string[]
          tags?: string[]
          allergens?: string[]
          dietary_tags?: string[]
          spice_level?: number
          prep_time_minutes?: number
          is_available?: boolean
          preorder_enabled?: boolean
          preorder_cutoff_hours?: number | null
          max_daily_orders?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cook_id?: string
          title?: string
          description?: string
          price_cents?: number
          photos?: string[]
          tags?: string[]
          allergens?: string[]
          dietary_tags?: string[]
          spice_level?: number
          prep_time_minutes?: number
          is_available?: boolean
          preorder_enabled?: boolean
          preorder_cutoff_hours?: number | null
          max_daily_orders?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          cook_id: string
          status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
          subtotal_cents: number
          delivery_fee_cents: number
          platform_fee_cents: number
          total_cents: number
          delivery_address: Json
          delivery_type: 'delivery' | 'pickup'
          scheduled_for: string | null
          accepted_at: string | null
          completed_at: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
          special_instructions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          cook_id: string
          status?: 'pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
          subtotal_cents: number
          delivery_fee_cents: number
          platform_fee_cents: number
          total_cents: number
          delivery_address: Json
          delivery_type?: 'delivery' | 'pickup'
          scheduled_for?: string | null
          accepted_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          cook_id?: string
          status?: 'pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
          subtotal_cents?: number
          delivery_fee_cents?: number
          platform_fee_cents?: number
          total_cents?: number
          delivery_address?: Json
          delivery_type?: 'delivery' | 'pickup'
          scheduled_for?: string | null
          accepted_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          meal_id: string
          meal_title: string
          quantity: number
          price_cents: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          meal_id: string
          meal_title: string
          quantity: number
          price_cents: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          meal_id?: string
          meal_title?: string
          quantity?: number
          price_cents?: number
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string
          stripe_payment_intent_id: string
          stripe_checkout_session_id: string | null
          amount_cents: number
          status: 'pending' | 'succeeded' | 'failed' | 'refunded'
          refund_amount_cents: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          stripe_payment_intent_id: string
          stripe_checkout_session_id?: string | null
          amount_cents: number
          status?: 'pending' | 'succeeded' | 'failed' | 'refunded'
          refund_amount_cents?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          stripe_payment_intent_id?: string
          stripe_checkout_session_id?: string | null
          amount_cents?: number
          status?: 'pending' | 'succeeded' | 'failed' | 'refunded'
          refund_amount_cents?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      payouts: {
        Row: {
          id: string
          cook_id: string
          order_id: string
          stripe_transfer_id: string | null
          gross_amount_cents: number
          platform_commission_cents: number
          stripe_fee_cents: number
          net_amount_cents: number
          status: 'pending' | 'processing' | 'paid' | 'failed'
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cook_id: string
          order_id: string
          stripe_transfer_id?: string | null
          gross_amount_cents: number
          platform_commission_cents: number
          stripe_fee_cents: number
          net_amount_cents: number
          status?: 'pending' | 'processing' | 'paid' | 'failed'
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cook_id?: string
          order_id?: string
          stripe_transfer_id?: string | null
          gross_amount_cents?: number
          platform_commission_cents?: number
          stripe_fee_cents?: number
          net_amount_cents?: number
          status?: 'pending' | 'processing' | 'paid' | 'failed'
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          order_id: string
          customer_id: string
          cook_id: string
          rating: number
          text: string | null
          response: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          customer_id: string
          cook_id: string
          rating: number
          text?: string | null
          response?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          customer_id?: string
          cook_id?: string
          rating?: number
          text?: string | null
          response?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      safety_reports: {
        Row: {
          id: string
          order_id: string | null
          reporter_id: string
          cook_id: string
          category: 'food_safety' | 'quality' | 'hygiene' | 'other'
          description: string
          status: 'open' | 'investigating' | 'resolved' | 'dismissed'
          resolution_notes: string | null
          resolved_by: string | null
          resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          reporter_id: string
          cook_id: string
          category: 'food_safety' | 'quality' | 'hygiene' | 'other'
          description: string
          status?: 'open' | 'investigating' | 'resolved' | 'dismissed'
          resolution_notes?: string | null
          resolved_by?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          reporter_id?: string
          cook_id?: string
          category?: 'food_safety' | 'quality' | 'hygiene' | 'other'
          description?: string
          status?: 'open' | 'investigating' | 'resolved' | 'dismissed'
          resolution_notes?: string | null
          resolved_by?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          actor_id: string
          action: string
          target_type: string
          target_id: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          actor_id: string
          action: string
          target_type: string
          target_id: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          actor_id?: string
          action?: string
          target_type?: string
          target_id?: string
          metadata?: Json | null
          created_at?: string
        }
      }
      customer_addresses: {
        Row: {
          id: string
          customer_id: string
          label: string
          address: string
          address_line2: string | null
          city: string
          state: string
          postcode: string
          latitude: number
          longitude: number
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          label: string
          address: string
          address_line2?: string | null
          city: string
          state: string
          postcode: string
          latitude: number
          longitude: number
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          label?: string
          address?: string
          address_line2?: string | null
          city?: string
          state?: string
          postcode?: string
          latitude?: number
          longitude?: number
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          customer_id: string
          cook_id: string | null
          meal_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          cook_id?: string | null
          meal_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          cook_id?: string | null
          meal_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
