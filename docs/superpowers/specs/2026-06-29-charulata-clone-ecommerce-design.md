# Design: Custom E-commerce Platform (charulata.green reference)

## Goal

Build a full, production-grade **plant nursery e-commerce platform** from
scratch, using [charulata.green](https://charulata.green) (currently
WordPress/WooCommerce) as a visual/UX/site-map reference only. No WordPress,
no CMS — fully custom code, end to end. Secondary goal: the user is learning
ASP.NET Core / Next.js / PostgreSQL at an advanced/job-ready level, so
implementation should explain *why*, not just *what*.

## Reference Site Map (charulata.green)

Surveyed directly — this is what we are functionally matching:

- **Home** — hero carousel (promos), Top Sellers grid, promo banners
  ("Buy green to save green", Corporate Greening, Fast & Safe Delivery,
  Monthly Garden Care Packages), then per-category showcase rows: Fruit
  Trees, Flower Plants, Ornamental Plants, Spice Plants, Medicinal Plants,
  Fertilizers & Soil
- **Shop** (product listing) — breadcrumb, sidebar category tree, grid
  (4/5/6 columns toggle), items-per-page (20/40/60/100), sort dropdown
  (popularity/rating/newest/price), product card (image, name, price or
  price-range for variant products, "Sold out" badge, Add to cart/Quick
  view/Wishlist), "Load more" button instead of numbered pagination
- **Product Detail** — image gallery, name, price/variant selector,
  quantity, Add to cart, description/specs tabs
- **Cart** — breadcrumb (Cart → Checkout → Order complete), line items
  table, qty controls, totals box, trust badges row (Free gift / Secure
  payment / 24×7 support) below
- **Checkout** — shipping info form, order summary, payment method
- **About Us** — company story, founder/team section with photos, image
  gallery, customer-focus statement
- **Contact Us** — two office addresses/phones/emails, short 3-field
  contact form (name, mobile, message), trust badges
- **Footer** — Privacy Policy, Returns, Terms & Conditions, Sitemap, social
  links

## Scope

Full e-commerce platform for a plant nursery:
- Product catalog — categories: Fruit Trees, Flower Plants, Ornamental
  Plants, Spice Plants, Medicinal Plants, Wood/Timber Trees, Vegetable
  Plants, Gardening Tools, Organic Fertilizers & Pesticides, Pots & Geo-bags
  — with search/filter, image upload, variant products (price ranges)
- Cart (guest + logged-in)
- Checkout & order management
- Payment integration (SSLCommerz — Bangladesh market)
- Authentication (customer + admin roles)
- Admin panel (product/category/order/inventory management)
- Customer account area (profile, order history)
- Static content pages: About Us, Contact Us (with simple contact form)
- Aesthetic storefront matching charulata.green's green/nature-themed,
  minimal, trust-badge-driven tone, Bengali + English mixed content

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Backend | ASP.NET Core 8 Web API | requested, job-market standard |
| Backend architecture | Clean Architecture (Domain/Application/Infrastructure/API) | testable, scalable, industry standard |
| Frontend | Next.js (App Router) + TypeScript | requested, modern SSR/SEO-friendly storefront |
| Database | PostgreSQL + EF Core | open-source, cloud-friendly, no licensing cost, modern industry default |
| Auth | ASP.NET Identity + JWT (access + refresh token) | stateless API auth, role-based (Customer/Admin) |
| Payment | SSLCommerz, behind a provider-agnostic abstraction | BD market fit now; abstraction allows adding bKash/Stripe later without rearchitecting |
| Caching/session | Redis | cart storage, scalability practice |
| Containerization | Docker + Docker Compose | requested, learning goal; services: api, frontend, postgres, redis, pgadmin |
| Logging | Serilog | structured logging, centralized error visibility |
| Validation | FluentValidation | consistent request validation in Application layer |
| Mediator | MediatR (CQRS-lite) | decouples controllers from business logic, common in Clean Architecture |

## Backend Architecture (Clean Architecture)

1. **Domain** — Entities (Product, Category, Order, OrderItem, Cart, CartItem,
   ApplicationUser, Payment), value objects, domain enums. No external
   dependencies.
2. **Application** — Use cases via MediatR commands/queries, DTOs,
   FluentValidation validators, interfaces for repositories/external services
   (IPaymentGateway, ICartService, etc).
3. **Infrastructure** — EF Core DbContext + migrations, repository
   implementations, SSLCommerz client implementing IPaymentGateway, Redis
   cart store, image storage (local disk initially, abstracted for future
   cloud storage swap).
4. **API** — Controllers (thin — just call MediatR), JWT auth middleware,
   global exception handling middleware, Swagger/OpenAPI, CORS for the
   Next.js origin.

## Core Modules

1. **Catalog** — products, categories (10 nursery categories, see Scope), variant pricing (price ranges), search/filter, image upload (admin only)
2. **Cart** — Redis-backed, works for guest (cookie/session id) and logged-in users; merges guest cart into user cart on login
3. **Checkout & Orders** — order creation from cart, order status state machine (Pending → Paid → Shipped → Delivered / Cancelled)
4. **Payment** — SSLCommerz session init + IPN (webhook) handler to confirm payment and update order status
5. **Auth** — register/login, JWT + refresh token rotation, role claims (Customer, Admin)
6. **Admin Panel** — Next.js `/admin` route group (separate layout, guarded by Admin role) — CRUD for products/categories, order list + status updates, basic sales view
7. **Customer Account** — profile view/edit, order history

## Frontend Structure (Next.js)

- **Storefront (public):** Home, Shop (listing with sidebar category filter
  + sort + grid density toggle + load-more pagination), Product detail,
  Cart, Checkout, About Us, Contact Us — visual language matching
  charulata.green: green/nature palette, white product cards, large plant
  imagery, generous whitespace, trust-badge rows
- **Auth:** Login, Register
- **Account area:** profile, order history (auth-guarded)
- **Admin area:** `/admin/*` — product/category/order management (role-guarded)

## Data Flow (Checkout example)

1. User adds items to cart → frontend calls Cart API → Redis updated
2. User proceeds to checkout → frontend collects shipping info → calls Order API
3. Order API creates Order (status: Pending) in Postgres, calls SSLCommerz to init payment session, returns redirect URL
4. User completes payment on SSLCommerz → SSLCommerz sends IPN to backend webhook
5. Webhook handler verifies payment, updates Order status to Paid, clears cart

## Error Handling

- Global exception middleware → consistent JSON error shape (`{ message, errors? }`)
- FluentValidation failures → 400 with field-level errors
- Payment webhook failures logged via Serilog, retried per SSLCommerz's own retry semantics (no custom retry queue needed at this scale)

## Testing

- **Backend:** xUnit for Domain/Application logic (use case handlers, validators); integration tests for API endpoints using Testcontainers + ephemeral Postgres
- **Frontend:** component tests deferred — can be added once UI stabilizes (not blocking initial build)

## Out of Scope (for this spec)

- Multi-vendor support
- Multi-currency/i18n
- Real-time order tracking notifications (email/SMS confirmation only, no live tracking)
- Stripe/bKash integration (architecture supports adding later, not built now)

## Learning Approach

User is advanced/job-ready level but explicitly learning ASP.NET/Next.js/Postgres
through this build. Each implementation step should briefly explain *why* a
pattern/tool is used, not just produce code silently.
