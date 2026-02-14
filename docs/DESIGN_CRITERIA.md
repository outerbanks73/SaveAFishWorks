# Save A Fish — Design Criteria & User Requirements

> Extracted from VISION.md, PRD.md, ROADMAP.md, ARCHITECTURE.md, COMPETITIVE_RESEARCH.md, and SESSION_NOTES.md. This is the canonical reference for any future rebuild.

---

## 1. Problem Statement

### Customer Pain Points
- **Overwhelming choices**: 11+ product categories, hundreds of options, no guidance
- **Compatibility uncertainty**: Fish-plant, fish-fish compatibility unknown to beginners
- **Quantity confusion**: How much substrate? How many plants? What filter size?
- **Budget blindness**: No visibility into total cost before checkout
- **Post-purchase abandonment**: Tanks fail without maintenance knowledge

### Retailer Pain Points
- High support load from repetitive compatibility/quantity questions
- Cart abandonment due to decision overwhelm
- Returns from incompatible product combinations
- Low average order value (customers miss essential items)

---

## 2. Vision

> "Enable anyone to confidently build a thriving aquascape — from first click to flourishing tank."

The tool should **guide**, **validate**, **calculate**, **educate**, and **support**.

---

## 3. Target Users

| Persona | Description | Needs |
|---------|-------------|-------|
| **Aspiring Aquascapers** (Primary) | Have or are planning a tank, inspired but intimidated, willing to invest | Guidance, validation, confidence |
| **Upgraders** (Secondary) | Existing setup, want improvement, know basics | Better products, compatibility checks |
| **Gift Buyers** (Tertiary) | Need curated bundles, want a complete solution | Templates, one-click packages |

---

## 4. Core Value Propositions

**For Customers**: Confidence, Completeness, Education, Value
**For Retailers**: Higher AOV (+40%), Lower Returns (-40%), Reduced Support (-50%), Customer Loyalty (+35%)

---

## 5. Product Categories (11)

| # | Category | Examples | Required? |
|---|----------|----------|-----------|
| 1 | Substrate | Active, inert, capping | Yes |
| 2 | Rocks | Seiryu, Dragon, Lava | No |
| 3 | Driftwood | Spiderwood, Manzanita, Malaysian | No |
| 4 | Plants | Carpet, stem, rhizome, moss, floating | Yes |
| 5 | Lighting | LED systems | Yes |
| 6 | Filtration | Canister, HOB, sponge | Yes |
| 7 | CO2 Systems | Regulators, diffusers, liquid carbon | No |
| 8 | Fertilizers | All-in-one, macros, root tabs | No |
| 9 | Tools & Accessories | Scissors, tweezers, nets | No |
| 10 | Fish | Community, schooling, centerpiece | No |
| 11 | Invertebrates | Shrimp, snails | No |

---

## 6. Tank Configuration Options

**Predefined sizes**: 5G, 10G, 20G, 29G, 40G, 55G, 75G, 90G, 125G
**Custom**: Length x Width x Height (with volume calculation)
**Styles**: Nature, Iwagumi, Dutch, Biotope, Paludarium, Custom

---

## 7. Functional Requirements

### Configuration Flow (P0 — Must Have)
- Select tank size (predefined or custom dimensions)
- Choose aquascape style
- Browse products by category
- See required vs optional categories
- Add products with quantity selection
- View running total cost
- Checkout via Shopify

### Smart Recommendations (P1)
- Substrate quantity calculator: `(L x W x depth) / 60` liters
- Filter flow rate: `tank_volume x 4-6` GPH
- Fish temperature range overlap validation
- Fish pH range overlap validation
- Fish temperament compatibility checking
- CO2-requiring plants warning
- Bioload calculation: `sum(fish_bioload x qty) / tank_capacity x 100`
- Bioload >100% warning
- Schooling size minimums
- Lighting wattage based on depth/plant needs (P2)

### Templates & Bundles (P1)
- Pre-built configuration templates (minimum 5)
- Load template into configuration
- Modify loaded templates freely
- Style-specific template recommendations

### Product Discovery (P1)
- Search by name
- Filter by care level (beginner/intermediate/advanced)
- Filter by light/CO2 requirements
- Stock status display
- Product comparison mode (P2)

### Budget Planning (P2)
- Budget input and tracking
- Cost breakdown by category
- Over/under budget indicator
- Budget-friendly alternative suggestions (P3)

### Configuration Management
- Auto-save to localStorage (P0)
- Restore on page reload (P0)
- Account-based save for logged-in users (P2)
- Multiple saved configurations per user (P2)
- Shareable configuration URLs (P2)
- Configuration export as PDF/list (P3)

### Post-Purchase (P2-P3)
- Purchased configuration dashboard
- Maintenance reminders (filter cleaning, water changes, CO2 refills)
- Dosing calculator
- Reorder consumables

---

## 8. Shopify Integration Requirements

### Data Source
- **Store**: aquaticmotiv.com (Shopify)
- **API**: Shopify Storefront API (GraphQL, read-only)
- **Authentication**: Custom app with Storefront API token (single-tenant, not a public Shopify app)

### What We Read
- Products with metafields
- Real-time inventory levels
- Product images from Shopify CDN
- Pricing (current and compare-at)
- Product variants

### What We Write (Future)
- Cart creation via `cartCreate` / `cartLinesAdd` mutations
- Checkout URL generation and redirect
- Line item properties for attribution

### Product Metafields (namespace: `aquascaping`)

| Key | Type | Required | Purpose |
|-----|------|----------|---------|
| `category` | string | Yes | Primary category |
| `subcategory` | string | No | Sub-classification |
| `care_level` | enum | Yes | beginner/intermediate/advanced |
| `light_requirement` | enum | No | low/medium/high |
| `co2_required` | boolean | No | CO2 dependency |
| `placement` | enum | No | foreground/midground/background/floating |
| `temp_min` | number | No | Min temperature (F) |
| `temp_max` | number | No | Max temperature (F) |
| `ph_min` | number | No | Min pH |
| `ph_max` | number | No | Max pH |
| `scientific_name` | string | No | Scientific name |
| `bioload` | number | No | 1-10 scale |
| `schooling_size` | number | No | Minimum school size |
| `temperament` | enum | No | peaceful/semi-aggressive/aggressive |
| `flow_rate` | number | No | GPH for filters |
| `wattage` | number | No | Watts for lighting |
| `tank_size_min` | number | No | Min tank gallons |
| `tank_size_max` | number | No | Max tank gallons |

### Caching Strategy
- Products and metafields: cached (infrequent changes)
- Inventory: real-time or near-real-time
- Cache invalidated via webhooks or short TTL

### Product Source Model

| Source | Integration | Products |
|--------|-------------|----------|
| Shopify (aquaticmotiv.com) | Storefront API → cart | ~678 items across all aquascaping categories |
| Amazon (affiliate) | Affiliate links | Tanks, stands, large filters, powerheads, lids, chillers |

Amazon products stored in database (not API) — name, ASIN, affiliate link, image, specs.

---

## 9. Compatibility Engine Spec

```
interface CompatibilityResult {
  compatible: boolean;
  severity: 'info' | 'warning' | 'error';
  message: string;
  recommendation?: string;
}
```

### Three Check Types
1. **Bio-Check**: Temperature overlap, pH overlap for all livestock
2. **Aggression-Check**: Species compatibility matrices
3. **Space-Check**: Bioload (filter flow + tank volume + fish bioload), zone occupancy (top/mid/bottom)

### Calculator Formulas
- **Substrate**: `(L x W x depth_inches) / 60` liters
- **Filter GPH**: `tank_gallons x 4` (min) to `x 6` (planted)
- **Bioload %**: `sum(fish_bioload x quantity) / tank_capacity x 100`

---

## 10. UI/UX Requirements

### Layout
- **Desktop (>1200px)**: 3-column — sidebar (tank/categories), main (product grid), right (configuration summary)
- **Tablet (768-1200px)**: 2-column with summary below
- **Mobile (<768px)**: Single column with sticky footer

### Product Card
- Product image with placeholder fallback
- Title and vendor
- Care level badge
- Price with compare-at price
- Variant selector
- Quantity selector
- Add to configuration button
- "In Configuration" indicator

### Configuration Summary
- Collapsible on mobile
- Items grouped by category
- Quantity controls per item
- Remove buttons
- Running subtotal
- Missing required categories warning
- Checkout button

### States & Feedback
- Loading: Skeleton placeholders
- Empty: Illustration + message
- Error: Toast notification
- Success: Brief animation
- Warning: Yellow banner
- Out of stock: Grayed + badge
- Low stock: "Only X left" badge

### Design Principles
1. **Inventory-First**: Never show products we can't sell
2. **Honest Recommendations**: Suggest what's right, not what's expensive
3. **Progressive Disclosure**: Simple by default, details on demand
4. **Mobile-Ready**: Many users browse on phones
5. **Accessibility**: WCAG 2.1 AA, keyboard navigation, screen reader support, 4.5:1 contrast

---

## 11. Non-Functional Requirements

### Performance
- Initial page load (LCP): < 2.5s
- Time to interactive: < 3.5s
- Product grid render (50 items): < 500ms
- Cart update response: < 100ms
- Shopify API response: < 2s with loading state
- Search results: < 200ms

### Browser Support
- Chrome, Firefox, Safari, Edge (last 2 versions)
- iOS Safari and Chrome for Android
- Responsive: 320px to 2560px

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatibility
- Color contrast 4.5:1 minimum

### Security
- Storefront API token as environment variable (read-only)
- No sensitive data in localStorage
- HTTPS only
- No write access to Shopify store data

### Reliability
- Graceful degradation when API unavailable
- Error boundaries prevent full-page crashes
- Offline indicator with cached data

---

## 12. Success Metrics

| Metric | Target |
|--------|--------|
| Configurator conversion rate | 15% |
| Average configuration value | $150+ |
| Configuration completion rate | 60% |
| Compatibility warning resolution | 70% |
| Return rate | < 5% |
| Time to complete configuration | < 15 min |
| Mobile completion rate | 40% |
| Average order value increase | +40% |
| Cart abandonment reduction | -30% |
| Support ticket reduction | -50% |

---

## 13. Competitive Positioning

```
              DESIGN FOCUSED
       Scape It, Aquaria Designer
       MyAquariumBuilder

           PLANNING ◄──► PURCHASING ◄──► MAINTENANCE
           AqAdvisor    Save A Fish     Aquarium Tracker
           FishHuddle   ★ OUR NICHE ★   Rotala Butterfly
           ThinkFish                    Aquarium Assistant

                            │
                            ▼
                      SHOPIFY CHECKOUT
```

**Our unique position**: Bridge between planning tools and real product data with checkout integration. Competitors either visualize OR calculate — we do both AND connect to real inventory.

### Must-Have (from competitors)
- Bioload calculator (AqAdvisor)
- Fish compatibility checking (FishHuddle, AqAdvisor)
- Color-coded warnings (ThinkFish)
- Substrate quantity calculator
- CO2 requirement warnings (Rotala Butterfly)
- Schooling size recommendations (AqAdvisor)

### Defer (competitors do better)
- 3D visualization (Aquaria Designer)
- AI rendering (MyAquariumBuilder)
- Complex parameter tracking (Aquarium Tracker)
- Advanced dosing math (Rotala Butterfly)

---

## 14. User Account Roles

| Role | Capabilities |
|------|-------------|
| Hobbyist | Use configurator, save configs, checkout, read content |
| Content Editor | Hobbyist + create/edit content |
| Admin | Editor + manage users, roles, system config |

---

## 15. Template Examples

| Template | Style | Size | Difficulty | ~Items |
|----------|-------|------|------------|--------|
| Beginner Nature 20G | Nature | 20G | Beginner | 12 |
| Iwagumi 60P | Iwagumi | 17G | Intermediate | 8 |
| Dutch Garden 40B | Dutch | 40G | Advanced | 20 |
| Nano Shrimp Paradise | Nature | 5G | Beginner | 10 |
| Blackwater Biotope | Biotope | 29G | Intermediate | 15 |

---

## 16. Open Questions (from original planning)

1. Multi-configuration support per user?
2. Regional shipping restrictions handling?
3. Staff-curated vs community-submitted templates?
4. Reminder engagement level (email, push, in-app)?
5. Offline product caching strategy?
6. **NEW: Native Shopify app vs standalone vs embeddable widget?**
7. **NEW: Separate CMS (WordPress/wiki) vs built-in content management?**
8. **NEW: Single Shopify export vs live API integration?**

---

## 17. Deployment & Infrastructure

- **Domain**: saveafish.org
- **Hosting**: Hetzner VPS (not Vercel)
- **Requirements**: Node.js runtime, reverse proxy (nginx/Caddy), SSL (Let's Encrypt), process manager (PM2/systemd), PostgreSQL
- **Shopify store**: aquaticmotiv.com (separate Shopify-hosted)
- **Analytics**: GA4 cross-domain, UTM parameters, Shopify line item attribution
- **Email**: Klaviyo integration (capture, segmentation, automated flows)
