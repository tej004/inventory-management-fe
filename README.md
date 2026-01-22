This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Implementation Summary

**Developer:** Tomas Jubile T. Libago  
**Completion Time:** January 22, 2025 10:00PM
**Features completed:** Task 1 and Task 2

### Key Technical Decisions

- Used Next.js App Router for modern routing and layouts
- State and data fetching managed with @tanstack/react-query
- UI built with shadcn/ui and custom minimalist components
- Modular hooks for filter and query invalidation logic
- Multi-stage Dockerfile for efficient production builds

### Known Limitations

- No authentication/authorization implemented
- No backend included in this repo (API endpoints assumed)
- No end-to-end or integration tests provided
- Error handling is basic (toast only)
- No mobile-specific UI optimizations

### Testing Instructions

1. Install dependencies: `npm install`
2. Run locally: `npm run dev` (visit http://localhost:3000)
3. Or build and run with Docker:
   - `docker-compose up --build`
   - Visit http://localhost:3000
4. Try creating, approving, rejecting, and receiving transfers
5. Use filters to test warehouse/product filtering

### Video Walkthrough

### New Dependencies Added

- @tanstack/react-query
- shadcn/ui
- sonner (toast notifications)

---
