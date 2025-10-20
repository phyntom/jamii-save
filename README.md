# Jamii Save - Group Savings & Loan Management Platform

> **A comprehensive platform for managing rotating savings and credit associations (ROSCAs) with modern web technology**

## 🏦 Overview

Jamii Save is a digital platform that enables communities to organize collective savings groups with built-in loan functionality. The platform digitizes traditional rotating savings and credit associations (ROSCAs) with modern web technology, making it perfect for communities, cooperatives, and small businesses that need structured savings and lending programs.

## 🚀 Key Features

### 🔐 Authentication & User Management

- **Secure Authentication**: Powered by Better-Auth with support for email/password and OAuth providers
- **User Profiles**: Complete profile management with personal details (name, email, phone, location)
- **Session Management**: Secure session handling with automatic token refresh
- **Email Verification**: Built-in email verification system for account security
- **Password Recovery**: Secure password reset functionality

### 👥 Community & Membership Management

- **Community Creation**: Users can create savings communities with customizable settings
- **Flexible Invitation System**: Support for email invitations, shareable links, and join codes
- **Role-Based Access**: Multiple member roles (admin, treasurer, secretary, member)
- **Plan-Based Limits**: Subscription tiers control community and member limits
- **Member Management**: Invite, approve, remove, and manage community members
- **Community Settings**: Configurable contribution rules, loan policies, and fees

### 💰 Contribution Tracking

- **Contribution Recording**: Members can record their regular contributions
- **Approval Workflow**: Community admins review and approve/reject contributions
- **Status Tracking**: Track contribution status (pending, approved, rejected)
- **Transaction History**: Complete audit trail for all contributions
- **Payment Methods**: Support for cash, bank transfer, mobile money, and card payments

## 🛠️ Technology Stack

### **Frontend**

- **Next.js 15** with App Router for modern React development
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** for utility-first styling
- **Radix UI** components for accessible, unstyled UI primitives
- **ShadCN/UI** for beautiful, customizable components

### **Backend & Database**

- **Better-Auth** for authentication and session management
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** on Neon for scalable, serverless database
- **Server Actions** for secure server-side operations

### **Database Features**

- **JSONB Support**: Rich feature flags and descriptions for subscription plans
- **Enum Constraints**: Type-safe database constraints for data integrity
- **Audit Trails**: Complete timestamp tracking on all entities
- **Flexible Relationships**: Support for complex community and subscription relationships

## 📊 Database Schema

### **Core Tables**

- `user` - User accounts and profiles
- `session` - Active user sessions
- `account` - OAuth accounts and passwords
- `verification` - Email verification tokens

### **Community Management**

- `community` - Savings communities with settings and policies
- `community_members` - Membership and role management
- `community_invitations` - Flexible invitation system (email/link/code)

### **Subscription & Billing**

- `plan` - Subscription tiers with feature flags
- `subscription_types` - Flexible billing cycles (monthly, yearly, custom)
- `user_subscriptions` - User subscription tracking

## 🎯 Subscription Plans

### **Free Plan**

- 1 community maximum
- 10 members per community
- Basic reporting and email notifications
- Contribution tracking

### **Basic Plan**

- 5 communities maximum
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

## 🔧 Development Setup

### **Prerequisites**

- Node.js 18+ or Bun
- PostgreSQL database (Neon recommended)
- Git

### **Installation**

```bash
# Clone the repository
git clone <repository-url>
cd jamii-save

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database and auth configuration

# Run database migrations
bun run db:migrate

# Start development server
bun run dev
```

### **Environment Variables**

```env
# Database
DATABASE_URL=your_neon_database_url

# Authentication
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏗️ Architecture

### **Authentication Flow**

- Better-Auth handles user registration, login, and session management
- JWT tokens for secure API access
- Automatic session refresh and validation
- Support for multiple OAuth providers

### **Database Design**

- **Type Safety**: Drizzle ORM provides compile-time type checking
- **Flexible Schema**: JSONB fields for extensible feature management
- **Audit Trails**: Complete timestamp tracking on all entities
- **Data Integrity**: Enum constraints and foreign key relationships

### **Community Management**

- **Plan-Based Limits**: Subscription tiers control community and member limits
- **Flexible Invitations**: Support for email, link, and code-based invitations
- **Role Management**: Extensible role system for different permission levels
- **Settings Management**: Configurable contribution and loan policies

## 🚀 Deployment

### **Database Migration**

```bash
# Generate migration files
bun run db:generate

# Apply migrations
bun run db:migrate
```

### **Production Deployment**

- Deploy to Vercel, Netlify, or your preferred platform
- Configure environment variables for production
- Set up database backups and monitoring
- Configure domain and SSL certificates

## 📈 Future Roadmap

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@jamii-save.com or join our community Discord server.

---

**Built with ❤️ for communities worldwide**
