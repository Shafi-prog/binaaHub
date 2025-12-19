# Binna Platform

A comprehensive business management platform with e-commerce, CRM, and analytics capabilities.

## 🔒 Security Notice

**⚠️ IMPORTANT:** This repository previously had a security issue where environment files containing sensitive credentials were committed to version control. This has been fixed, but **all exposed credentials must be rotated immediately**.

Please see [SECURITY.md](./SECURITY.md) for:
- List of exposed credentials requiring immediate rotation
- Detailed instructions for each service
- Security best practices
- Environment variable setup guide

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL (or Supabase account)
- Redis (optional, for caching)

### Environment Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Generate secure secrets:**
   ```bash
   # Generate NEXTAUTH_SECRET
   openssl rand -base64 32
   
   # Generate JWT_SECRET
   openssl rand -base64 32
   
   # Generate COOKIE_SECRET
   openssl rand -base64 32
   ```

3. **Update `.env.local` with your credentials:**
   - Create a Supabase project and get your credentials
   - Set up Google OAuth (optional)
   - Configure other services as needed
   - **Never commit `.env.local` to git**

### Installation

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:apply:sql

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
binaaHub/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # Reusable React components
│   ├── core/            # Core shared utilities
│   ├── domains/         # Business domain logic
│   └── products/        # Product-specific modules
├── public/              # Static assets
├── database/            # Database migrations and schemas
├── scripts/             # Utility scripts
├── tests/               # Test files
├── .env.example         # Environment template
└── SECURITY.md          # Security documentation
```

## 🛠️ Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Testing
- `npm run test` - Run all tests
- `npm run test:unit` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

### Code Quality
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

### Database
- `npm run db:apply:sql` - Apply database migrations
- `npm run db:seed:demo` - Seed demo data
- `npm run db:introspect` - Introspect database schema

## 🔐 Security Best Practices

### Environment Variables

✅ **DO:**
- Use `.env.local` for local development (git-ignored)
- Store production secrets in secure vaults (Vercel, AWS Secrets Manager)
- Use different credentials for each environment
- Rotate credentials regularly
- Use strong, randomly generated secrets

❌ **DON'T:**
- Never commit `.env` files with real credentials
- Never commit API keys or passwords to git
- Never share credentials via email or chat
- Never use the same credentials across environments
- Never hardcode credentials in source code

### Reporting Security Issues

If you discover a security vulnerability, please report it to the repository maintainers privately. Do not open a public issue.

See [SECURITY.md](./SECURITY.md) for more information.

## 📚 Documentation

- [Security Policy](./SECURITY.md)
- [API Documentation](./docs/README.md)
- [Testing Guide](./tests/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Important:** Never commit sensitive credentials. Always use `.env.local` for local development and secure vaults for production.

## 📄 License

This project is private and proprietary.

## 🔧 Support

For support, please contact the repository maintainers.

---

**Security Reminder:** If you're setting up this project for the first time, make sure to review [SECURITY.md](./SECURITY.md) for important security information and credential rotation requirements.
