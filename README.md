# JACK STUDIO SERVICE

Next.js starter app for connecting 13 JACK STUDIO retail outlets with a centralized service operation.

## Outlets

- Aeon Bukit Tinggi
- Paradigm Mall
- Main Place
- Aeon Permas Jaya
- Aeon Seremban 2
- Aeon Bukit Indah
- Aeon Wangsa Maju
- Aeon Kulaijaya
- Berjaya Time Square
- Alamanda Shopping
- Sunway Carnival
- Mayang Mall
- East Coast Mall

## Modules

### Service Module
- Luggage repair orders
- Leather care service
- Handcraft service
- Engraving and customization requests
- Customer information
- Store drop-off location
- Photo upload
- Quotation
- Payment status
- Repair status tracking

### Store Operation Module
- Replenishment request
- Stock transfer request
- New product request
- Backorder request
- Special product request
- HQ approval workflow
- Inventory tracking by store
- Low stock alert

## Included

- Database schema: [supabase/schema.sql](./supabase/schema.sql)
- Outlet seed data: [supabase/seed.sql](./supabase/seed.sql)
- Page structure: [docs/page-structure.md](./docs/page-structure.md)
- API route map: [docs/api-routes.md](./docs/api-routes.md)
- RBAC logic: [lib/rbac.ts](./lib/rbac.ts)
- Basic UI components: [components/ui.tsx](./components/ui.tsx)
- Dashboard layout: [app/page.tsx](./app/page.tsx)
- Service form: [app/service-orders/new/page.tsx](./app/service-orders/new/page.tsx)
- Store request form: [app/store-requests/new/page.tsx](./app/store-requests/new/page.tsx)
- Inventory view: [app/inventory/page.tsx](./app/inventory/page.tsx)
- Super Admin stock control: [app/inventory/stock-manager.tsx](./app/inventory/stock-manager.tsx)

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add your Supabase project values to `.env.local`.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Run [supabase/schema.sql](./supabase/schema.sql) in the Supabase SQL editor before connecting live data.

## Public Demo

The static UI demo is deployed with GitHub Pages:

https://shernzai399.github.io/jack-studio-service/

For production with API routes and Supabase auth, deploy the same repository to Vercel and add the Supabase environment variables there.

## Roles

- Store Staff
- Store Manager
- Service Admin
- Inventory Admin
- Super Admin

The public demo signs in as Super Admin so stock can be added from the Inventory page. Demo stock changes are saved in the browser with `localStorage`.

The app-level permission map is in [lib/rbac.ts](./lib/rbac.ts), and Supabase row-level security policies mirror those access boundaries in the schema.
