# Swym Revenue Opportunity Calculator: Specification

Version 2, 2026-09-30.

The calculator shows a Shopify merchant which Swym plan fits their store, what it costs, and the
possible return. It uses the Swym Impact Estimator logic at its conservative setting, with three
inputs: monthly sessions, average order value, and store category.

## 1. Goal and journey

| Item | Decision |
| --- | --- |
| Goal | Show a merchant the right plan, its price, and the possible return. |
| Primary placement | The getswym.com pricing page, or a "Tools" entry in the website footer, or a standalone page. |
| Secondary placement | Related product pages (Wishlist Plus, Back in Stock) and other high-intent pages. |
| Intent Yield | A separate tool. It uses the same ROI logic, so both tools show the same numbers for the same inputs. |
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

This version fixes 7 and 8 and partly fixes 9 (see section 4). Defects 2, 3 and 4 do not apply,
because the page does not ask for those inputs. Defects 1, 5 and 6 are open.

## 3. Inputs

| Input | Default | Notes |
| --- | --- | --- |
| Monthly sessions | 50,000 | From Shopify Analytics, Reports, Sessions |
| Average order value | $75 | USD only |
| Store category | Other | 7 one-tap chips |

Estimator inputs that the page does not ask for use the estimator's own fallbacks:

| Estimator input | Value used | Effect |
| --- | --- | --- |
| Store conversion rate | 2.5% industry average | Sizes wishlist purchases, carts and the CVR gap |
| Cart abandonment rate | 70% industry average | Sizes save for later |
| Active cart abandonment flow | No | Save for later is not cut to the 45% incremental share |
| Out-of-stock products | Yes, in Back in Stock mode | Back in Stock runs |
| Email list size, discounting | Not used | Price drop alerts are not in this version |
| Confidence mode | Conservative (0.7) | Moderate and optimistic modes are not shown |

## 4. Revenue logic

Every line is multiplied by 0.7 (conservative confidence).

**Wishlist Plus mode** has three lines. Swym AOV = AOV x (1 + category AOV lift). Swym AOV
applies to wishlist lines only.

| Line | Formula |
| --- | --- |
| Engaged shoppers | sessions x category engagement % |
| Wishlist reminders | engaged x 7.5% buy x Swym AOV x 2.5 items x 4% recovered x 0.7 |
| Save for later | abandoned carts x (18% x SFL weight) captured x 15% sent x 7% CVR x Swym AOV x 0.7 |
| Conversion uplift | engaged shoppers who did not buy x (8% - 2.5%) gap x uplift weight x gap share x Swym AOV x 0.7 |

The gap share is 20% for **Quick wins** and 50% for **Full implementation**. The headline is the
range between the two.

Conversion uplift leaves out shoppers already counted as wishlist purchases. It does not yet
leave out save for later orders (open question 3).

**Back in Stock mode** has one line: subscribers (sessions x 0.5% x BIS weight) x 15% sent x 50%
restocked x 18% CVR x **store AOV** x 0.7.

### Category profiles

| Category | Engagement | AOV lift | Uplift weight | BIS weight | SFL weight |
| --- | --- | --- | --- | --- | --- |
| Fashion & Apparel | 5.5% | 30% | 1.2 | 0.9 | 0.9 |
| Jewelry & Accessories | 6.0% | 25% | 1.0 | 0.6 | 0.8 |
| Electronics & Tech | 4.5% | 20% | 0.9 | 0.8 | 0.85 |
| Home & Garden | 5.0% | 28% | 1.0 | 0.5 | 0.9 |
| Sports & Outdoor | 4.5% | 22% | 0.9 | 0.7 | 0.85 |
| Beauty & Personal Care | 5.0% | 18% | 1.0 | 0.75 | 0.85 |
| Other | 4.5% | 24% | 1.0 | 0.65 | 0.8 |

### Plan match

Wishlist actions = engaged shoppers x 2.5 items. Back in Stock requests = subscribers. The plan is
the cheapest one whose monthly cap covers the usage. Above 25,000 a month, the plan is Enterprise,
with no price shown. Return per $1 = monthly revenue / plan price.

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

50,000 sessions and $75 AOV. Every category matches Pro for Wishlist Plus and Starter for Back in
Stock.

| Category | Wishlist, quick wins | Wishlist, full | Wishlist actions | Return per $1 (Pro) | Back in Stock | BIS requests |
| --- | --- | --- | --- | --- | --- | --- |
| Fashion & Apparel | $3,953 | $7,391 | 6,875 | 65.9x to 123.2x | $159 | 225 |
| Jewelry & Accessories | $3,697 | $6,702 | 7,500 | 61.6x to 111.7x | $106 | 150 |
| Home & Garden | $3,219 | $5,784 | 6,250 | 53.7x to 96.4x | $89 | 125 |
| Beauty & Personal Care | $2,955 | $5,319 | 6,250 | 49.3x to 88.7x | $133 | 188 |
| Other | $2,804 | $5,040 | 5,625 | 46.7x to 84.0x | $115 | 163 |
| Sports & Outdoor | $2,626 | $4,605 | 5,625 | 43.8x to 76.8x | $124 | 175 |
| Electronics & Tech | $2,583 | $4,530 | 5,625 | 43.1x to 75.5x | $142 | 200 |

Fashion, full implementation, by line: conversion uplift $5,729, wishlist reminders $1,408, save
for later $254.

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
| Guardrail | 0 mismatches between the calculator and Intent Yield for the same inputs |
| Guardrail | Pricing-page install conversion does not drop after the embed |

The `swym_calc_estimate` analytics event carries `category`.

## 8. Known gaps and open questions

Known gaps:

- The HubSpot portal ID and form GUID are placeholders, so the lead form sends nothing.
- "Book a demo" goes to the getswym.com homepage.
- Some marketing figures on the page ("97% of shoppers", "41 days", "31%", "$63") have no named source yet.
- The benchmarks are industry figures, not calibrated against Swym merchant data.

Open questions:

1. Show plan, price and ROI before the lead form, and gate only the emailed report?
2. Standalone site, or the getswym.com footer "Tools" section?
3. Take save for later orders out of the conversion uplift pool?
4. Is "engaged shoppers x 2.5 items" the right usage model for the plan match?
5. What is the "Meta" feature, and is it in scope?
6. Add price drop alerts later (needs email list size and discounting)?
