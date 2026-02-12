# Save A Fish (saveafish.org) - Product Roadmap

## Overview

This roadmap outlines the phased development plan for Save A Fish, a standalone aquascaping configurator app (iOS, Android, SaaS web) hosted at saveafish.org. Product data is sourced read-only from Aquatic Motiv (aquaticmotiv.com) via the Shopify Storefront API. Features are prioritized based on user value, technical dependencies, and competitive differentiation.

---

## Current State (Completed)

### Foundation - Phase 0 ✅

| Feature | Status | Notes |
|---------|--------|-------|
| Next.js 14 project setup | ✅ Complete | TypeScript, App Router |
| 11 product categories | ✅ Complete | Full aquascaping taxonomy |
| Tank setup (size/style) | ✅ Complete | Predefined + custom dimensions |
| Product grid with filtering | ✅ Complete | Care level filter, sorting |
| Configuration summary | ✅ Complete | Real-time pricing |
| Responsive design | ✅ Complete | Desktop/tablet/mobile |
| Sample product data | ✅ Complete | 40+ products across categories |
| Documentation | ✅ Complete | VISION.md, PRD.md |

---

## Phase 1: Aquatic Motiv Product Sync (Priority: P0)

**Goal**: Connect read-only to aquaticmotiv.com product data and build standalone configurator

**Timeline**: Weeks 1-4

### Features

| Feature | Priority | Dependency | Effort |
|---------|----------|------------|--------|
| Storefront API client setup (read-only) | P0 | Environment variables | S |
| Product fetching with metafields from aquaticmotiv.com | P0 | API client | M |
| Real-time inventory display | P0 | Product fetching | S |
| Product images from aquaticmotiv.com Shopify CDN | P0 | Product fetching | S |
| Links to aquaticmotiv.com product pages | P0 | Product fetching | S |
| localStorage persistence | P0 | None | S |
| Configuration restore on reload | P0 | localStorage | S |

### Technical Requirements

**Environment Variables**:
```
NEXT_PUBLIC_SHOPIFY_DOMAIN=aquaticmotiv.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=xxxxx
```

**Aquatic Motiv Shopify Admin Setup**:
1. Create Storefront API access token (read-only)
2. Configure metafield definitions (see PRD Section 5.1)
3. Populate product metafields

### Success Criteria
- [ ] Products load from aquaticmotiv.com within 2 seconds
- [ ] Inventory levels reflect Aquatic Motiv admin
- [ ] Product links point to correct aquaticmotiv.com pages
- [ ] Configuration persists across browser sessions

---

## Phase 2: Intelligence Layer (Priority: P1)

**Goal**: Add smart recommendations and compatibility validation

**Timeline**: Weeks 5-8

### Features

| Feature | Priority | Dependency | Effort |
|---------|----------|------------|--------|
| Fish temperature compatibility | P1 | Metafield data | M |
| Fish pH compatibility | P1 | Metafield data | M |
| Fish temperament compatibility | P1 | Metafield data | M |
| Bioload calculator | P1 | Tank size, fish selection | M |
| Bioload warning (>100%) | P1 | Bioload calculator | S |
| CO₂ requirement warnings | P1 | Plant/CO2 selection | S |
| Substrate quantity calculator | P1 | Tank dimensions | S |
| Filter flow rate recommendations | P1 | Tank size | S |
| Schooling size recommendations | P1 | Fish metafields | S |
| Product search | P1 | None | M |
| Advanced filters (light, CO₂, placement) | P1 | Metafield data | M |

### Compatibility Rules Engine

```typescript
// Example compatibility check structure
interface CompatibilityResult {
  compatible: boolean;
  severity: 'info' | 'warning' | 'error';
  message: string;
  recommendation?: string;
}

// Temperature overlap check
function checkTemperatureCompatibility(fish: Fish[]): CompatibilityResult

// pH overlap check
function checkPHCompatibility(fish: Fish[]): CompatibilityResult

// Temperament check
function checkTemperamentCompatibility(fish: Fish[]): CompatibilityResult

// Bioload check
function checkBioload(tankSize: number, fish: Fish[]): CompatibilityResult
```

### Calculator Formulas

| Calculator | Formula |
|------------|---------|
| Substrate (liters) | `(L × W × depth_inches) / 60` |
| Filter GPH | `tank_gallons × 4` (minimum) to `× 6` (planted) |
| Bioload % | `Σ(fish_bioload × quantity) / tank_capacity × 100` |

### Success Criteria
- [ ] Incompatible fish combinations show warnings
- [ ] Bioload displays as percentage with color coding
- [ ] CO₂ warning appears when demanding plants added without CO₂
- [ ] Search returns relevant results within 200ms
- [ ] All calculators provide actionable recommendations

---

## Phase 3: Templates & Guided Experience (Priority: P1)

**Goal**: Reduce decision fatigue for beginners

**Timeline**: Weeks 9-12

### Features

| Feature | Priority | Dependency | Effort |
|---------|----------|------------|--------|
| Pre-built configuration templates | P1 | Shopify metaobjects | M |
| Template gallery UI | P1 | Templates data | M |
| Load template into configuration | P1 | Template gallery | S |
| Modify loaded template | P1 | Load template | S |
| Style-based recommendations | P2 | Templates, style selection | M |
| Budget planner input | P2 | None | S |
| Over/under budget indicator | P2 | Budget input, cart total | S |
| Cost breakdown by category | P2 | Cart data | M |
| Product comparison mode | P2 | None | L |
| Comparison table UI | P2 | Comparison mode | M |

### Template Examples

| Template Name | Style | Tank Size | Difficulty | Products |
|---------------|-------|-----------|------------|----------|
| Beginner Nature 20G | Nature | 20 gal | Beginner | ~12 items |
| Iwagumi 60P | Iwagumi | 17 gal | Intermediate | ~8 items |
| Dutch Garden 40B | Dutch | 40 gal | Advanced | ~20 items |
| Nano Shrimp Paradise | Nature | 5 gal | Beginner | ~10 items |
| Blackwater Biotope | Biotope | 29 gal | Intermediate | ~15 items |

### Shopify Metaobject: `aquascape_template`

```json
{
  "name": "Beginner Nature 20G",
  "description": "Perfect starter setup with easy plants and hardy fish",
  "style": "nature",
  "tank_size": 20,
  "difficulty": "beginner",
  "products": ["gid://shopify/Product/123", "gid://shopify/Product/456"],
  "image": "cdn.shopify.com/templates/beginner-nature.jpg"
}
```

### Success Criteria
- [ ] At least 5 templates available at launch
- [ ] Template loads all products in <1 second
- [ ] Users can modify any template product
- [ ] Budget indicator updates in real-time
- [ ] Comparison shows up to 3 products side-by-side

---

## Phase 4: Post-Purchase Experience (Priority: P2)

**Goal**: Drive retention and repeat purchases

**Timeline**: Weeks 13-16

### Features

| Feature | Priority | Dependency | Effort |
|---------|----------|------------|--------|
| Tank dashboard (saved config) | P2 | Customer accounts | M |
| View purchased configuration | P2 | Shopify order data | M |
| Maintenance schedule | P2 | Product data | M |
| Reminder notifications | P3 | Maintenance schedule | M |
| Dosing calculator | P3 | Fertilizer products | M |
| Reorder consumables button | P3 | Order history | S |
| Shareable configuration URL | P2 | Configuration state | M |
| Configuration export (PDF/list) | P3 | Configuration state | M |

### Maintenance Schedule Logic

| Product Type | Maintenance Task | Frequency |
|--------------|------------------|-----------|
| Filter | Clean/replace media | Monthly |
| Filter | Replace cartridge | 4-6 weeks |
| Lighting | Check bulb output | 6 months |
| CO₂ | Refill tank | Based on usage |
| Fertilizer | Reorder | Based on dosing |
| Water | Water change | Weekly |

### Success Criteria
- [ ] Customers can view past configurations
- [ ] Maintenance reminders are relevant to purchased products
- [ ] Dosing calculator matches purchased fertilizer types
- [ ] Reorder adds correct products to cart
- [ ] Shared links load full configuration

---

## Phase 5: Advanced Features (Priority: P3)

**Goal**: Differentiate with innovative features

**Timeline**: Future (post-launch)

### Potential Features

| Feature | Value | Effort | Consider When |
|---------|-------|--------|---------------|
| 2D tank layout preview | High | XL | User research confirms demand |
| Drag-drop hardscape placement | High | XL | After 2D preview |
| AI "complete my setup" | Medium | L | API capabilities mature |
| Community configuration sharing | Medium | L | User base established |
| Multi-language support | Medium | M | International expansion |
| Dark mode | Low | S | User requests |
| AR tank preview | Low | XL | Mobile app version |

---

## Technical Debt & Infrastructure

### Ongoing Improvements

| Item | Priority | Notes |
|------|----------|-------|
| Unit tests for calculators | P1 | Critical for accuracy |
| Integration tests for Shopify | P1 | Prevent checkout failures |
| Error boundaries | P1 | Graceful degradation |
| Performance monitoring | P2 | Track Core Web Vitals |
| Accessibility audit | P2 | WCAG 2.1 AA compliance |
| Bundle size optimization | P2 | Code splitting, lazy loading |

### Infrastructure Needs

| Item | Phase | Notes |
|------|-------|-------|
| Vercel deployment (saveafish.org) | Phase 1 | Custom domain |
| Environment variable management | Phase 1 | Secrets for API tokens |
| Error tracking (Sentry) | Phase 1 | Production monitoring |
| Analytics | Phase 2 | Track funnel conversion |
| CDN for assets | Phase 1 | Shopify CDN for products |

---

## Dependencies & Blockers

### External Dependencies

| Dependency | Owner | Risk | Mitigation |
|------------|-------|------|------------|
| Storefront API access (read-only) | Aquatic Motiv | Low | Standard Shopify feature |
| Product metafield population | Aquatic Motiv | High | Provide CSV template, admin guide |
| Product photography | Aquatic Motiv | Medium | Placeholder images, emoji fallback |
| Metaobject creation | Aquatic Motiv | Low | Provide setup guide |

### Technical Blockers

| Blocker | Impact | Resolution |
|---------|--------|------------|
| Missing metafields | Degraded recommendations | Graceful fallbacks |
| API rate limits | Slow performance | Caching layer |
| Large product catalog | Memory issues | Pagination, virtualization |

---

## Success Metrics by Phase

### Phase 1 Metrics
- Page load time < 2.5s
- Checkout success rate > 95%
- Cart abandonment < 40%

### Phase 2 Metrics
- Compatibility warnings shown on 30%+ of configs
- Warning resolution rate > 70%
- Search usage > 50% of sessions

### Phase 3 Metrics
- Template usage > 25% of new users
- Average configuration value +20%
- Time to first add < 2 minutes

### Phase 4 Metrics
- Return user rate > 30%
- Reorder rate > 15%
- Shared configuration clicks > 5%

---

## Release Checklist

### Pre-Launch (Phase 1)
- [ ] Read-only Storefront API connected to aquaticmotiv.com and tested
- [ ] All Aquatic Motiv products have required metafields
- [ ] Product links to aquaticmotiv.com verified
- [ ] Mobile experience verified (iOS, Android)
- [ ] Error handling tested
- [ ] Performance benchmarks met
- [ ] Analytics tracking implemented
- [ ] saveafish.org deployment verified

### Post-Launch Monitoring
- [ ] Error rates < 1%
- [ ] API response times < 2s (aquaticmotiv.com Storefront API)
- [ ] User engagement analysis
- [ ] User feedback collection
- [ ] Weekly metrics review

---

*Roadmap maintained by the Save A Fish team (saveafish.org).*
*Last updated: February 2026*
