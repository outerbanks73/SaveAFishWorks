# SaveAFishWorks

Unified aquascape configurator and content site for [aquaticmotiv.com](https://aquaticmotiv.com). Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. Connects to the live Shopify store for real product data, pricing, and checkout.

Created by merging **AquaticGrowth** (content site + Shopify integration) with **SaveAFish** (configurator domain modeling + UX features).

## Quick Install

### 1. Install Node.js

Download and install Node.js (version 18 or newer) from https://nodejs.org. Click the big green **LTS** button and run the installer.

### 2. Download the project

Clone or download this repository.

### 3. Run the installer

Open a terminal and navigate to the project folder:

**Mac/Linux:**
```
cd SaveAFishWorks
./install.sh
```

**Windows:**
```
cd SaveAFishWorks
install.bat
```

### 4. Start the site

**Mac/Linux:**
```
./start.sh
```

**Windows:**
```
start.bat
```

Open http://localhost:3000 in your browser.

### Shopify Connection (Optional)

The site works out of the box with sample product data. To use live Shopify inventory, edit `.env.local` and replace the token placeholder:

```
SHOPIFY_STORE_DOMAIN=aquaticmotiv.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your-token-here
```

Ask the project owner for the token value.

---

## For Developers

```bash
git clone <repo-url>
cd SaveAFishWorks
npm install
cp .env.local.example .env.local   # then fill in your token
npm run dev
```

### Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build (validates all static routes) |
| `npm run lint` | Run ESLint |
| `npm start` | Serve production build |

### Project Structure

```
src/
  app/           Routes (fish, guides, products, configurator, etc.)
  components/    UI components, templates, configurator
  context/       React context (ConfiguratorContext)
  data/          JSON content + MDX guides + sample products
  lib/           Data access, Shopify client, SEO, utils
  types/         TypeScript interfaces (shopify, aquascaping, content)
docs/            Vision, PRD, architecture, roadmap, competitive research, session notes
```

### Enhanced Configurator Features

- Configuration naming and save/load support
- 6 aquascape styles (Nature, Iwagumi, Dutch, Biotope, Paludarium, Custom)
- Custom tank dimensions input
- Required category indicators with icons
- Product sorting (price, name) and care level filtering
- Collapsible configuration summary with missing-required warnings
- Two-step clear confirmation
- Sticky mobile checkout footer
- 40+ sample products across 11 categories for development

### Shopify Integration

The site connects to the AquaticMotiv Shopify store via the Storefront API. Products are fetched with cursor-based pagination (250/page), cached for 24 hours, and normalized from 35 raw Shopify product types into 16 canonical categories. See `src/lib/shopify/normalize.ts` for the mapping logic.

### Content

All content lives as JSON in `src/data/`. Guides additionally have MDX files in `src/data/guides/content/`. Adding a new entry to a JSON file automatically generates its route and sitemap entry.
# SaveAFishWorks
