# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hijaab Collection is a full-stack e-commerce application with separate frontend and backend directories.

## Development Commands

### Frontend (Next.js 15 + React 18)
```bash
cd frontend
npm run dev      # Start development server (port 3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

### Backend (Express + TypeScript)
```bash
cd backend
npm run dev      # Start with nodemon (auto-reload)
npm run build    # Compile TypeScript to dist/
npm run start    # Run compiled code from dist/
```

## Architecture

### Frontend (`/frontend`)
- **Framework**: Next.js 15 with App Router
- **State Management**: Zustand (`components/store/store.ts`)
- **Data Fetching**: TanStack React Query with Axios
- **UI Components**: Radix UI primitives with shadcn/ui (`components/ui/`)
- **Styling**: Tailwind CSS v4

**Key directories:**
- `app/` - Next.js App Router pages
- `app/admin/` - Admin dashboard (products, orders, customers, vouchers, settings, analytics)
- `app/user/` - User authentication and account pages
- `lib/API/api.ts` - Centralized API client with all backend endpoint functions
- `middleware.ts` - Route protection based on JWT role (admin vs user)

### Backend (`/backend`)
- **Framework**: Express 5 with TypeScript
- **Database**: MongoDB via Mongoose
- **Auth**: JWT tokens stored in HTTP-only cookies (cookie name: `Ecommerce`)
- **File Uploads**: Multer + Cloudinary
- **Real-time**: Socket.IO for live updates
- **Shipping**: Shippo integration

**Structure follows MVC pattern:**
- `src/controllers/` - Request handlers
- `src/routes/` - API route definitions
- `src/models/` - Mongoose schemas
- `src/services/` - Socket.IO, email (nodemailer), shipping (Shippo)
- `src/middlewares/` - Auth middleware

**API Routes:**
- `/auth` - Authentication (login, register, profile, password reset)
- `/products` - Product CRUD
- `/users` - User management (admin)
- `/settings` - App settings and company address
- `/cart` - Cart operations and order placement
- `/voucher` - Discount vouchers

## Environment Variables

### Frontend (`frontend/.env`)
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:5000)

### Backend (`backend/.env`)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `FRONTEND_URL` - Frontend URL for CORS
- Cloudinary credentials for image uploads
- Shippo API key for shipping

## Deployment

- Backend deployed via Railway (uses `railway.json` with Dockerfile)
- Frontend deployed on Vercel
- CORS configured to allow Vercel preview deployments (`*.vercel.app`)
