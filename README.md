# Jamii Save - Group Savings & Loan Management Platform

> **A comprehensive platform for managing rotating savings and credit associations (ROSCAs) with modern web technology**

## Overview

Jamii Save is a digital platform that enables communities to organize collective savings groups with built-in loan functionality. The platform digitizes traditional rotating savings and credit associations (ROSCAs), making it perfect for communities, cooperatives, and small businesses that need structured savings and lending programs.

## Key Features

### Authentication & User Management

- **Secure Authentication**: Powered by Convex Auth with support for email/password and OAuth providers
- **User Profiles**: Complete profile management with personal details (name, email, phone, location)
- **Session Management**: Secure session handling with automatic token refresh
- **Email Verification**: Built-in email verification system for account security
- **Password Recovery**: Secure password reset functionality

### Community & Membership Management

- **Community Creation**: Users can create savings communities with customizable settings
- **Flexible Invitation System**: Support for email invitations, shareable links, and join codes
- **Role-Based Access**: Multiple member roles (admin, treasurer, secretary, member)
- **Plan-Based Limits**: Subscription tiers control community and member limits
- **Member Management**: Invite, approve, remove, and manage community members
- **Community Settings**: Configurable contribution rules, loan policies, and fees

### Contribution Tracking

- **Contribution Recording**: Members can record their regular contributions
- **Approval Workflow**: Community admins review and approve/reject contributions
- **Status Tracking**: Track contribution status (pending, approved, rejected)
- **Transaction History**: Complete audit trail for all contributions
- **Payment Methods**: Support for cash, bank transfer, mobile money, and card payments

## Technology Stack

### **Frontend**

- **React 19** for building the user interface
- **Vite** for fast development and optimized production builds
- **TypeScript** for type safety and better developer experience
- **React Router v7** for client-side routing
- **Tailwind CSS v4** for utility-first styling
- **Radix UI** components for accessible, unstyled UI primitives
- **ShadCN/UI** for beautiful, customizable components
- **React Hook Form** + **Zod** for form validation

### **Backend (Convex)**

- **Convex** as the full backend-as-a-service: database, queries, mutations, and actions
- **Convex Auth** (`@convex-dev/auth`) for authentication and session management
- **Real-time data sync** out of the box via Convex's reactive query engine

### **Key Libraries**

- `convex` — backend client and server SDK
- `@convex-dev/auth` — authentication layer on top of Convex
- `react-router` — client-side navigation
- `zod` — schema validation
- `lucide-react` — icon library
- `sonner` — toast notifications
- `recharts` — data visualization

## Database Schema (Convex)

### **Auth Tables** (managed by `@convex-dev/auth`)

- `users` — User accounts and profiles
- `sessions` — Active user sessions
- `accounts` — OAuth accounts and credential records
- `verificationCodes` — Email/OTP verification tokens
- `refreshTokens` — Auth refresh token management

### **Community Management**

- `communities` — Savings communities with settings and policies
- `memberships` — Membership and role management
- `invites` — Flexible invitation system (email/token)

### **Contributions**

- `contribution` — Contribution records with status tracking

## Subscription Plans

### **Free Plan**

- 1 community maximum
- 30 members per community
- Basic reporting and email notifications
- Contribution tracking

### **Basic Plan**

- 1 communities maximum
- 50 members per community
- Advanced reporting and SMS notifications
- Loan management features
- Data export capabilities

### **Premium Plan**

- Unlimited communities and members
- Advanced analytics and reporting
- All notification channels (email, SMS, push)
- Custom branding and priority support
- API access for integrations

## Development Setup

### **Prerequisites**

- Node.js 18+ or Bun
- A Convex account ([convex.dev](https://convex.dev))
- Git

### **Installation**

```bash
# Clone the repository
git clone <repository-url>
cd jamii-save

# Install dependencies
npm install   # or bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Convex deployment URL and auth configuration

# Start the development server (frontend + backend in parallel)
npm run dev
```

### **Environment Variables**

```env
# Convex
VITE_CONVEX_URL=https://<your-deployment>.convex.cloud
```

## Architecture

### **Authentication Flow**

- `@convex-dev/auth` handles user registration, login, and session management on top of Convex
- JWTs are issued by Convex and verified server-side in every query/mutation
- `ConvexProvider` + `ConvexAuthProvider` wrap the app for real-time auth state
- `ctx.auth.getUserIdentity()` is used server-side to authorize all protected operations

### **Data Layer**

- All data lives in Convex's managed database — no external database required
- Queries and mutations are fully type-safe using Convex validators and generated types
- Real-time subscriptions keep the UI in sync automatically

### **Community Management**

- **Plan-Based Limits**: Subscription tiers control community and member limits
- **Flexible Invitations**: Support for email and token-based invitations
- **Role Management**: Extensible role system for different permission levels
- **Settings Management**: Configurable contribution and loan policies

## Deployment

### **Convex Backend**

```bash
# Deploy backend to production
npx convex deploy
```

### **Frontend**

```bash
# Build for production
npm run build
```

Deploy the `dist/` output to Vercel, Netlify, or any static hosting provider. Set the `VITE_CONVEX_URL` environment variable to your production Convex deployment URL.

## Future Roadmap

### **Phase 2: Advanced Features**

- Loan management system with approval workflows
- Advanced reporting and analytics
- Mobile app development
- API for third-party integrations

### **Phase 3: Enterprise Features**

- Multi-tenant architecture
- Advanced compliance features
- White-label solutions
- Enterprise support and SLA

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@jamii-save.com or join our community Discord server.

---

**Built with love for communities worldwide**
