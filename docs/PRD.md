# Save A Fish - Product Requirements Document (PRD)

## Document Info

| Field | Value |
|-------|-------|
| Product | Save A Fish (saveafish.org) |
| Version | 1.0 |
| Last Updated | February 2026 |
| Status | In Development |
| Data Source | Aquatic Motiv (aquaticmotiv.com) via Shopify Storefront API |
| Platforms | iOS, Android, SaaS Web |

---

## 1. Overview

### 1.1 Purpose
This PRD defines the requirements for Save A Fish, a standalone aquascaping configurator app (iOS, Android, SaaS web) hosted at saveafish.org. The app guides aquarists through building complete aquascaping setups with intelligent recommendations, compatibility validation, and quantity calculations. Product data is sourced read-only from Aquatic Motiv's Shopify store (aquaticmotiv.com) via the Storefront API.

### 1.2 Background
Aquascaping involves selecting products across 11+ categories that must work together harmoniously. Aquarists face uncertainty about compatibility, quantities, and completeness. Save A Fish addresses those pain points with a standalone configuration tool backed by real product data from Aquatic Motiv.

### 1.3 Scope
- **In Scope**: Product configuration, compatibility validation, quantity calculations, read-only Shopify Storefront API integration with aquaticmotiv.com, basic post-purchase tools
- **Out of Scope (current release)**: Direct cart integration / checkout, 3D visualization, AR features, community features, marketplace functionality
- **Future Release**: Direct cart integration with aquaticmotiv.com Shopify checkout

---

## 2. User Stories

### 2.1 Configuration Flow

| ID | User Story | Priority |
|----|------------|----------|
| US-01 | As a customer, I want to select my tank size so the tool can recommend appropriate products | P0 |
| US-02 | As a customer, I want to choose an aquascape style so I get relevant product suggestions | P0 |
| US-03 | As a customer, I want to browse products by category so I can build my setup systematically | P0 |
| US-04 | As a customer, I want to see which categories are required vs optional so I don't miss essentials | P0 |
| US-05 | As a customer, I want to add products to my configuration with quantity selection | P0 |
| US-06 | As a customer, I want to see a running total of my configuration cost | P0 |
| US-07 | As a customer, I want to checkout my complete configuration via Shopify | P0 |

### 2.2 Smart Recommendations

| ID | User Story | Priority |
|----|------------|----------|
| US-08 | As a customer, I want substrate quantity recommendations based on my tank dimensions | P1 |
| US-09 | As a customer, I want to know if my selected fish are compatible with each other | P1 |
| US-10 | As a customer, I want warnings when I select plants that require CO2 but haven't added a CO2 system | P1 |
| US-11 | As a customer, I want to see my current bioload percentage so I don't overstock | P1 |
| US-12 | As a customer, I want filter recommendations based on my tank size | P1 |
| US-13 | As a customer, I want lighting recommendations based on my plant selections | P2 |

### 2.3 Templates & Bundles

| ID | User Story | Priority |
|----|------------|----------|
| US-14 | As a beginner, I want to start from a pre-built template so I don't have to choose everything myself | P1 |
| US-15 | As a customer, I want to see style-specific templates (Iwagumi, Dutch, Nature) | P2 |
| US-16 | As a customer, I want to customize a template after loading it | P1 |

### 2.4 Product Discovery

| ID | User Story | Priority |
|----|------------|----------|
| US-17 | As a customer, I want to search for products by name | P1 |
| US-18 | As a customer, I want to filter products by care level (beginner/intermediate/advanced) | P0 |
| US-19 | As a customer, I want to filter plants by light requirement and CO2 needs | P1 |
| US-20 | As a customer, I want to compare 2-3 similar products side-by-side | P2 |
| US-21 | As a customer, I want to see which products are low in stock or out of stock | P1 |

### 2.5 Budget Planning

| ID | User Story | Priority |
|----|------------|----------|
| US-22 | As a customer, I want to set a budget and see if I'm under or over | P2 |
| US-23 | As a customer, I want to see cost breakdown by category | P2 |
| US-24 | As a customer, I want suggestions for budget-friendly alternatives | P3 |

### 2.6 Configuration Management

| ID | User Story | Priority |
|----|------------|----------|
| US-25 | As a customer, I want my configuration saved automatically so I don't lose progress | P0 |
| US-26 | As a customer, I want to share my configuration via a link | P2 |
| US-27 | As a customer, I want to save multiple configurations to my account | P2 |
| US-28 | As a customer, I want to export my configuration as a list | P3 |

### 2.7 Post-Purchase

| ID | User Story | Priority |
|----|------------|----------|
| US-29 | As a customer, I want to see my purchased configuration in a dashboard | P2 |
| US-30 | As a customer, I want maintenance reminders based on my setup | P3 |
| US-31 | As a customer, I want a dosing calculator for my fertilizers | P3 |
| US-32 | As a customer, I want to easily reorder consumables (fertilizers, food, filter media) | P3 |

---

## 3. Functional Requirements

### 3.1 Tank Setup

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | System shall provide predefined tank sizes (5G, 10G, 20G, 29G, 40G, 55G, 75G, 90G, 125G) | P0 |
| FR-02 | System shall allow custom tank dimensions (L × W × H in inches) | P0 |
| FR-03 | System shall calculate tank volume from custom dimensions | P0 |
| FR-04 | System shall provide 6 aquascape styles: Nature, Iwagumi, Dutch, Biotope, Paludarium, Custom | P0 |
| FR-05 | System shall allow naming configurations | P1 |

### 3.2 Product Catalog (via Aquatic Motiv)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-06 | System shall display products in 11 categories: Substrate, Rocks, Driftwood, Plants, Lighting, Filtration, CO2, Fertilizers, Tools, Fish, Invertebrates | P0 |
| FR-07 | System shall fetch products read-only from aquaticmotiv.com via Shopify Storefront API | P0 |
| FR-08 | System shall display real-time inventory levels from aquaticmotiv.com | P1 |
| FR-09 | System shall read product attributes from Shopify metafields on aquaticmotiv.com | P0 |
| FR-10 | System shall support product variants (size, color, quantity packs) | P0 |
| FR-11 | System shall display product images from aquaticmotiv.com Shopify CDN | P1 |

### 3.3 Compatibility Engine

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-12 | System shall validate fish compatibility based on temperature range overlap | P1 |
| FR-13 | System shall validate fish compatibility based on pH range overlap | P1 |
| FR-14 | System shall validate fish temperament compatibility (peaceful/semi-aggressive/aggressive) | P1 |
| FR-15 | System shall warn when CO2-requiring plants are added without CO2 system | P1 |
| FR-16 | System shall warn when high-light plants are added with low-light fixture | P2 |
| FR-17 | System shall calculate and display bioload percentage | P1 |
| FR-18 | System shall warn when bioload exceeds 100% capacity | P1 |

### 3.4 Quantity Calculators

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-19 | System shall calculate substrate quantity: `(L × W × depth) / 60` liters | P1 |
| FR-20 | System shall recommend filter flow rate: `tank volume × 4-6` GPH | P1 |
| FR-21 | System shall recommend lighting wattage based on tank depth and plant needs | P2 |
| FR-22 | System shall recommend minimum schooling quantities for schooling fish | P1 |

### 3.5 Configuration Cart

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-23 | System shall display all added items with quantities and prices | P0 |
| FR-24 | System shall allow quantity adjustment for each item | P0 |
| FR-25 | System shall allow item removal | P0 |
| FR-26 | System shall display subtotal, updating in real-time | P0 |
| FR-27 | System shall group items by category in summary | P0 |
| FR-28 | System shall indicate missing required categories | P0 |

### 3.6 Aquatic Motiv Integration

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-29 | System shall read product catalog from aquaticmotiv.com via Storefront API (read-only) | P0 |
| FR-30 | System shall display Aquatic Motiv product links for manual purchase | P0 |
| FR-31 | *Future*: System shall create cart via Storefront API for direct checkout | P2 |
| FR-32 | *Future*: System shall redirect to aquaticmotiv.com Shopify checkout | P2 |
| FR-33 | System shall sync with Shopify collections for templates | P2 |

### 3.7 Persistence

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-34 | System shall auto-save configuration to localStorage | P0 |
| FR-35 | System shall restore configuration on page reload | P0 |
| FR-36 | System shall generate shareable URL with encoded configuration | P2 |
| FR-37 | System shall save configurations to customer account (if logged in) | P2 |

### 3.8 Templates

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-38 | System shall provide pre-built configuration templates | P1 |
| FR-39 | System shall load template products into configuration | P1 |
| FR-40 | System shall allow modification of loaded templates | P1 |
| FR-41 | System shall fetch templates from Shopify metaobjects or collections | P2 |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Initial page load (LCP) | < 2.5s |
| NFR-02 | Time to interactive | < 3.5s |
| NFR-03 | Product grid render (50 items) | < 500ms |
| NFR-04 | Cart update response | < 100ms |
| NFR-05 | Shopify API response handling | < 2s with loading state |

### 4.2 Compatibility

| ID | Requirement |
|----|-------------|
| NFR-06 | Support Chrome, Firefox, Safari, Edge (last 2 versions) |
| NFR-07 | Support iOS Safari and Chrome for Android |
| NFR-08 | Responsive design: 320px to 2560px viewport width |

### 4.3 Accessibility

| ID | Requirement |
|----|-------------|
| NFR-09 | WCAG 2.1 AA compliance |
| NFR-10 | Keyboard navigation for all interactive elements |
| NFR-11 | Screen reader compatibility |
| NFR-12 | Minimum color contrast ratio 4.5:1 |

### 4.4 Security

| ID | Requirement |
|----|-------------|
| NFR-13 | Storefront API token (read-only, for aquaticmotiv.com) stored as environment variable |
| NFR-14 | No sensitive data in localStorage |
| NFR-15 | HTTPS only (saveafish.org) |
| NFR-16 | No write access to aquaticmotiv.com Shopify store in current release |

### 4.5 Reliability

| ID | Requirement |
|----|-------------|
| NFR-16 | Graceful degradation when Shopify API unavailable |
| NFR-17 | Error boundaries prevent full page crashes |
| NFR-18 | Offline indicator with cached data display |

---

## 5. Data Requirements

### 5.1 Shopify Product Metafields

| Namespace | Key | Type | Required | Description |
|-----------|-----|------|----------|-------------|
| `aquascaping` | `category` | `single_line_text` | Yes | Primary category (substrate, plants, fish, etc.) |
| `aquascaping` | `subcategory` | `single_line_text` | No | Subcategory (carpet, stem, rhizome for plants) |
| `aquascaping` | `care_level` | `single_line_text` | Yes | beginner, intermediate, advanced |
| `aquascaping` | `light_requirement` | `single_line_text` | No | low, medium, high (for plants) |
| `aquascaping` | `co2_required` | `boolean` | No | Whether CO2 injection is required |
| `aquascaping` | `placement` | `single_line_text` | No | foreground, midground, background, floating |
| `aquascaping` | `temp_min` | `integer` | No | Minimum temperature (°F) |
| `aquascaping` | `temp_max` | `integer` | No | Maximum temperature (°F) |
| `aquascaping` | `ph_min` | `number_decimal` | No | Minimum pH |
| `aquascaping` | `ph_max` | `number_decimal` | No | Maximum pH |
| `aquascaping` | `scientific_name` | `single_line_text` | No | Scientific name for plants/livestock |
| `aquascaping` | `bioload` | `integer` | No | Bioload score 1-10 (for fish/inverts) |
| `aquascaping` | `schooling_size` | `integer` | No | Minimum school size |
| `aquascaping` | `temperament` | `single_line_text` | No | peaceful, semi-aggressive, aggressive |
| `aquascaping` | `flow_rate` | `integer` | No | GPH for filters |
| `aquascaping` | `wattage` | `integer` | No | Watts for lighting |
| `aquascaping` | `tank_size_min` | `integer` | No | Minimum tank size (gallons) |
| `aquascaping` | `tank_size_max` | `integer` | No | Maximum tank size (gallons) |

### 5.2 Shopify Metaobjects (Templates)

**Definition: `aquascape_template`**

| Field | Type | Description |
|-------|------|-------------|
| `name` | `single_line_text` | Template name |
| `description` | `multi_line_text` | Template description |
| `style` | `single_line_text` | Aquascape style |
| `tank_size` | `integer` | Target tank size (gallons) |
| `difficulty` | `single_line_text` | beginner, intermediate, advanced |
| `products` | `list.product_reference` | List of included products |
| `image` | `file_reference` | Template preview image |

---

## 6. UI/UX Requirements

### 6.1 Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER                                   │
│  Logo    Configuration Name    Items: X    Total: $XXX          │
├─────────────┬───────────────────────────────┬───────────────────┤
│             │                               │                   │
│  SIDEBAR    │      PRODUCT GRID             │  CONFIGURATION    │
│             │                               │  SUMMARY          │
│  Tank Setup │  Category Title               │                   │
│  - Size     │  Filters & Sort               │  Tank Info        │
│  - Style    │                               │  Items by Category│
│             │  ┌─────┐ ┌─────┐ ┌─────┐     │  Warnings         │
│  Categories │  │ Card│ │ Card│ │ Card│     │  Subtotal         │
│  ○ Substrate│  └─────┘ └─────┘ └─────┘     │                   │
│  ○ Rocks    │  ┌─────┐ ┌─────┐ ┌─────┐     │  [Add to Cart]    │
│  ○ Plants   │  │ Card│ │ Card│ │ Card│     │                   │
│  ...        │  └─────┘ └─────┘ └─────┘     │                   │
│             │                               │                   │
└─────────────┴───────────────────────────────┴───────────────────┘
```

### 6.2 Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| Desktop (>1200px) | 3-column: Sidebar + Grid + Summary |
| Tablet (768-1200px) | 2-column: Sidebar + Grid, Summary below |
| Mobile (<768px) | Single column, sticky footer with total |

### 6.3 Component Requirements

**Product Card**
- Product image (placeholder if missing)
- Title and vendor
- Care level badge
- Price (with compare-at price if on sale)
- Variant selector dropdown
- Quantity selector
- Add to configuration button
- "In Configuration" indicator if already added

**Category Selector**
- Icon + name for each category
- Required indicator (asterisk)
- Checkmark when category has items
- Active state highlight

**Configuration Summary**
- Collapsible on mobile
- Grouped by category
- Per-item quantity controls
- Remove button
- Running subtotal
- Missing required categories warning
- Checkout button

### 6.4 Feedback & States

| State | Treatment |
|-------|-----------|
| Loading | Skeleton placeholders |
| Empty category | Illustration + message |
| Error | Toast notification + retry option |
| Success (add to cart) | Brief success animation |
| Warning | Yellow banner with icon |
| Out of stock | Grayed out + "Out of Stock" badge |
| Low stock | "Only X left" badge |

---

## 7. Technical Architecture

### 7.1 Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | CSS Modules |
| State Management | React Context + useReducer |
| API | Shopify Storefront API (GraphQL) — read-only from aquaticmotiv.com |
| Hosting | saveafish.org (Vercel recommended) |
| Platforms | iOS, Android, SaaS Web |

### 7.2 Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Main configurator page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── api/
│       └── products/
│           └── route.ts         # Product API (optional caching layer)
├── components/
│   └── configurator/
│       ├── AquascapeConfigurator.tsx
│       ├── CategorySelector.tsx
│       ├── ConfigurationSummary.tsx
│       ├── ProductCard.tsx
│       ├── ProductGrid.tsx
│       ├── TankSetup.tsx
│       ├── CompatibilityWarnings.tsx
│       ├── QuantityCalculator.tsx
│       └── TemplateGallery.tsx
├── context/
│   └── ConfiguratorContext.tsx  # Global state
├── hooks/
│   ├── useShopifyProducts.ts    # Product fetching
│   ├── useCompatibility.ts      # Compatibility logic
│   ├── useCalculators.ts        # Quantity calculations
│   └── useLocalStorage.ts       # Persistence
├── lib/
│   ├── shopify/
│   │   ├── client.ts            # Storefront API client
│   │   ├── queries.ts           # GraphQL queries
│   │   └── mutations.ts         # Cart mutations
│   ├── compatibility/
│   │   ├── fish.ts              # Fish compatibility rules
│   │   ├── plants.ts            # Plant requirements
│   │   └── index.ts             # Main validator
│   └── calculators/
│       ├── substrate.ts
│       ├── bioload.ts
│       ├── lighting.ts
│       └── filtration.ts
├── types/
│   └── aquascaping.ts           # Type definitions
└── data/
    └── sampleProducts.ts        # Development/fallback data
```

### 7.3 Aquatic Motiv Integration Flow

```
saveafish.org                aquaticmotiv.com (Shopify)
┌─────────────────┐          ┌─────────────────┐
│                 │  READ    │                 │
│  Configurator   │─ONLY───▶│  Storefront API │
│  (saveafish.org)│          │                 │
└────────┬────────┘          └─────────────────┘
         │                           │
         │  1. Fetch products        │
         │  2. Fetch metafields      │
         │  3. Check inventory       │
         │  4. Load images           │
         │                           │
         ▼                           │
┌─────────────────┐                  │
│  localStorage   │    Future:       │
│  (config state) │    Cart ────────▶│ Shopify Checkout
└─────────────────┘    Integration   │
```

---

## 8. Release Phases

### Phase 1: MVP (Weeks 1-4)
**Goal**: Standalone configurator with Aquatic Motiv product data

| Feature | Status |
|---------|--------|
| Tank setup (size, style) | ✅ Done |
| 11 category navigation | ✅ Done |
| Product grid with filtering | ✅ Done |
| Configuration summary | ✅ Done |
| Responsive design | ✅ Done |
| Read-only product sync from aquaticmotiv.com | 🔲 To Do |
| Real inventory display | 🔲 To Do |
| Links to aquaticmotiv.com product pages | 🔲 To Do |
| localStorage persistence | 🔲 To Do |

### Phase 2: Intelligence (Weeks 5-8)
**Goal**: Smart recommendations and validation

| Feature | Status |
|---------|--------|
| Fish compatibility checker | 🔲 To Do |
| Bioload calculator | 🔲 To Do |
| Substrate quantity calculator | 🔲 To Do |
| CO2 requirement warnings | 🔲 To Do |
| Schooling size recommendations | 🔲 To Do |
| Product search | 🔲 To Do |
| Advanced filters | 🔲 To Do |

### Phase 3: Templates (Weeks 9-12)
**Goal**: Guided experience for beginners

| Feature | Status |
|---------|--------|
| Pre-built templates | 🔲 To Do |
| Template loading | 🔲 To Do |
| Style-based recommendations | 🔲 To Do |
| Budget planner | 🔲 To Do |
| Comparison mode | 🔲 To Do |

### Phase 4: Post-Purchase (Weeks 13-16)
**Goal**: Customer retention and repeat purchases

| Feature | Status |
|---------|--------|
| Tank dashboard | 🔲 To Do |
| Maintenance reminders | 🔲 To Do |
| Dosing calculator | 🔲 To Do |
| Reorder prompts | 🔲 To Do |
| Shareable configurations | 🔲 To Do |

---

## 9. Success Metrics

| Metric | Measurement Method | Target |
|--------|-------------------|--------|
| Configurator conversion rate | (Checkouts from configurator / Unique visitors) × 100 | 15% |
| Average configuration value | Total revenue / Number of configurations | $150+ |
| Configuration completion rate | (Completed configs / Started configs) × 100 | 60% |
| Compatibility warning heeds | (Warnings resolved / Warnings shown) × 100 | 70% |
| Return rate (configurator orders) | (Returns / Orders) × 100 | < 5% |
| Time to complete configuration | Average session duration | < 15 min |
| Mobile completion rate | Mobile checkouts / Mobile sessions | 40% |

---

## 10. Dependencies & Risks

### Dependencies

| Dependency | Owner | Risk Level |
|------------|-------|------------|
| Shopify Storefront API access (aquaticmotiv.com) | Aquatic Motiv | Low |
| Product metafield population | Aquatic Motiv | Medium |
| Metaobject setup (templates) | Aquatic Motiv | Low |
| Product photography | Aquatic Motiv | Medium |

### Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Incomplete metafield data | Degraded recommendations | High | Graceful fallbacks, admin tooling for data entry |
| Storefront API rate limits | Slow performance | Low | Caching layer, optimized queries |
| Complex compatibility rules | Incorrect recommendations | Medium | Start simple, iterate based on feedback |
| Mobile performance | Poor UX on phones | Medium | Performance budget, lazy loading |
| Inventory sync delays | Overselling | Low | Real-time inventory checks at checkout |

---

## 11. Appendix

### A. Competitive References

- [Scape It](https://scape-it.io/) - Visual aquascape editor
- [MyAquariumBuilder](https://myaquariumbuilder.com/) - AI-powered design tool
- [AqAdvisor](https://aqadvisor.com/) - Stocking calculator
- [Rotala Butterfly](https://rotalabutterfly.com/) - Dosing calculators
- [Aquarium Tracker](https://getaquariumtracker.app/) - Maintenance app

### B. Glossary

| Term | Definition |
|------|------------|
| Aquascape | Underwater landscape created in an aquarium |
| Bioload | Waste produced by fish/invertebrates relative to tank capacity |
| Hardscape | Non-living decorative elements (rocks, driftwood) |
| Iwagumi | Japanese style aquascape focused on rock arrangements |
| PAR | Photosynthetically Active Radiation (light intensity measure) |
| Substrate | Bottom layer material (soil, sand, gravel) |

---

*Document maintained by the Save A Fish team (saveafish.org).*
