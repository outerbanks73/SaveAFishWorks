# Session Notes: Save A Fish Development

## Session Overview

**Date**: February 2026
**Objective**: Build Save A Fish (saveafish.org), a standalone aquascaping configurator app (iOS, Android, SaaS web) with read-only product data from Aquatic Motiv (aquaticmotiv.com)

---

## Key Decisions Made

### 1. Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: CSS Modules
- **State Management**: React Context + useReducer
- **Data Source**: Aquatic Motiv (aquaticmotiv.com) via Shopify Storefront API (read-only)
- **App Domain**: saveafish.org
- **Platforms**: iOS, Android, SaaS Web

### 2. Product Categories (11 Total)
1. Substrate (active, inert, capping)
2. Rocks (Seiryu, Dragon, Lava, etc.)
3. Driftwood (Spiderwood, Manzanita, Malaysian)
4. Plants (carpet, stem, rhizome, moss, floating)
5. Lighting (LED systems)
6. Filtration (canister, HOB, sponge)
7. CO2 Systems (regulators, diffusers, liquid carbon)
8. Fertilizers (all-in-one, macros, root tabs)
9. Tools & Accessories
10. Fish
11. Invertebrates (shrimp, snails)

### 3. Tank Configuration Options
- **Predefined sizes**: 5G, 10G, 20G, 29G, 40G, 55G, 75G, 90G, 125G
- **Custom dimensions**: Length × Width × Height
- **Styles**: Nature, Iwagumi, Dutch, Biotope, Paludarium, Custom

### 4. Required vs Optional Categories
**Required**:
- Substrate
- Plants
- Lighting
- Filtration

**Optional**:
- Rocks, Driftwood, CO2, Fertilizers, Tools, Fish, Invertebrates

---

## Competitive Research Insights

### Tools Analyzed
| Tool | Category | Key Takeaway |
|------|----------|--------------|
| Scape It | Visual Design | Drag-drop interface inspiration |
| MyAquariumBuilder | AI Design | Community gallery, AI renders |
| AqAdvisor | Stocking | Bioload calculation is essential |
| FishHuddle | Compatibility | 197+ species, temp/pH checking |
| Rotala Butterfly | Dosing | EI/PPS-Pro calculators |
| Aquarium Tracker | Maintenance | Parameter tracking, reminders |

### Competitive Positioning
We differentiate by being the **bridge between planning and purchasing**:
- Competitors either visualize (Scape It) or calculate (AqAdvisor)
- We do both AND connect to real inventory AND enable checkout
- Post-purchase tools drive retention (unique in market)

---

## Architecture Decisions

### Project Structure
```
src/
├── app/                    # Next.js app router
├── components/configurator/ # UI components
├── context/                # State management
├── data/                   # Sample product data
├── lib/                    # Shopify integration
└── types/                  # TypeScript definitions
docs/
├── VISION.md              # Product vision
├── PRD.md                 # Requirements
├── COMPETITIVE_RESEARCH.md # Market analysis
└── ROADMAP.md             # Development plan
```

### State Management
- Single `ConfiguratorContext` with useReducer
- Actions: SET_TANK_SIZE, ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, etc.
- Computed values: getTotalPrice, getTotalItems, getItemsByCategory

### Aquatic Motiv Integration Pattern
1. Fetch products read-only from aquaticmotiv.com via Storefront API with metafields
2. Map Shopify product data to internal types
3. Display product links to aquaticmotiv.com for manual purchase
4. Future: Create cart via mutation and redirect to aquaticmotiv.com checkout

---

## Shopify Metafield Schema

| Namespace | Key | Purpose |
|-----------|-----|---------|
| aquascaping | category | Primary category |
| aquascaping | subcategory | Sub-classification |
| aquascaping | care_level | beginner/intermediate/advanced |
| aquascaping | light_requirement | low/medium/high |
| aquascaping | co2_required | boolean |
| aquascaping | placement | foreground/midground/background |
| aquascaping | temp_min/max | Temperature range (°F) |
| aquascaping | ph_min/max | pH range |
| aquascaping | bioload | 1-10 scale |
| aquascaping | schooling_size | Minimum school |
| aquascaping | temperament | peaceful/semi-aggressive/aggressive |

---

## Feature Prioritization

### P0 (Must Have for Launch)
- Read-only product sync from aquaticmotiv.com
- Real-time inventory from aquaticmotiv.com
- Links to aquaticmotiv.com product pages (checkout deferred)
- localStorage persistence
- Basic filtering and sorting

### P1 (High Value)
- Fish compatibility checker
- Bioload calculator
- CO2 warnings
- Product search
- Pre-built templates

### P2 (Nice to Have)
- Budget planner
- Comparison mode
- Shareable configurations
- Tank dashboard

### P3 (Future)
- 2D layout preview
- AI recommendations
- Community sharing
- Maintenance reminders

---

## Open Questions (For Future Sessions)

1. **Multi-config support**: Should users save multiple configurations?
2. **Regional restrictions**: How to handle livestock shipping limits?
3. **Template curation**: Staff-curated vs community-submitted?
4. **Engagement level**: How many reminders before it's annoying?
5. **Offline support**: Cache products for offline browsing?

---

## Action Items Completed

- [x] Set up Next.js 14 project with TypeScript
- [x] Create 11 product category types
- [x] Build sample product data (40+ products)
- [x] Implement ConfiguratorContext for state
- [x] Create all UI components
- [x] Add responsive design
- [x] Write VISION.md
- [x] Write PRD.md
- [x] Conduct competitive research
- [x] Create ROADMAP.md

---

## Next Steps

1. **Connect to Aquatic Motiv**: Set up read-only Storefront API access to aquaticmotiv.com, populate metafields
2. **Implement persistence**: localStorage save/restore
3. **Add compatibility engine**: Fish temp/pH/temperament checks
4. **Build calculators**: Substrate, bioload, filter flow
5. **Create templates**: 5+ pre-built configurations
6. **Deploy saveafish.org**: iOS, Android, and SaaS web

---

## Technical Notes

### Development Server
```bash
npm run dev
# Runs at http://localhost:3000
```

### Git Branch
```
claude/aquascaping-configurator-tool-Lejgl
```

### Key Files
| File | Purpose |
|------|---------|
| `src/types/aquascaping.ts` | All type definitions |
| `src/context/ConfiguratorContext.tsx` | Global state |
| `src/components/configurator/AquascapeConfigurator.tsx` | Main component |
| `src/lib/shopify.ts` | Shopify API helpers |
| `src/data/sampleProducts.ts` | Development data |

---

*Session notes for the Save A Fish team (saveafish.org).*
