# LunchBox Architecture Documentation

## Clean Architecture Overview

This codebase follows COMP2511-style clean architecture with clear separation of concerns and dependency inversion.

### Dependency Flow

```
Routes/Controllers → Services/Use Cases → Repositories → Database Client
                  ↓
              Validation
                  ↓
            Domain Models
```

**Rules:**
- Inner layers never depend on outer layers
- Domain models are framework-agnostic
- All external dependencies are abstracted via interfaces/repositories

## Folder Structure

```
lib/
├── config/           # Environment validation (Zod schemas)
├── errors/           # Error classes and handling
├── middleware/       # Rate limiting, security headers, correlation IDs
├── validation/       # Input validation schemas (Zod)
├── repositories/     # Data access layer (Supabase)
├── services/         # Business logic / use cases
├── stripe/           # Stripe SDK wrapper
└── supabase/         # Supabase client configuration

app/
├── api/              # API route handlers (controllers)
│   └── webhooks/     # Webhook endpoints
├── (auth)/           # Auth pages
├── (customer)/       # Customer app pages
├── (cook)/           # Cook dashboard pages
└── (admin)/          # Admin dashboard pages

components/
└── ui/               # Reusable UI components (shadcn/ui)
```

## Layer Responsibilities

### 1. Routes/Controllers (`app/api/**/route.ts`)

**Responsibilities:**
- HTTP request/response handling
- Input validation (via Zod schemas)
- Rate limiting checks
- Correlation ID management
- Call appropriate service methods
- Error handling and formatting

**Example:**
```typescript
export async function POST(req: NextRequest) {
  const correlationId = getCorrelationId(req)
  
  try {
    await checkRateLimit(req)
    const body = await req.json()
    const validated = schema.parse(body)
    
    const result = await service.doSomething(validated)
    
    return NextResponse.json(result)
  } catch (error) {
    return handleError(error, correlationId)
  }
}
```

### 2. Services (`lib/services/*`)

**Responsibilities:**
- Business logic implementation
- Orchestrate multiple repositories
- Transaction management
- Domain rule enforcement

**Example:**
```typescript
export class PaymentService {
  constructor(
    private paymentRepo: PaymentRepository,
    private orderRepo: OrderRepository
  ) {}

  async handleCheckoutCompleted(params) {
    await this.paymentRepo.updatePaymentStatus(...)
    await this.orderRepo.updateOrderStatus(...)
  }
}
```

### 3. Repositories (`lib/repositories/*`)

**Responsibilities:**
- Database queries
- Data mapping (DB ↔ Domain)
- No business logic
- Single responsibility per repository

**Example:**
```typescript
export class PaymentRepository {
  constructor(private supabase: SupabaseClient) {}

  async updatePaymentStatus(params) {
    const { data, error } = await this.supabase
      .from('payments')
      .update(...)
    
    if (error) throw error
    return data
  }
}
```

### 4. Validation (`lib/validation/*`)

**Responsibilities:**
- Zod schemas for all inputs
- Reusable validation primitives
- Type inference for TypeScript

**Example:**
```typescript
export const signUpSchema = z.object({
  email: emailSchema,
  password: z.string().min(8),
  name: sanitizedStringSchema(2, 100),
})

export type SignUpInput = z.infer<typeof signUpSchema>
```

## Security Measures

### 1. Environment Validation

All environment variables are validated at boot using Zod:

```typescript
// lib/config/env.ts
export const env = validateEnv() // Throws if invalid
```

### 2. Rate Limiting

Upstash Redis-based rate limiting:

```typescript
await checkRateLimit(req) // 10 req/10s default
await checkAuthRateLimit(req) // 5 req/15m for auth
```

### 3. Input Validation

All inputs validated with Zod before processing:

```typescript
const validated = schema.parse(body) // Throws ValidationError if invalid
```

### 4. Error Handling

Centralized error handling with safe responses:

```typescript
try {
  // ...
} catch (error) {
  return handleError(error, correlationId)
}
```

**Error types:**
- `ValidationError` (400)
- `AuthenticationError` (401)
- `AuthorizationError` (403)
- `NotFoundError` (404)
- `RateLimitError` (429)
- `ExternalServiceError` (502)

### 5. Security Headers

Applied via middleware to all routes:
- CSP (Content Security Policy)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy
- Permissions-Policy

### 6. Correlation IDs

Every request gets a unique correlation ID for tracing:

```typescript
const correlationId = getCorrelationId(req)
console.log('[Action]', { correlationId, ...data })
```

### 7. Safe Logging

Never log sensitive data:

```typescript
// ❌ BAD
console.log('User:', user) // May contain password, tokens

// ✅ GOOD
console.log('User action', { 
  correlationId, 
  userId: user.id,
  action: 'login'
})
```

## Testing Strategy

### Unit Tests
- Services (business logic)
- Validation schemas
- Utility functions

### Integration Tests
- API routes (with mocked repositories)
- Repository methods (with test database)

### E2E Tests
- Critical user flows
- Payment processing
- Auth flows

## Deployment Checklist

### Vercel Environment Variables

**Required:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
PLATFORM_COMMISSION_PERCENT
```

**For Rate Limiting:**
```
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

**For Payments:**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_CONNECT_WEBHOOK_SECRET
```

### Post-Deployment

1. ✅ Run database migrations in Supabase
2. ✅ Configure Stripe webhooks
3. ✅ Set up Upstash Redis for rate limiting
4. ✅ Update Supabase redirect URLs
5. ✅ Test critical flows end-to-end
6. ✅ Monitor error logs

## Common Patterns

### Adding a New API Endpoint

1. Create validation schema in `lib/validation/`
2. Create repository method in `lib/repositories/`
3. Create service method in `lib/services/`
4. Create route handler in `app/api/`
5. Add rate limiting
6. Add error handling
7. Add tests

### Adding a New Feature

1. Define domain models/types
2. Create database migration
3. Update `database.types.ts`
4. Create repository
5. Create service
6. Create API routes
7. Create UI components
8. Add validation
9. Add tests

## Performance Considerations

- Use server components by default
- Client components only when needed (`'use client'`)
- Optimize database queries (indexes, select specific columns)
- Cache static data with React Server Components
- Use Vercel Edge for global distribution

## Maintenance

### Updating Dependencies

```bash
npm outdated
npm update
npm audit fix
```

### Code Quality

```bash
npm run lint
npm run typecheck
npm run format:check
```

### Before Committing

```bash
npm run lint
npm run typecheck
npm run format
```
