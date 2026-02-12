# Aquatic Motiv - Technical Architecture

---

## System Overview

Two applications:

```
saveafish.org (VPS)                        aquaticmotiv.com (Shopify)
┌────────────────────────────────┐        ┌────────────────────────┐
│  SaveAFish                     │        │  Shopify Store         │
│  (SaaS — free signup)          │        │                        │
│                                │        │  Product catalog       │
│  Configurator                  │───────►│  Inventory             │
│  Compatibility engine          │ Shopify│  Checkout              │
│  Logic Engine API              │ Store- │  Customer accounts     │
│  User accounts (3 roles)       │ front  │  Order management      │
│  Saved configurations          │ API    │  Product metafields    │
│  CMS (fish, guides, reviews)   │        │                        │
│  Educational content           │◄───────│  Webhooks (orders,     │
│  Email capture (Klaviyo)       │        │  inventory updates)    │
│                                │        │                        │
└────────────────────────────────┘        └────────────────────────┘
         │                                         ▲
         │                                         │
         ├── creates Shopify cart ─────────────────►│
         ├── redirects to Shopify checkout ────────►│
         │                                         │
         │    Products NOT in Shopify:             │
         └── Amazon affiliate links ──► Amazon.com │
```

---

## SaveAFish (saveafish.org)

**Domain**: saveafish.org
**Hosting**: VPS (self-hosted)
**Model**: SaaS — free registration, single-tenant (aquaticmotiv.com Shopify store only)
**Stack**: Next.js (App Router), TypeScript, Shopify Storefront API (GraphQL)

SaveAFish is a standalone web application. Users register for free, configure aquascaping setups, and check out through the connected Shopify store. Products in Shopify inventory use direct cart integration. Products not in Shopify (tanks, stands, large canister filters) use Amazon affiliate links.

### Shopify Integration (Critical Path)

This is the foundation everything else depends on. The configurator is useless without live Shopify data.

**Integration method**: Shopify Storefront API (GraphQL)
- Read products with metafields (category, compatibility data, care level)
- Read real-time inventory levels
- Read product images from Shopify CDN
- Read pricing including compare-at prices
- Create carts via `cartCreate` / `cartLinesAdd` mutations
- Generate checkout URL and redirect user to Shopify checkout

**Authentication**: Custom app with Storefront API access token (not a public Shopify App — single-tenant integration with aquaticmotiv.com's Shopify store).

**Webhooks (Shopify → SaveAFish)**:
- Product updates → cache invalidation
- Inventory changes → real-time stock accuracy
- Order creation → link orders back to configurations

**Data flow**:
```
saveafish.org                         Shopify (aquaticmotiv.com)
     │                                         │
     ├── GET products + metafields ────────────►│
     │◄──── product data, images, prices ───────┤
     │                                          │
     ├── GET inventory levels ─────────────────►│
     │◄──── stock quantities ───────────────────┤
     │                                          │
     │   (user builds configuration)            │
     │   (Logic Engine validates locally)       │
     │                                          │
     ├── POST cartCreate ──────────────────────►│
     │◄──── cart ID + checkout URL ─────────────┤
     │                                          │
     └── REDIRECT user to checkout ────────────►│
                                                │──► Shopify Checkout
                                                │──► Shopify Order
                                                │──► Webhook → saveafish.org
```

**Caching strategy**: Products and metafields cached on the VPS (they change infrequently). Inventory checked in real-time or near-real-time. Cache invalidated via Shopify webhooks or on a short TTL.

**Required Shopify admin setup**:
1. Create custom app with Storefront API access
2. Define metafield definitions (see PRD Section 5)
3. Populate metafields on all products
4. Configure webhooks for product/inventory/order updates

### Product Source Model

Products come from two sources. The configurator must handle both seamlessly:

| Source | Integration | Products |
|--------|-------------|----------|
| **Shopify** (aquaticmotiv.com) | Storefront API → direct cart | Plants (~277), Snails (~96), Lighting (~34), CO2 (~30), Fertilizers (~30), Rocks (~28), Driftwood (~22), Bettas (~21), Caves/Decor (~21), Botanicals (~20), Tools (~18), Substrate (~15), Shrimp (~13), Water Testing (~10), Guppies (~9), Crabs (~9), Clams (~6), Temperature Control (~5), Filtration (~4), Water Care (~4), Food (~3), Air Pumps (~2) |
| **Amazon** (affiliate) | Affiliate links → Amazon.com | Tanks/Aquariums, Stands/Furniture, Large canister filters, Powerheads/Wavemakers, Tank lids/covers, Chillers |

**Total Shopify products**: ~678 sellable items across 22 categories.

Amazon affiliate products are curated by SaveAFish and stored in the database (not fetched from Amazon API). These include product name, Amazon ASIN, affiliate link, image, and relevant specs for the Logic Engine.

### User Accounts & Roles

Three user roles:

| Role | Capabilities |
|------|-------------|
| **Hobbyist** | Use configurator, save configurations, checkout via Shopify, read content |
| **Content Editor** | All Hobbyist capabilities + create/edit all content (fish, guides, reviews, glossary, etc.) via Draft → Review → Publish workflow |
| **Admin** | All Content Editor capabilities + manage users, roles, system config |

- Free registration (email + password or OAuth) — all users start as Hobbyist
- Hobbyists can request upgrade to Content Editor
- Configurations saved server-side to user account (not just localStorage)
- Users can save multiple configurations
- Shareable configuration URLs
- Anonymous users: localStorage fallback, prompted to register to save

### CMS Architecture

Content Editors manage content through saveafish.org. Content is served directly from saveafish.org (there is no separate content site).

```
Content Editor (saveafish.org)
    │
    ├── Creates/edits fish profile     ─── Draft
    ├── Creates/edits care guide       ─── Review
    ├── Creates/edits product review   ─── Publish
    │
    ▼
Database (PostgreSQL)
    │
    ├── Content stored as structured data
    ├── Workflow state (draft / review / published)
    │
    ▼
saveafish.org serves content pages
    │
    └── /fish/[slug], /guides/[slug], /products/[slug], etc.
```

### Email Capture (Klaviyo)

Klaviyo integration for email marketing and lead capture:
- Email capture forms on saveafish.org (configurator, content pages)
- Segmentation by user behavior (configurator usage, content viewed, purchase history)
- Automated flows: welcome series, abandoned configuration, post-purchase care guides

### Logic Engine

Runs server-side on the VPS as a Next.js API route (`/api/logic`). Accepts a `CartState`, returns `ValidationResult`.

```typescript
interface CompatibilityResult {
  compatible: boolean;
  severity: 'info' | 'warning' | 'error';
  message: string;
  recommendation?: string;
}
```

Three check types:
1. **Bio-Check**: Temperature overlap, pH overlap for all livestock
2. **Aggression-Check**: Species compatibility matrices (peaceful/semi-aggressive/aggressive)
3. **Space-Check**: Bioload calculation (filtration-based, using filter flow_rate metafield + tank volume + fish bioload scores), zone occupancy (top/mid/bottom)

### Core Components

```
src/
├── app/
│   ├── page.tsx                    # Landing / marketing
│   ├── configurator/
│   │   └── page.tsx                # Main configurator UI
│   ├── fish/[slug]/page.tsx        # Fish profiles (content)
│   ├── guides/[slug]/page.tsx      # Care guides (content)
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── [...callback]/page.tsx  # OAuth callbacks
│   ├── dashboard/
│   │   └── page.tsx                # Saved configurations
│   ├── editor/                     # Content Editor UI
│   │   ├── fish/page.tsx
│   │   ├── guides/page.tsx
│   │   └── reviews/page.tsx
│   └── api/
│       ├── logic/route.ts          # Logic Engine endpoint
│       ├── auth/[...]/route.ts     # Auth endpoints
│       ├── shopify/route.ts        # Shopify proxy/cache layer
│       └── webhooks/shopify/route.ts # Shopify webhook receiver
├── components/configurator/
│   ├── AquascapeConfigurator.tsx
│   ├── TankSetup.tsx
│   ├── CategorySelector.tsx
│   ├── ProductGrid.tsx
│   ├── ProductCard.tsx
│   ├── ConfigurationSummary.tsx
│   ├── CompatibilityWarnings.tsx
│   ├── QuantityCalculator.tsx
│   └── TemplateGallery.tsx
├── context/
│   └── ConfiguratorContext.tsx      # Global state (useReducer)
├── hooks/
│   ├── useShopifyProducts.ts
│   ├── useCompatibility.ts
│   ├── useCalculators.ts
│   └── useAuth.ts
├── lib/
│   ├── shopify/
│   │   ├── client.ts               # Storefront API client
│   │   ├── queries.ts              # GraphQL queries
│   │   ├── mutations.ts            # Cart mutations
│   │   └── cache.ts                # Product/inventory cache
│   ├── affiliate/
│   │   └── amazon.ts               # Amazon affiliate link generation
│   ├── compatibility/
│   │   ├── fish.ts
│   │   ├── plants.ts
│   │   └── index.ts
│   ├── klaviyo/
│   │   └── client.ts               # Klaviyo API integration
│   ├── auth/                       # Authentication logic
│   └── db/                         # Database access (users, configs, content)
└── types/
    └── aquascaping.ts
```

### State Management

Single `ConfiguratorContext` with `useReducer`:
- **State**: Selected tank, added items (hardscape, livestock, plants, equipment), logic status
- **Actions**: SET_TANK_SIZE, ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, etc.
- **Computed**: getTotalPrice, getTotalItems, getItemsByCategory
- **Persistence**: Debounced save to server (authenticated) or localStorage (anonymous)

---

## Deployment

| App | Domain | Hosting | Stack |
|-----|--------|---------|-------|
| SaveAFish | saveafish.org | VPS | Next.js, Node.js, PostgreSQL |
| Shopify store | aquaticmotiv.com | Shopify | Liquid theme |

### VPS Requirements
- Node.js runtime (for Next.js SSR)
- Reverse proxy (nginx or Caddy) for SSL termination
- SSL certificates (Let's Encrypt) for saveafish.org
- Process manager (PM2 or systemd) for the Next.js app
- Database for user accounts, saved configurations, and CMS content (PostgreSQL)

### Environment Variables

**saveafish.org**:
```
SHOPIFY_STOREFRONT_DOMAIN=aquaticmotiv.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=xxxxx
DATABASE_URL=postgres://...
SESSION_SECRET=xxxxx
KLAVIYO_API_KEY=xxxxx
KLAVIYO_LIST_ID=xxxxx
AMAZON_AFFILIATE_TAG=xxxxx
NEXT_PUBLIC_SITE_URL=https://saveafish.org
NEXT_PUBLIC_SHOPIFY_URL=https://aquaticmotiv.com
```

---

## Analytics & Attribution

Cross-domain tracking between saveafish.org and aquaticmotiv.com:
- UTM parameters on all links from saveafish.org → Shopify checkout
- GA4 cross-domain measurement between saveafish.org and aquaticmotiv.com
- Shopify line item properties on cart creation to attribute orders back to configurator
- Shopify webhooks to link orders back to configurations
- Event tracking on saveafish.org: registration, configuration started, items added, warnings shown, checkout initiated
- Klaviyo event tracking for email segmentation
