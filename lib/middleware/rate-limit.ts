import { NextRequest } from 'next/server'
import { RateLimitError } from '@/lib/errors/app-error'
import { env } from '@/lib/config/env'

let ratelimit: any = null
let hasUpstash = false

// Check if Upstash is available at runtime
try {
  hasUpstash = !!(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN)
} catch {
  hasUpstash = false
}

async function getRateLimiter() {
  if (!hasUpstash) {
    return null
  }

  if (!ratelimit) {
    try {
      // Dynamic import only when needed
      const { Ratelimit } = await import('@upstash/ratelimit')
      const { Redis } = await import('@upstash/redis')

      const redis = new Redis({
        url: env.UPSTASH_REDIS_REST_URL!,
        token: env.UPSTASH_REDIS_REST_TOKEN!,
      })

      ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '10 s'),
        analytics: true,
        prefix: 'lunchbox:ratelimit',
      })
    } catch (error) {
      console.warn('⚠️ Rate limiting disabled: Upstash packages not installed')
      return null
    }
  }

  return ratelimit
}

export async function checkRateLimit(
  req: NextRequest,
  options?: {
    limit?: number
    window?: string
    identifier?: string
  }
) {
  const limiter = await getRateLimiter()
  if (!limiter) return // Skip if not configured

  const identifier = options?.identifier || getClientIdentifier(req)

  const { success, limit, reset, remaining } = await limiter.limit(identifier)

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000)
    throw new RateLimitError(retryAfter)
  }

  return {
    limit,
    remaining,
    reset,
  }
}

function getClientIdentifier(req: NextRequest): string {
  // Try to get IP from various headers (Vercel, Cloudflare, etc.)
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'

  return `ip:${ip}`
}

// Stricter rate limit for auth endpoints
export async function checkAuthRateLimit(req: NextRequest, identifier?: string) {
  const limiter = await getRateLimiter()
  if (!limiter) return

  const id = identifier || getClientIdentifier(req)

  try {
    const { Ratelimit } = await import('@upstash/ratelimit')
    
    // 5 attempts per 15 minutes for auth
    const authLimiter = new Ratelimit({
      redis: limiter.redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      prefix: 'lunchbox:auth',
    })

    const { success, reset } = await authLimiter.limit(id)

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000)
      throw new RateLimitError(retryAfter)
    }
  } catch (error) {
    // If Upstash not available, skip rate limiting
    return
  }
}
