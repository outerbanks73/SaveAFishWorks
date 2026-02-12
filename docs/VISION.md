# Save A Fish (saveafish.org) - Vision Document

## Executive Summary

Save A Fish is a standalone aquascaping configurator app (iOS, Android, SaaS web) hosted at saveafish.org. It guides aquarists through building complete aquascaping setups with intelligent recommendations, compatibility validation, and quantity calculations. Product data is sourced read-only from Aquatic Motiv's Shopify store (aquaticmotiv.com) via the Storefront API. Future releases will add direct cart integration for seamless checkout.

## Problem Statement

### Customer Pain Points

1. **Overwhelming Choices**: New aquascapers face 11+ product categories with hundreds of options
2. **Compatibility Uncertainty**: "Will this fish survive with my plants?" "Is my filter strong enough?"
3. **Quantity Confusion**: "How much substrate do I need?" "How many plants for my tank size?"
4. **Budget Blindness**: No visibility into total cost until checkout
5. **Post-Purchase Abandonment**: Tanks fail due to lack of maintenance guidance

### Retailer Pain Points

1. **High Support Load**: Answering repetitive compatibility/quantity questions
2. **Cart Abandonment**: Customers leave when overwhelmed
3. **Returns**: Incompatible products purchased together
4. **Low AOV**: Customers miss essential items (fertilizers, tools, CO2)

## Vision Statement

> **Enable anyone to confidently build a thriving aquascape—from first click to flourishing tank.**

We achieve this by:
- **Guiding** customers through a structured configuration flow
- **Validating** product compatibility in real-time
- **Calculating** quantities based on tank dimensions
- **Educating** with contextual tips and warnings
- **Supporting** post-purchase with maintenance tools

## Target Users

### Primary: The Aspiring Aquascaper
- Has a tank (or planning to buy one)
- Inspired by aquascaping content online
- Intimidated by the complexity
- Willing to invest but needs confidence

### Secondary: The Upgrader
- Has an existing setup
- Wants to improve or expand
- Knows basics but unsure about advanced equipment (CO2, high-tech lighting)

### Tertiary: The Gift Buyer
- Buying for someone else
- Needs curated bundles/templates
- Values "complete solution" packaging

## Competitive Landscape

| Competitor | Strength | Our Differentiation |
|------------|----------|---------------------|
| [Scape It](https://scape-it.io/) | Visual drag-drop design | We focus on configuration with real Aquatic Motiv inventory |
| [MyAquariumBuilder](https://myaquariumbuilder.com/) | AI renders, community gallery | Standalone app with real product data from aquaticmotiv.com |
| [AqAdvisor](https://aqadvisor.com/) | Stocking calculator | We combine stocking + product configuration in one flow |
| [Rotala Butterfly](https://rotalabutterfly.com/) | Dosing calculators | We recommend real products, not just formulas |
| Generic Shopify stores | Product listings | We provide guided configuration experience as a standalone app |

## Core Value Propositions

### For Customers

1. **Confidence**: "I know this will work together"
2. **Completeness**: "I won't forget anything essential"
3. **Education**: "I understand why I need each item"
4. **Value**: "I'm getting quality recommendations, not upsells"

### For Retailers

1. **Higher AOV**: Customers add more complementary products
2. **Lower Returns**: Compatibility validation prevents mistakes
3. **Reduced Support**: Self-service answers common questions
4. **Customer Loyalty**: Post-purchase tools drive repeat visits

## Strategic Pillars

### 1. Aquatic Motiv Data Integration
- Product data sourced read-only from aquaticmotiv.com via Shopify Storefront API
- Real-time stock levels and pricing
- Standalone app at saveafish.org (iOS, Android, SaaS web)
- Future: direct cart integration with aquaticmotiv.com checkout

### 2. Intelligence Layer
- Compatibility rules engine
- Quantity calculators (substrate, plants, livestock)
- Bioload validation
- Smart recommendations

### 3. Guided Experience
- Category-by-category flow
- Progress indicators
- Required vs. optional clarity
- Educational tooltips

### 4. Post-Purchase Ecosystem
- Saved tank configurations
- Maintenance reminders
- Dosing calculators
- Reorder prompts

## Success Metrics

| Metric | Current State | Target |
|--------|---------------|--------|
| Conversion Rate | Baseline | +25% |
| Average Order Value | Baseline | +40% |
| Cart Abandonment | Baseline | -30% |
| Support Tickets (compatibility) | Baseline | -50% |
| Return Rate | Baseline | -40% |
| Repeat Purchase Rate | Baseline | +35% |

## Phased Roadmap

### Phase 1: Foundation (Current)
- Product catalog with 11 categories
- Tank size and style selection
- Basic cart functionality
- Responsive design

### Phase 2: Aquatic Motiv Product Sync
- Live product sync from aquaticmotiv.com via Storefront API (read-only)
- Metafield-driven product attributes
- Real-time inventory display
- Product images from Aquatic Motiv's Shopify CDN

### Phase 3: Intelligence
- Compatibility validation
- Quantity calculators
- Bioload calculator
- Warning system

### Phase 4: Templates & Bundles
- Pre-built configurations
- Style-based recommendations
- Budget-aware suggestions
- Collection integration

### Phase 5: Post-Purchase
- Tank dashboard
- Maintenance scheduler
- Dosing calculator
- Reorder automation

### Phase 6: Visual Design (Future)
- 2D tank layout preview
- Drag-drop hardscape placement
- AI-assisted design suggestions

## Guiding Principles

1. **Inventory-First**: Never show products we can't sell
2. **Honest Recommendations**: Suggest what's right, not what's expensive
3. **Progressive Disclosure**: Simple by default, details on demand
4. **Mobile-Ready**: Many users browse on phones
5. **Accessibility**: Usable by everyone

## Open Questions

1. Should we support multiple saved configurations per customer?
2. How do we handle regional availability (livestock shipping restrictions)?
3. Should templates be curated by staff or community-submitted?
4. What level of post-purchase engagement is valuable vs. annoying?

---

*Last Updated: February 2026*
