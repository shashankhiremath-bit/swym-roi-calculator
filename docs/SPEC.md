# Swym Revenue Opportunity Calculator: Specification

Version 3, 2026-10-06. Revenue now uses the ROI model shared with Swym Intent Yield.

The calculator shows a Shopify merchant which Swym plan fits their store, what it costs, and the
possible return. Revenue uses the same ROI model as Swym Intent Yield, from two inputs: monthly
sessions and average order value. Store category sets plan usage only.

## 1. Goal and journey

| Item | Decision |
| --- | --- |
| Goal | Show a merchant the right plan, its price, and the possible return. |
| Primary placement | The getswym.com pricing page, or a "Tools" entry in the website footer, or a standalone page. |
| Secondary placement | Related product pages (Wishlist Plus, Back in Stock) and other high-intent pages. |
| Intent Yield | A separate tool. `src/roiModel.js` is a copy of Intent Yield's `src/roi.ts` (commit dfb15d8215c1), so both tools show the same numbers for the same sessions and AOV. A merchant can also enter a store URL and get the estimate from Intent Yield's API. |
| Shopify App Store | Not in the initial strategy. |

Journey: high-intent page, calculator, plan and pricing, ROI, lead, install or demo.

1. **Entry.** The merchant opens the calculator from the pricing page, the footer, or a product page. A share link can carry `visitors`, `aov`, `category` and `mode`.
2. **Inputs.** The merchant picks Wishlist Plus or Back in Stock, then enters sessions, AOV and category.
3. **Plan and pricing.** The page shows the matched plan, its price, and usage against the plan cap.
4. **ROI.** The page shows the monthly range, the breakdown by revenue line, and the return per $1.
5. **Lead.** The merchant enters name, store and work email. The lead goes to HubSpot.
6. **Install or demo.** "Install on Shopify" for self-serve plans, "Book a demo" for all plans, "Speak to our team" for Enterprise.

## 2. Why this logic

Before this version, Swym had more than one ROI formula, and they gave different answers for the
same store. A review of the older logic found these defects:

1. No revenue input.
2. An SMS subscriber count was collected but added $0 to every revenue line.
3. Email platform selection was single-select, but many merchants run more than one platform.
4. Email platform = "none" still showed flow revenue.
5. A "Meta" feature was missing.
6. Number inputs showed comma placeholders but did not accept commas.
7. Hidden numbers: an unexplained `* 0.5` on the Back in Stock line, and fixed wishlist assumptions that the page did not show.
8. AOV lift was applied to every line, including Back in Stock purchases, which are usually single items.
9. Revenue was counted twice: feature lines are already conversions, and conversion uplift added more revenue on the same sessions.

Version 2 fixed 7 and 8 and partly fixed 9. Version 3 adopts Intent Yield's model so both tools
match, and that model still has defects 7, 8 and 9: a fixed 0.5 / 0.3 split between back-in-stock
and price-drop sends, the Swym AOV lift on Back in Stock orders, and conversion uplift added on top
of the feature lines. Fixing them now means changing Intent Yield's `src/roi.ts` first, then copying
it here. Defects 2, 3 and 4 do not apply, because the page does not ask for those inputs. Defects 1,
5 and 6 are open.

## 3. Inputs

| Input | Default | Notes |
| --- | --- | --- |
| Monthly sessions | 50,000 | From Shopify Analytics, Reports, Sessions |
| Average order value | $75 | USD only. Intent Yield's model uses $100 when it is 0 |
| Store category | Other | 7 one-tap chips. Sets plan usage only |
| Store URL | empty | Optional. When given, the estimate comes from Intent Yield's API |

Model inputs that the page does not ask for use Intent Yield's fallbacks: 2.5% industry average
conversion rate, Swym AOV = AOV x 1.28, wishlisted value and back-in-stock subscribers estimated
from sessions, and no current Swym revenue.

## 4. Revenue logic

All benchmarks are Intent Yield's `ROI_BENCHMARKS`. Swym sessions = sessions x 4%.

| Line | Formula |
| --- | --- |
| Wishlist reminders | Swym sessions x 25% save x Swym AOV x 4% recovered |
| Save for later | (Swym sessions x 25%) x 20% use it x 5% CVR x Swym AOV x 15% sent |
| Back in stock | sessions x 0.5% subscribers x 15% sent x 0.5 x 18% CVR x Swym AOV |
| Price drop | sessions x 0.5% subscribers x 15% sent x 0.3 x 11% CVR x Swym AOV |
| Conversion uplift | Swym sessions x (8% - 2.5%) gap x gap share x Swym AOV |

The gap share is 20% for **Quick wins** and 50% for **Full implementation**. The headline is new
revenue: Intent Yield's `uplift`, which leaves out its estimate of revenue the store already earns.

**Wishlist Plus mode** shows wishlist reminders, save for later, back in stock and price drop
together, and conversion uplift. **Back in Stock mode** shows only the back-in-stock line.

### Category profiles (plan usage only)

| Category | Wishlist engagement | Back in Stock weight |
| --- | --- | --- |
| Fashion & Apparel | 5.5% | 0.9 |
| Jewelry & Accessories | 6.0% | 0.6 |
| Electronics & Tech | 4.5% | 0.8 |
| Home & Garden | 5.0% | 0.5 |
| Sports & Outdoor | 4.5% | 0.7 |
| Beauty & Personal Care | 5.0% | 0.75 |
| Other | 4.5% | 0.65 |

### Plan match

Wishlist actions = sessions x category engagement x 2.5 items. Back in Stock requests = sessions x
0.5% x category weight. The plan is the cheapest one whose monthly cap covers the usage. Above
25,000 a month, the plan is Enterprise, with no price shown. Return per $1 = monthly revenue / plan
price.

| Product | Plan | Price (USD/mo) | Monthly cap |
| --- | --- | --- | --- |
| Wishlist Plus | Starter | 29.99 | 3,000 actions |
| Wishlist Plus | Pro (Shopify Plus) | 59.99 | 10,000 actions |
| Wishlist Plus | Premium (Shopify Plus) | 99.99 | 25,000 actions |
| Back in Stock | Free | 0 | 50 requests |
| Back in Stock | Starter | 19.99 | 1,000 requests |
| Back in Stock | Pro | 59.99 | 10,000 requests |
| Back in Stock | Premium | 99.99 | 25,000 requests |

### Worked example

50,000 sessions and $75 AOV. Revenue is the same for every category: Wishlist Plus $4,547 (quick
wins) to $7,715 (full implementation), Back in Stock $324. By line: wishlist reminders $1,920, save
for later $72, back in stock and price drop $443, conversion uplift $2,112 (quick) or $5,280 (full).

| Category | Wishlist actions | Plan | Return per $1 | BIS requests | BIS plan | BIS return per $1 |
| --- | --- | --- | --- | --- | --- | --- |
| Fashion & Apparel | 6,875 | Pro | 75.8x to 128.6x | 225 | Starter | 16.2x |
| Jewelry & Accessories | 7,500 | Pro | 75.8x to 128.6x | 150 | Starter | 16.2x |
| Home & Garden | 6,250 | Pro | 75.8x to 128.6x | 125 | Starter | 16.2x |
| Beauty & Personal Care | 6,250 | Pro | 75.8x to 128.6x | 188 | Starter | 16.2x |
| Other | 5,625 | Pro | 75.8x to 128.6x | 163 | Starter | 16.2x |
| Sports & Outdoor | 5,625 | Pro | 75.8x to 128.6x | 175 | Starter | 16.2x |
| Electronics & Tech | 5,625 | Pro | 75.8x to 128.6x | 200 | Starter | 16.2x |

## 5. Page design

The brand stays the same: navy `#172B4D`, lime `#B5E56A`, the Figtree font.

### Results

| Part | Design |
| --- | --- |
| Input card | Sessions and AOV side by side, category as one-tap chips, "Refine your assumptions" below. The card stays in view on desktop. |
| Results headline | The range in large type, the yearly figure in one sentence under it. |
| Breakdown | One bar split by revenue line, a Quick wins / Full implementation toggle, a list with each line's share and dollars, and the count path in one line. |
| Plan fit | A navy band inside the results: plan, price, return per $1, and the plans as equal segments with a usage marker inside the matched plan. |
| Motion | Only the bar and the marker move when an input changes. Reduced-motion settings turn it off. |
| Mobile | Checked at 390 px wide; no horizontal overflow. |

### Landing page

The landing page uses real Swym product images from getswym.com, not drawn illustrations.

| Section | Image |
| --- | --- |
| Hero | Wishlist Plus merchant dashboard, with a product card over it and a "Wishlist revenue, last 7 days" tag |
| Wishlist card | Wishlist page and add to wishlist button |
| Back in Stock card | Notify me when available form on an out of stock product |
| Compare card | Save for later option in a cart |
| Why intent matters | Back in stock flow: storefront sign-up, then the email when the item returns |

Rules for images:

- Use only Swym's own product images from the getswym.com CDN. Do not use stock photos.
- Do not use images that show customer names or emails, even sample data.
- Every image has alt text that says what it shows.

## 6. Scope

**In this version:** both product modes; three inputs; the "use my own counts" override; plan
match; return per $1; the compare view; the HubSpot lead form.

**Not in this version:** price drop alerts; conversion rate and cart abandonment inputs; email
platform inputs; moderate and optimistic modes; the Shopify App Store; a store URL input;
multi-currency; the Meta feature.

## 7. Success metrics

| Type | Metric |
| --- | --- |
| Output | Qualified calculator leads per week (Shopify store, valid email). Target set after a 2-week baseline. |
| Output | Installs within 30 days from calculator leads, compared with pricing-page leads |
| Input | Estimates viewed, lead form completion, install and demo clicks, by placement and category |
| Guardrail | 0 mismatches between the calculator and Intent Yield for the same inputs. `test/roiModel.check.mjs` checks this against the live API |
| Guardrail | Pricing-page install conversion does not drop after the embed |

The `swym_calc_estimate` analytics event carries `category`.

## 8. Known gaps and open questions

Known gaps:

- The HubSpot portal ID and form GUID are placeholders, so the lead form sends nothing.
- "Book a demo" goes to the getswym.com homepage.
- Some marketing figures on the page ("97% of shoppers", "41 days", "31%", "$63") have no named source yet.
- The benchmarks are industry figures, not calibrated against Swym merchant data.
- The browser cannot call Intent Yield's API from this site yet: the API does not allow cross-origin requests from it. Local dev uses a proxy.
- For a store that is a Swym customer, Intent Yield's API may use the store's own data, so its figure can differ from the calculator's benchmark estimate.

Open questions:

1. Show plan, price and ROI before the lead form, and gate only the emailed report?
2. Standalone site, or the getswym.com footer "Tools" section?
3. Take save for later orders out of the conversion uplift pool?
4. Is "engaged shoppers x 2.5 items" the right usage model for the plan match?
5. What is the "Meta" feature, and is it in scope?
6. Add price drop alerts later (needs email list size and discounting)?
