# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SaveAFishWorks** is the unified codebase for the Aquatic Motiv ecosystem, combining a content site with an aquascape configurator:

1. **Content Site** — Fish profiles, care guides, product reviews, glossary, comparisons, curated lists, persona guides, and examples. Full SEO infrastructure with sitemap, robots.txt, JSON-LD schema, and metadata helpers.
2. **Aquascape Configurator** — Interactive tool at `/configurator` for building complete aquascaping setups. Connects to the Shopify store (aquaticmotiv.com) for real products, pricing, and checkout via the Storefront API.

This repo was created by merging AquaticGrowth (content + infrastructure) with SaveAFish (configurator domain modeling + UX features).

See `docs/` for vision, PRD, roadmap, competitive research, architecture, and session notes (6 files).

## Commands

- `npm run dev` — Start development server
- `npm run build` — Production build (also validates all static routes)
- `npm run lint` — Run ESLint
- `npm start` — Serve production build

No test framework is configured.

## Architecture

### Data Flow

All content lives as **JSON files** in `src/data/` (8 data sources: fish, guides, products, curation lists, comparisons, glossary, personas, examples). Data access functions in `src/lib/data/` load these JSON files synchronously and export query functions (`getAll*`, `get*BySlug`, `get*Slugs`, `get*sByCategory`). Guides additionally have MDX content files in `src/data/guides/content/`.

Every content type cross-references others via slug arrays (`relatedGuides`, `relatedFish`, `relatedProducts`, etc.).

`src/data/sampleProducts.ts` provides 40+ sample aquascaping products across 11 categories for dev/testing when Shopify API is unavailable.

### Type System

Two product type systems coexist:

- **`ShopifyProduct`** (`src/types/shopify.ts`) — Normalized shape from Shopify Storefront API. Used by the configurator cart, checkout, and product grid. Fields: `id`, `variantId`, `handle`, `title`, `price`, `category`, `careLevel`, `availableForSale`, etc.
- **`AquascapingProduct`** and subtypes (`src/types/aquascaping.ts`) — Rich domain types with 10 category-specific subtypes (SubstrateProduct, RockProduct, PlantProduct, LivestockProduct, etc.). Used by sample data and future domain logic. Also exports `CATEGORY_INFO`, `TANK_SIZES`, and `AQUASCAPE_STYLES` constants.

### Configurator Architecture

State is managed via `ConfiguratorContext` (`src/context/ConfiguratorContext.tsx`):

- **`state`** — `ConfiguratorState` with `tank`, `tankDimensions`, `style`, `items`, `activeCategory`, `configurationName`
- **`dispatch`** — Raw reducer dispatch for all action types (`SET_TANK`, `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `SET_ACTIVE_CATEGORY`, `CLEAR_ALL`, `SET_TANK_DIMENSIONS`, `SET_STYLE`, `SET_CONFIGURATION_NAME`, `LOAD_CONFIGURATION`)
- **`computed`** — Memoized `totalItems`, `subtotal`, `itemsByCategory`
- **Named convenience methods** — `setTankSize()`, `setTankDimensions()`, `setStyle()`, `addItem()`, `removeItem()`, `updateQuantity()`, `setActiveCategory()`, `setConfigurationName()`, `clearConfiguration()`, `loadConfiguration()`, `hasItemsInCategory()`

Existing components use `dispatch` and `computed` directly. New components can use either approach.

### Routing Pattern

Each content type follows the same pattern:
1. **Hub page** at `/[type]/page.tsx` — lists all entries
2. **Detail page** at `/[type]/[slug]/page.tsx` — uses `generateStaticParams` + `generateMetadata`
3. **Template component** in `src/components/templates/` — handles layout for that content type

Products have a two-level route: `/products/[category]/[slug]`.

### Component Organization

- `src/components/templates/` — One page template per content type (8 total)
- `src/components/layout/` — Header, Footer, Breadcrumbs
- `src/components/ui/` — Reusable primitives (Badge, Card, Rating)
- `src/components/seo/` — JsonLd schema generation
- `src/components/fish/`, `ecommerce/`, `content/` — Domain-specific components
- `src/components/configurator/` — Configurator components (TankSetup, CategorySidebar, ShopifyProductGrid, ShopifyProductCard, ConfigurationSummary, ConfiguratorShell, MobileFooter)

### SEO Infrastructure

- `src/app/sitemap.ts` — Programmatic sitemap built from all data sources
- `src/app/robots.ts` — Robots.txt config
- `src/lib/seo/` — Centralized `generatePageMetadata()` helper and schema generators
- `src/components/seo/JsonLd.tsx` — Schema.org markup (FAQPage, Article, Product, BreadcrumbList, DefinedTerm, ItemList)
- `src/lib/linking/` — Breadcrumb path builders

### Custom Theme

Tailwind is configured in `src/app/globals.css` (not tailwind.config) using Tailwind v4's `@theme inline` syntax. Custom color palettes: `aqua-*` (teal/accent), `ocean-*` (blue/primary), `coral-*`, `sand-*`.

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Adding New Content

To add a new content entry (e.g., a fish species): add the data to the appropriate JSON file in `src/data/`. The static params generation and sitemap will pick it up automatically. For guides, also create a `.mdx` file in `src/data/guides/content/`.

To add a new content **type**: create the JSON data file, TypeScript types in `src/types/`, data access module in `src/lib/data/`, template component in `src/components/templates/`, and route pages under `src/app/`. Update `sitemap.ts` to include the new type.
