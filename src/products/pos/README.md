# BinnaPOS - Point of Sale System

Saudi Arabia's most advanced POS system built on proven e-commerce technology.

## Features

- **Touch-friendly Interface** - Optimized for tablet and touch devices
- **Multi-payment Support** - Cash, mada, STC Pay, credit cards
- **Real-time Inventory** - Live stock tracking and updates
- **ZATCA Compliance** - Saudi tax authority compliant receipts
- **Barcode Support** - Built-in barcode scanning and printing
- **Offline Mode** - Works without internet connection

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

This product can be deployed independently as a standalone SaaS product.

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_APP_NAME=BinnaPOS
NEXT_PUBLIC_API_URL=https://api.binna.sa
DATABASE_URL=postgresql://user:password@localhost:5432/binna_pos
```

### Independent Deployment

```bash
# Deploy to production
npm run build
npm start

# Or use Docker
docker build -t binna-pos .
docker run -p 3001:3001 binna-pos
```

## Market Position

BinnaPOS competes directly with:
- Local POS systems
- International solutions
- Traditional cash registers

**Competitive advantages:**
- 50-70% cost savings
- Saudi-specific features
- Modern web technology
- Real-time cloud sync

## Support

For technical support: support@binna.sa
For business inquiries: sales@binna.sa
