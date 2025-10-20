# Better-Auth Integration Guide

## ✅ Completed Steps

### 1. Installation

- Installed `better-auth@1.3.26` using bun

### 2. Configuration Files Created

- **`lib/auth-config.ts`** - Server-side better-auth configuration
- **`lib/auth-client.ts`** - Client-side auth helpers
- **`app/api/auth/[...all]/route.ts`** - API route handler for better-auth

### 3. Database Schema Updated

- Changed table name from `jamii.users` to `jamii.user` (better-auth convention)
- Added better-auth required tables:
  - `jamii.session` - User sessions
  - `jamii.account` - OAuth accounts and passwords
  - `jamii.verification` - Email verification tokens
- Updated all foreign key references throughout the schema
- Added appropriate indexes for performance

### 4. Code Updates

- **`lib/auth.ts`** - Simplified to use better-auth API
- **`app/actions/auth.ts`** - Updated signUp, signIn, signOut to use better-auth
- **`middleware.ts`** - Updated to use better-auth session checking
- Updated all SQL queries from `jamii.users` to `jamii.user` in:
  - `app/actions/groups.ts`
  - `app/dashboard/profile/page.tsx`
  - `app/dashboard/settings/page.tsx`
  - `app/dashboard/contributions/page.tsx`
  - `app/dashboard/groups/[id]/page.tsx`
  - `app/dashboard/groups/[id]/contributions/page.tsx`
  - `app/dashboard/groups/[id]/loans/page.tsx`

## 🚀 Next Steps

### 1. Install Dependencies

```bash
bun install
```

### 2. Update Environment Variables

Add to your `.env.local`:

```env
DATABASE_URL=your_neon_database_url
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate a secret:

```bash
openssl rand -base64 32
```

### 3. Recreate Database Schema

```bash
# Drop and recreate the schema (WARNING: This will delete all data)
psql $DATABASE_URL -c "DROP SCHEMA IF EXISTS jamii CASCADE;"
psql $DATABASE_URL -f scripts/001_create_schema.sql
psql $DATABASE_URL -f scripts/002_seed_plans.sql
```

### 4. Test the Integration

```bash
bun dev
```

Visit:

- `/sign-up` - Test user registration
- `/sign-in` - Test user login
- `/dashboard` - Should redirect if not authenticated

## 📝 Key Changes

### Authentication Flow

**Before (Custom JWT):**

- Manual password hashing with bcryptjs
- Custom JWT token generation with jose
- Manual session management with cookies

**After (Better-Auth):**

- Better-auth handles password hashing automatically
- Built-in session management
- Support for OAuth providers (ready to add)
- Email verification support (can be enabled)

### API Usage

**Sign Up:**

```typescript
await auth.api.signUpEmail({
  body: { name, email, password },
  headers: await headers(),
});
```

**Sign In:**

```typescript
await auth.api.signInEmail({
  body: { email, password },
  headers: await headers(),
});
```

**Get Session:**

```typescript
const session = await auth.api.getSession({
  headers: await headers(),
});
```

**Sign Out:**

```typescript
await auth.api.signOut({
  headers: await headers(),
});
```

## 🔧 Additional Features Available

Better-auth supports many features out of the box:

1. **OAuth Providers** - Add Google, GitHub, etc.
2. **Email Verification** - Enable in config
3. **Password Reset** - Built-in support
4. **Two-Factor Authentication** - Can be added
5. **Session Management** - Multiple sessions per user
6. **Rate Limiting** - Built-in protection

## 📚 Resources

- [Better-Auth Documentation](https://better-auth.com)
- [Better-Auth GitHub](https://github.com/better-auth/better-auth)

## ⚠️ Important Notes

1. **Table Names**: Better-auth uses singular table names (`user`, `session`, `account`)
2. **Schema**: All tables must be in the `jamii` schema as configured
3. **Sessions**: Better-auth manages sessions automatically - no manual cookie handling needed
4. **Passwords**: Stored in the `account` table, not the `user` table
