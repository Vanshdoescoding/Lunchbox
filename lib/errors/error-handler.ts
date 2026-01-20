import { NextResponse } from 'next/server'
import { AppError } from './app-error'
import { ZodError } from 'zod'
import { env } from '@/lib/config/env'

export function handleError(error: unknown, correlationId?: string) {
  // Log error safely (no sensitive data)
  const safeError = sanitizeError(error)
  console.error('[Error]', {
    correlationId,
    ...safeError,
  })

  // Convert to AppError if needed
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.toJSON(),
        correlationId,
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: error.errors,
        },
        correlationId,
      },
      { status: 400 }
    )
  }

  // Unknown error - don't leak details in production
  const isDev = env.NODE_ENV === 'development'
  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: isDev && error instanceof Error ? error.message : 'Internal server error',
      },
      correlationId,
    },
    { status: 500 }
  )
}

function sanitizeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      ...(error instanceof AppError && { code: error.code, statusCode: error.statusCode }),
    }
  }
  return { message: String(error) }
}
