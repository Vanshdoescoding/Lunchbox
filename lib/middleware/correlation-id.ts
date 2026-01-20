import { nanoid } from 'nanoid'
import { NextRequest } from 'next/server'

export function getCorrelationId(req: NextRequest): string {
  return req.headers.get('x-correlation-id') || nanoid(12)
}

export function setCorrelationIdHeader(headers: Headers, correlationId: string) {
  headers.set('x-correlation-id', correlationId)
}
