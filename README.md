# Hijaab Collection

A full-stack e-commerce platform built with Next.js and Express.

## Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management)
- TanStack React Query
- Radix UI / shadcn/ui components

**Backend:**
- Express 5
- TypeScript
- MongoDB / Mongoose
- Socket.IO (real-time updates)
- Cloudinary (image storage)
- Shippo (shipping integration)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hijaab-collection-main
```

2. Install dependencies for both frontend and backend:
```bash
cd frontend && npm install
cd ../backend && npm install
```

3. Configure environment variables:

**Backend (`backend/.env`):**
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SHIPPO_API_KEY=your_shippo_key
```

**Frontend (`frontend/.env`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
JWT_SECRET=your_jwt_secret
```

### Running the Application

Start the backend server:
```bash
cd backend
npm run dev
```

Start the frontend development server (in a separate terminal):
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Features

### Customer Features
- Browse products with filtering and search
- Shopping cart management
- User registration and authentication
- Order placement and tracking
- Multiple shipping addresses
- Voucher/discount codes

### Admin Dashboard
- Product management (CRUD)
- Order management and status updates
- Customer management
- Voucher/coupon management
- Analytics dashboard
- Store settings configuration

## Project Structure

```
├── frontend/
│   ├── app/              # Next.js App Router pages
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── user/         # User account pages
│   │   ├── products/     # Product pages
│   │   ├── cart/         # Shopping cart
│   │   └── checkout/     # Checkout flow
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── admin/        # Admin-specific components
│   │   └── user/         # User-specific components
│   └── lib/              # Utilities and API client
│
├── backend/
│   └── src/
│       ├── controllers/  # Request handlers
│       ├── routes/       # API route definitions
│       ├── models/       # Mongoose schemas
│       ├── services/     # Business logic (email, shipping, socket)
│       └── middlewares/  # Auth and other middleware
```

## API Endpoints

| Route | Description |
|-------|-------------|
| `/auth` | Authentication (login, register, profile) |
| `/products` | Product CRUD operations |
| `/users` | User management (admin) |
| `/cart` | Cart and order operations |
| `/voucher` | Discount voucher management |
| `/settings` | Store settings and company address |

## Deployment

- **Backend**: Configured for Railway deployment (see `railway.json`)
- **Frontend**: Configured for Vercel deployment

## License

ISC
