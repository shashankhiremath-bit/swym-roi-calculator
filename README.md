# Swym Revenue Opportunity Calculator

A web calculator that shows a Shopify merchant what Swym Wishlist Plus or Back in Stock could earn
for their store, which Swym plan fits their usage, and the return for each $1 of plan cost.

Live site: https://shashankhiremath-bit.github.io/swym-roi-calculator/

Full product and logic specification: [`docs/SPEC.md`](docs/SPEC.md)

## What it does

1. The merchant picks a calculator: Wishlist Plus, Back in Stock, or a side-by-side comparison.
2. The merchant enters three inputs: monthly sessions, average order value (USD), and store category.
3. The calculator shows:
   - a monthly revenue range, from **Quick wins** to **Full implementation**
   - a breakdown by revenue line (for example wishlist reminders, save for later, conversion uplift)
   - the matched Swym plan, its price, and the return per $1

The logic follows the Swym Impact Estimator at its conservative setting: every revenue line is
multiplied by 0.7. See [`docs/SPEC.md`](docs/SPEC.md) for each formula and each benchmark.

## Inputs

| Input | Default | Where the merchant finds it |
| --- | --- | --- |
| Monthly sessions | 50,000 | Shopify Analytics, Reports, Sessions |
| Average order value | $75 | Shopify Analytics, average order value |
| Store category | Other | One of 7 categories; each sets its own engagement and AOV lift |

A merchant can also open "Refine your assumptions" and enter their own monthly counts. The
calculator then uses those counts in place of the benchmark rates.

## Run it locally

Requirements: Node.js 18 or later.

```bash
npm install
npm run dev
```

Open http://localhost:5173/. To go straight to one calculator, use
`#calculator/wishlist` or `#calculator/back-in-stock` at the end of the URL.

## Build and deploy

```bash
npm run build     # writes the static site to dist/
npm run preview   # serves dist/ locally to check the build
npm run deploy    # builds, then pushes dist/ to the gh-pages branch (the live site)
```

`vite.config.js` sets `base: "./"`, so the build works under the GitHub Pages project URL.

A GitHub Actions workflow (`.github/workflows/build.yml`) builds the site on every pull request and
every push to `main`. Deploying stays a manual step (`npm run deploy`).

## Project structure

| Path | What it holds |
| --- | --- |
| `src/SwymRevenueCalculator.jsx` | The whole app: rates, plan table, `computeScenario()`, `compute()`, and all page sections |
| `src/main.jsx` | React entry point |
| `src/index.css` | Tailwind directives |
| `docs/SPEC.md` | Product and logic specification |
| `index.html` | Page shell |

Where the logic lives in `src/SwymRevenueCalculator.jsx`:

| Name | What it does |
| --- | --- |
| `CONFIDENCE` | The 0.7 conservative multiplier |
| `CATEGORIES` | The 7 store categories and their profiles |
| `MODES` | Per-product copy, plan prices and monthly caps |
| `computeScenario()` | Runs the revenue lines once, for Quick wins or Full implementation |
| `compute()` | Runs both scenarios, matches the plan, and calculates return per $1 |

## Known gaps

- The lead form does not send data yet. The HubSpot portal ID and form GUID are placeholders.
- "Book a demo" buttons go to the getswym.com homepage. The real demo link is not set.
- Some marketing figures on the page do not have a named source yet.
- Prices are in USD only.

## Tech stack

React 18, Vite 5, Tailwind CSS 3, lucide-react icons. No backend: all math runs in the browser.
