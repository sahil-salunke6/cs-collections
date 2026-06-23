# CS Collections — Premium Football Jersey Store (Frontend)

A production-ready **frontend-only** e-commerce application for CS Collections, built with mock JSON data and structured for drop-in backend integration.

> Phase scope: **UI only.** No backend, database, or server business logic. All data is served from `src/data` via a mock `lib/api` layer shaped exactly like a future REST API.

## Tech Stack
- **Next.js 15** (App Router, RSC) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first `@theme` tokens) · **shadcn/ui-style** primitives (Radix)
- **Framer Motion** · **Redux Toolkit** + redux-persist · **TanStack Query v5**
- **react-hook-form** + **zod** · **lucide-react** · **sonner**

## Getting Started
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (type-checks every route)
```

## Theme Support
Light / Dark / System via `next-themes` (class strategy on `<html>`), persisted to `localStorage`, with a pre-hydration script that prevents flash. All colours are semantic CSS variables in `src/styles/globals.css` — components never hardcode hex.

Brand palette: Bottle Green `#0F5132` · Vibrant Pink `#FF2D75` · Ink `#1A1A1A` · Border `#E5E7EB` · Logo Amber `#E08A1E`.

## Folder Structure
```
src/
├── app/                      # routes (App Router + route groups)
│   ├── (shop)/               # storefront (home, listings, product, cart, checkout) + chrome
│   ├── (info)/               # about, contact, faq + chrome
│   ├── (auth)/               # login, register, forgot-password (split-panel layout)
│   ├── (account)/account/    # profile, orders, wishlist, addresses (guarded + sidebar)
│   ├── layout.tsx            # providers, fonts, no-flash theme script
│   ├── icon.svg              # favicon (logo mark)
│   └── not-found.tsx
├── components/
│   ├── ui/                   # primitives: button, input, dialog, sheet, select, accordion…
│   ├── common/               # Logo, ThemeToggle, JerseyVisual, TeamCrest, Price, Rating…
│   ├── layout/               # Navbar, MegaPanel, Footer, CartDrawer, MobileNav, SearchCommand
│   ├── product/              # ProductCard/Grid/Rail, Gallery, Purchase, Reviews, Filters…
│   ├── home/                 # Hero, FeaturedTeams, CollectionTiles, Reviews, Instagram
│   └── account/              # AccountSidebar, AccountGuard, OrderStatusBadge
├── store/                    # Redux: slices (cart, wishlist, auth, ui, filters), selectors, hooks
├── lib/
│   ├── api/                  # mock fetchers (swap for fetch() later) — filtering/sort/pagination
│   ├── hooks/                # queries (React Query), useCart, useWishlist, useMediaQuery
│   ├── providers/            # Redux + PersistGate, React Query, next-themes, Toaster
│   └── utils/                # cn, format (price/date), nav config
├── data/                     # mock JSON/TS: products, teams, reviews, faq, content, account
├── types/                    # shared domain interfaces
└── styles/globals.css        # Tailwind v4 tokens, light/dark, keyframes
```

## State Architecture
- **Redux Toolkit** → client/session state: `cart`, `wishlist`, `auth` (persisted) + `ui`, `filters` (session).
- **TanStack Query** → "server" data via `lib/api` mock fetchers (artificial latency, caching, loading/error states).

## Backend Integration
Replace the function bodies in `src/lib/api/index.ts` with real `fetch()` calls — the return types already match the components' expectations. Swap the mock `login/register` reducers in `authSlice` for real auth. Replace generated `JerseyVisual`/`TeamCrest` art with real product imagery (`next/image` + the configured `remotePatterns`).

## Responsiveness
Mobile-first. Breakpoints `sm→2xl` plus a custom `3xl` (1920px) for ultra-wide. Product grids scale to 5 columns at `3xl`; `Container` caps content width.
