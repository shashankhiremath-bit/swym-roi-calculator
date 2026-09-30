import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Heart,
  Bell,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Scale,
  Menu,
  X,
  Star,
  Sparkles,
  BarChart3,
  MousePointerClick,
  BookOpen,
} from "lucide-react";

/**
 * Swym Revenue Opportunity Calculator (v3, Prototype 1)
 * Full page in getswym.com visual language: header, hero, animated heart, calculator,
 * plan match + ROI, demo/install CTAs, real case studies, footer.
 * Logic: sessions, AOV, store category -> Impact Estimator drivers -> plan match -> ROI. Client side only.
 * Tracking: pushes swym_calc_* events to window.dataLayer (GTM).
 */

const LOGO_SRC = "data:image/png;base64,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";
const SWYM = "https://www.getswym.com";
const DEMO_URL = SWYM + "/"; // PLACEHOLDER, flagged again in code review: every "Book a demo" /
// "Speak to our team" button currently just goes to the homepage. Swap in the real booking link
// (Calendly, HubSpot meetings, etc.) before this goes live anywhere.

// HubSpot Forms API, unauthenticated v3 submit endpoint. This endpoint explicitly supports
// cross-origin (CORS) requests, so it can be called directly from the browser, no backend
// needed. PLACEHOLDER VALUES: someone with HubSpot admin access needs to (1) create a form in
// HubSpot with fields matching firstname/company/email as real contact properties, then (2)
// replace these two constants with that form's real portal ID and form GUID. Until then,
// submission is skipped gracefully and the calculator's own lead-gate still works locally.
const HUBSPOT_PORTAL_ID = "YOUR_PORTAL_ID";
const HUBSPOT_FORM_GUID = "YOUR_FORM_GUID";

function getHubspotTrackingCookie() {
  // Links this submission to HubSpot's own visitor-tracking cookie, if HubSpot's tracking script
  // is already loaded on the page this calculator is embedded in. Safe to omit, HubSpot just
  // won't attribute the submission to prior page views on this device.
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/(?:^|; )hubspotutk=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

async function submitToHubSpot({ name, store, email }) {
  if (HUBSPOT_PORTAL_ID === "YOUR_PORTAL_ID" || HUBSPOT_FORM_GUID === "YOUR_FORM_GUID") {
    return { skipped: true, reason: "HubSpot portal/form not configured yet" };
  }
  const [firstname, ...rest] = name.trim().split(" ");
  const lastname = rest.join(" ");
  const fields = [
    { name: "firstname", value: firstname || name },
    { name: "email", value: email },
  ];
  if (lastname) fields.push({ name: "lastname", value: lastname });
  if (store) fields.push({ name: "company", value: store });
  const body = {
    fields,
    context: {
      pageUri: typeof window !== "undefined" ? window.location.href : undefined,
      pageName: "Swym ROI Calculator",
      hutk: getHubspotTrackingCookie(),
    },
  };
  try {
    const res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return { skipped: false, ok: false, status: res.status };
    return { skipped: false, ok: true };
  } catch (e) {
    // Network/CORS failure: never block the calculator's own lead-capture UX on this.
    return { skipped: false, ok: false, error: true };
  }
}
const UTM = "?utm_source=calculator&utm_medium=website&utm_campaign=roi_calculator";

// Currency is intentionally USD-only. A selector previously changed the displayed symbol without
// converting any underlying values, since plan prices are fixed in USD, that produced a real bug:
// entering an AOV in, say, INR and selecting the rupee symbol left the number treated as if it
// were still dollars, so ROI (revenue / a USD plan price) came out roughly 80x too high. Flagged
// in a code review, confirmed, fixed by removing the selector rather than faking a conversion
// rate this tool has no way to keep current.

// Revenue logic ported from the Swym Impact Estimator (Jacob's estimator, 2026-09), per the eng
// team's direction to use one ROI logic across tools. Only the drivers computable from this
// page's three inputs (sessions, AOV, store category) are used. Inputs the estimator asks for and
// this page does not (conversion rate, cart abandonment rate) use the estimator's own fallbacks.
// Price drop alerts are left out: they need an email list size and a discounting strategy.
// All estimates use the estimator's "conservative" confidence mode.
const CONFIDENCE = 0.7;

// Per-category profile, copied from the estimator. wlEng: % of sessions that engage with the
// wishlist. bisRel / sflRel: relevance factors. aovLift: Swym AOV lift % on wishlist-driven
// orders. cvrLift: CVR uplift weight.
const CATEGORIES = [
  { id: "fashion", label: "Fashion & Apparel", wlEng: 5.5, bisRel: 0.9, sflRel: 0.9, aovLift: 30, cvrLift: 1.2 },
  { id: "jewelry", label: "Jewelry & Accessories", wlEng: 6.0, bisRel: 0.6, sflRel: 0.8, aovLift: 25, cvrLift: 1.0 },
  { id: "electronics", label: "Electronics & Tech", wlEng: 4.5, bisRel: 0.8, sflRel: 0.85, aovLift: 20, cvrLift: 0.9 },
  { id: "home", label: "Home & Garden", wlEng: 5.0, bisRel: 0.5, sflRel: 0.9, aovLift: 28, cvrLift: 1.0 },
  { id: "sports", label: "Sports & Outdoor", wlEng: 4.5, bisRel: 0.7, sflRel: 0.85, aovLift: 22, cvrLift: 0.9 },
  { id: "beauty", label: "Beauty & Personal Care", wlEng: 5.0, bisRel: 0.75, sflRel: 0.85, aovLift: 18, cvrLift: 1.0 },
  { id: "other", label: "Other", wlEng: 4.5, bisRel: 0.65, sflRel: 0.8, aovLift: 24, cvrLift: 1.0 },
];
const CATEGORY_DEFAULT = "other";
const getCategory = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES.find((c) => c.id === CATEGORY_DEFAULT);

// Benchmarks, copied from the estimator's defaults. Percentages are in percent units.
const BENCH = {
  wlrr: 4, // wishlist GMV recovery rate via reminders, %
  wlcvrmult: 3, // wishlist user CVR multiplier vs store average
  wlitems: 2.5, // avg items wishlisted per engaged user; also the plan-usage multiplier
  sflr: 18, // SFL capture rate, % of abandoned carts
  sflcvr: 7, // SFL reminder CVR, %
  cartmult: 2.5, // cart initiation rate multiplier vs CVR
  bssr: 0.5, // BIS subscriber rate, % of sessions
  biscvr: 18, // BIS alert CVR, %
  bisfire: 50, // BIS monthly alert fire rate, % of subscribers
  fsr: 15, // monthly send rate, % of active list
  aovbm: 28, // Swym AOV lift benchmark, wishlist-driven orders only, %
  cvrbm: 8, // best-in-class Swym CVR benchmark, %
  iacvr: 2.5, // industry average CVR, used because this page does not ask for the store's CVR
  cartAbandon: 70, // industry average cart abandonment, %, same reason
  cvrq: 20, // CVR uplift, quick wins, % of gap closed
  cvrf: 50, // CVR uplift, full implementation, % of gap closed
};

const MODES = {
  wishlist: {
    key: "wishlist",
    label: "Wishlist",
    Icon: Heart,
    title: "Wishlist Revenue Calculator",
    subtitle: "Enter two numbers and your store category. We estimate how much revenue a Shopify wishlist app could recover from shoppers who save products instead of buying.",
    seoTitle: "Wishlist Revenue Calculator: Shopify Wishlist App ROI | Swym",
    seoDescription: "Free Shopify wishlist app ROI calculator. Estimate the revenue you could recover from shoppers who save products to their wishlist, and see your Wishlist Plus plan match instantly.",
    stage1Label: "Wishlist savers",
    stage2Label: "Purchasers",
    resultLabel: "Estimated monthly wishlist-attributed revenue",
    usageNoun: "wishlist actions",
    plans: [
      // Confirmed against a fresh fetch of getswym.com/pricing (Sept 2026): Starter is
      // $29.99/mo, 3,000 monthly actions. The Wishlist Plus plan-differentiation sheet says
      // $19.99/1,000 for this same tier, that number is stale, the live page is what customers
      // are actually charged today, so it wins.
      { id: "starter", label: "Starter", price: 29.99, cap: 3000, capLabel: "3,000 wishlist actions/mo", lifetimeCap: 15000 },
      { id: "pro", label: "Pro", price: 59.99, cap: 10000, capLabel: "10,000 wishlist actions/mo", lifetimeCap: 50000, requiresShopifyPlus: true },
      { id: "premium", label: "Premium", price: 99.99, cap: 25000, capLabel: "25,000 wishlist actions/mo", lifetimeCap: 125000, requiresShopifyPlus: true },
    ],
    // Enterprise entry point per getswym.com/pricing: "100,000+ Monthly" wishlist actions.
    // No specific Enterprise sub-tier pricing is shown anywhere in this tool: the plan
    // differentiation sheet's Enterprise 1-8 numbers predate the current value-based pricing
    // model and are not reliable, so this tool deliberately does not guess a dollar figure for
    // Enterprise, only that the account should be talking to Swym instead of self-serve.
    //
    // The old visitor-count floor (100,000 monthly visitors, forcing Enterprise regardless of
    // computed usage) was removed per the 2026-09-24 validation doc: real accounts at 100k-500k
    // sessions still fit Starter in Swym's own data, a flat visitor floor was sending small-usage
    // stores to sales for no usage-based reason. Enterprise now triggers purely on usage exceeding
    // Premium's cap. A informational note still surfaces for very large stores (compute()'s
    // showEnterpriseNote), but it's just a note, not a plan-match trigger, pending sales
    // confirmation of whether a real visitor-based rule should exist at all.
    productName: "Wishlist Plus",
    productHeadline: "Your shoppers tell you what they want.",
    productCopy: "Most stores never write it down. Swym Wishlist Plus lets shoppers save products for later, then gives you the tools to bring them back with reminders, price drop alerts, and personalized campaigns.",
    productUrl: SWYM + "/features/wishlist",
    installUrl: "https://apps.shopify.com/swym-relay" + UTM,
    pricingUrl: SWYM + "/pricing",
    insights: [
      "How many shoppers save products to a wishlist today?",
      "How many wishlist shoppers eventually complete a purchase?",
      "Which products receive the most wishlist saves?",
      "How much revenue is already associated with wishlist shoppers?",
      "How long does it typically take a wishlist shopper to convert?",
    ],
    faq: [
      { q: "How do I add a wishlist to my Shopify store?", a: "Most merchants install a Shopify wishlist app, add a heart icon to product and collection pages, then customize the wishlist page to match their theme. Setup typically doesn't need a developer; styling on some themes might, which Swym handles for you." },
      { q: "Is there a free wishlist app for Shopify?", a: "Several Shopify wishlist apps offer a free tier for low volume, usually capped at a set number of monthly wishlist actions. Check what happens once you outgrow it before you commit." },
      { q: "What's the difference between a wishlist and save for later?", a: "A wishlist is built to be revisited across sessions and devices, useful for gifting and future purchases. Save for later usually holds items removed from an active cart, meant for a shorter return trip." },
    ],
    citationsData: [
      { stat: "97%", context: "of shoppers do not buy on their first visit. That gap is what a wishlist is built to hold onto." },
      { stat: "41 days", context: "the average window between first interest and purchase. Most attribution tools only see 5 to 7 of them." },
      { stat: "31%", context: "of shoppers who re-engage with something they saved go on to convert." },
    ],
    caseStudies: [
      { brand: "The Beaufort Bonnet Company", stat: "239x", statLabel: "return on Swym investment in 12 months", vertical: "Fashion / Baby", url: SWYM + "/success-stories/the-beaufort-bonnet-company" },
      { brand: "GA\u00C2LA", stat: "11%", statLabel: "of online revenue driven by Wishlist Plus", vertical: "Slow fashion", url: SWYM + "/success-stories/gaala" },
      { brand: "Lane 201", stat: "90%", statLabel: "higher AOV through Wishlist Plus", vertical: "Apparel", url: SWYM + "/success-stories/lane-201" },
      { brand: "TOV Furniture", stat: "4.6x", statLabel: "higher conversion for wishlist users vs non-users", vertical: "Home & Decor", url: SWYM + "/success-stories/tov-furniture" },
      { brand: "Escentual", stat: "9.94%", statLabel: "conversion rate reached with Swym", vertical: "Beauty", url: SWYM + "/success-stories/escentual" },
      { brand: "Killstar", stat: "Top channel", statLabel: "wishlist automation became a top revenue channel", vertical: "Fashion", url: SWYM + "/success-stories/killstar" },
    ],
    summaryNoun: "wishlist shoppers",
  },
  bis: {
    key: "bis",
    label: "Back in Stock",
    Icon: Bell,
    title: "Back-in-Stock Revenue Calculator",
    subtitle: "Enter two numbers and your store category. We estimate how much revenue back-in-stock notifications could recover from shoppers waiting for a restock alert.",
    seoTitle: "Back in Stock Notifications Calculator: Shopify Restock Alerts ROI | Swym",
    seoDescription: "Free back-in-stock notifications calculator for Shopify. Estimate the revenue you could recover with restock alerts and notify-me signups, and see your Back in Stock plan match instantly.",
    stage1Label: "Alert subscribers",
    stage2Label: "Recovered orders",
    resultLabel: "Estimated monthly recovered revenue",
    usageNoun: "alert requests",
    plans: [
      { id: "free", label: "Free", price: 0, cap: 50, capLabel: "50 alert requests/mo" },
      { id: "starter", label: "Starter", price: 19.99, cap: 1000, capLabel: "1,000 alert requests/mo" },
      { id: "pro", label: "Pro", price: 59.99, cap: 10000, capLabel: "10,000 alert requests/mo" },
      { id: "premium", label: "Premium", price: 99.99, cap: 25000, capLabel: "25,000 alert requests/mo" },
    ],
    // Above 25,000 alert requests/mo, Back in Stock's Enterprise tier is a single bundled plan
    // that also includes Wishlist Plus, not a standalone BIS-only tier. No numeric sub-tiers are
    // published for it the way there are for Wishlist, so this tool recommends "talk to Swym"
    // rather than guessing a price.
    entBundlesWishlist: true,
    productName: "Back in Stock",
    productHeadline: "Don't let out of stock become a lost shopper.",
    productCopy: "When a product is unavailable, the intent to buy it does not disappear. Swym Back in Stock lets shoppers request a notification, then automatically reconnects them the moment inventory returns, worth a median $63 in revenue per converting alert.",
    productUrl: SWYM + "/features/back-in-stock-product-alerts",
    installUrl: "https://apps.shopify.com/watchlist" + UTM,
    pricingUrl: SWYM + "/pricing",
    insights: [
      "Which products generate the most out-of-stock demand?",
      "How many shoppers actually request a restock notification?",
      "What share of notified shoppers come back and purchase?",
      "How much revenue is being recovered today from restock alerts?",
      "Which products have the largest gap between demand and available stock?",
    ],
    faq: [
      { q: "How do I add a back-in-stock notification to my Shopify store?", a: "A back-in-stock app adds a notify-me button to sold-out product and variant pages, then emails or texts shoppers the moment inventory returns. Setup typically doesn't need a developer; styling on some themes might, which Swym handles for you." },
      { q: "How does a \u2018notify me when available\u2019 button work on Shopify?", a: "When a shopper clicks notify me on a sold-out product, they leave an email or phone number tied to that specific variant. The app watches inventory and fires the alert the moment stock updates." },
      { q: "Is there a free back-in-stock app for Shopify?", a: "Yes, Swym Back in Stock offers a free plan for up to 50 alert requests a month, with paid tiers as volume grows." },
    ],
    citationsData: [
      { stat: "$63", context: "median revenue Swym generates per converting restock notification." },
      { stat: "41 days", context: "the average window between first interest and purchase. Most attribution tools only see 5 to 7 of them." },
    ],
    caseStudies: [
      { brand: "Dubarry of Ireland", stat: "16.6x", statLabel: "ROI by turning stockouts into sales opportunities", vertical: "Footwear & Apparel", url: SWYM + "/success-stories/dubarry-of-ireland" },
      { brand: "Tibi", stat: "4x", statLabel: "more likely to convert with Back in Stock Alerts", vertical: "Luxury fashion", url: SWYM + "/success-stories/tibi" },
      { brand: "Cirque Colors", stat: "AOV up", statLabel: "more orders with Wishlist Plus and Back in Stock Alerts", vertical: "Beauty", url: SWYM + "/success-stories/cirque-colors" },
      { brand: "TOV Furniture", stat: "20%", statLabel: "of revenue from the peak season capture strategy", vertical: "Home & Decor", url: SWYM + "/success-stories/tov-furniture" },
    ],
    summaryNoun: "recovering out-of-stock shoppers",
  },
};

/* ---------------- tracking ---------------- */

function track(event, props = {}) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "swym_calc_" + event, ...props });
  } catch (e) {
    /* noop */
  }
}

/* ---------------- math ---------------- */

function initialScenario(modeKey, volume = 50000) {
  return {
    volume,
    aov: 75,
    category: CATEGORY_DEFAULT,
    useOwnData: false,
    ownStage1: 0,
    ownStage2: 0,
  };
}

// Computes one scenario for a given mode and input. The internal keys stay "typical" and
// "strong" so the UI wiring is unchanged; they map to the estimator's two scenarios:
// typical = quick wins (CVR uplift closes cvrq of the gap), strong = full implementation (cvrf).
// Back in Stock has no CVR uplift line in the estimator, so both scenarios are equal there.
// `drivers` is the per-feature revenue breakdown; `steps` is the count funnel shown above it.
function computeScenario(modeKey, s, rateKey) {
  const volume = Number(s.volume) || 0;
  const aov = Number(s.aov) || 0;
  const cat = getCategory(s.category);
  if (s.useOwnData) {
    const stage1 = Math.max(0, Number(s.ownStage1) || 0);
    const stage2 = Math.max(0, Number(s.ownStage2) || 0);
    const monthly = stage2 * aov;
    const usage = modeKey === "bis" ? stage1 : stage1 * BENCH.wlitems;
    return { volume, aov, stage1, stage2, monthly, annual: monthly * 12, usage, steps: [], drivers: [] };
  }
  const cv = BENCH.iacvr;
  if (modeKey === "bis") {
    // BIS uses store AOV, not the Swym wishlist AOV: single-item triggered purchases.
    const subscribers = volume * (BENCH.bssr / 100) * cat.bisRel;
    const alerted = subscribers * (BENCH.fsr / 100) * (BENCH.bisfire / 100);
    const orders = alerted * (BENCH.biscvr / 100) * CONFIDENCE;
    const monthly = orders * aov;
    return {
      volume, aov, stage1: subscribers, stage2: orders, monthly, annual: monthly * 12, usage: subscribers,
      steps: [
        { label: "Alert subscribers", sub: `${BENCH.bssr}% of sessions x ${cat.bisRel} ${cat.label} relevance`, value: subscribers },
        { label: "Alerts sent", sub: `${BENCH.fsr}% send rate x ${BENCH.bisfire}% restock rate`, value: alerted },
        { label: "Recovered orders", sub: `${BENCH.biscvr}% alert CVR, conservative`, value: orders },
      ],
      drivers: [{ label: "Back-in-stock alerts", value: monthly }],
    };
  }
  // Swym AOV applies to wishlist-driven orders only.
  const wa = aov * (1 + (BENCH.aovbm * (cat.aovLift / 28)) / 100);
  const engaged = volume * (cat.wlEng / 100);
  const wlPurchaseProb = Math.min((cv / 100) * BENCH.wlcvrmult, 0.25);
  const wlRev = engaged * wlPurchaseProb * wa * BENCH.wlitems * (BENCH.wlrr / 100) * CONFIDENCE;
  const cartInitRate = Math.min(cv * BENCH.cartmult, 35) / 100;
  const abandonedCarts = volume * cartInitRate * (BENCH.cartAbandon / 100);
  const sflCapture = abandonedCarts * ((cat.sflRel * BENCH.sflr) / 100);
  const sflRev = sflCapture * (BENCH.fsr / 100) * (BENCH.sflcvr / 100) * wa * CONFIDENCE;
  // CVR uplift runs on engaged sessions minus those already counted as wishlist purchases, so
  // conversions in the reminder line are not counted twice.
  const cvrGap = Math.max(0, BENCH.cvrbm - cv);
  const cvrPool = Math.max(0, engaged - engaged * wlPurchaseProb);
  const gapShare = rateKey === "strong" ? BENCH.cvrf : BENCH.cvrq;
  const cvrRev = cvrPool * ((cvrGap * cat.cvrLift * (gapShare / 100)) / 100) * wa * CONFIDENCE;
  const monthly = wlRev + sflRev + cvrRev;
  // Every wishlist driver is priced at the Swym AOV, so revenue / wa is the order count.
  const orders = wa > 0 ? monthly / wa : 0;
  return {
    volume, aov, stage1: engaged, stage2: orders, monthly, annual: monthly * 12, usage: engaged * BENCH.wlitems,
    steps: [
      { label: "Wishlist-engaged shoppers", sub: `${cat.wlEng}% of sessions, ${cat.label}`, value: engaged },
      { label: "Abandoned carts captured by save for later", sub: `${Math.round(cat.sflRel * BENCH.sflr * 10) / 10}% of ~${fmtCount(abandonedCarts)} abandoned carts`, value: sflCapture },
      { label: "Swym-influenced orders", sub: `at a ${fmtMoney(wa, "$")} Swym AOV (+${Math.round((wa / aov - 1) * 100) || 0}%)`, value: orders },
    ],
    drivers: [
      { label: "Wishlist reminders", value: wlRev },
      { label: "Save for later", value: sflRev },
      { label: rateKey === "strong" ? "Conversion uplift, full implementation" : "Conversion uplift, quick wins", value: cvrRev },
    ],
  };
}

function compute(modeKey, s) {
  const cfg = MODES[modeKey];
  const volume = Number(s.volume) || 0;
  const typical = computeScenario(modeKey, s, "typical");
  const strong = computeScenario(modeKey, s, "strong");
  const premium = cfg.plans[cfg.plans.length - 1];

  // Plan match uses the full-implementation scenario's usage. Usage does not depend on the
  // scenario today (both use engaged shoppers x items per user), so this only matters if that
  // changes. Enterprise now triggers purely on usage, not a visitor-count floor, per the
  // validated review: real accounts at 100k-500k sessions still fit Starter, a flat visitor floor
  // was sending small-usage stores to Enterprise for no usage-based reason.
  const overUsageCap = strong.usage > premium.cap;
  const enterprise = overUsageCap;
  const plan = enterprise ? { id: "enterprise", label: "Enterprise", price: null, capLabel: "custom volume" } : cfg.plans.find((p) => strong.usage <= p.cap);
  // Not a plan-match trigger, just a note: real accounts this large often end up talking to sales
  // for support/customization reasons even when usage alone would still fit a lower plan. Confirm
  // the exact threshold with sales before ever making this a hard rule again.
  const showEnterpriseNote = !enterprise && volume >= 500000;

  const roiTypical = plan.price > 0 ? typical.monthly / plan.price : null;
  const roiStrong = plan.price > 0 ? strong.monthly / plan.price : null;
  const roiFloor = enterprise ? strong.monthly / premium.price : null;
  const net = plan.price != null ? strong.monthly - plan.price : null;
  // Renewal/quota narrative: how close the Strong estimate sits to the matched plan's own cap,
  // matching Swym's real quota behavior (notified at 50/75/90/100%, restricted until renewal or
  // upgrade).
  const quotaPct = plan.cap ? Math.min(100, Math.round((strong.usage / plan.cap) * 100)) : null;
  const nearQuota = quotaPct != null && quotaPct >= 75;
  const monthsToLifetime = plan.lifetimeCap != null && strong.usage > 0 ? Math.max(1, Math.round(plan.lifetimeCap / strong.usage)) : null;
  return { volume, typical, strong, plan, enterprise, showEnterpriseNote, roiTypical, roiStrong, roiFloor, net, quotaPct, nearQuota, monthsToLifetime };
}

// Builds a link that reproduces the exact estimate being viewed, not just the mode. Without this,
// "Copy link" only copied window.location.href (mode via #hash, no inputs), so a shared link
// opened to the same mode with default inputs instead of the sender's actual numbers. The
// scenarios aren't editable state, so volume/aov/category are the only inputs to carry.
function buildShareUrl(modeKey, s) {
  const url = new URL(window.location.href);
  url.hash = modeKey === "bis" ? "calculator/back-in-stock" : "calculator/wishlist";
  const p = url.searchParams;
  p.set("mode", modeKey);
  p.set("visitors", String(Math.round(s.volume)));
  p.set("aov", String(s.aov));
  p.set("category", s.category);
  return url.toString();
}

const fmtMoney = (n, sym) => sym + Math.round(n || 0).toLocaleString("en-US");
const fmtCount = (n) => Math.round(n || 0).toLocaleString("en-US");
// Back in Stock has one scenario, so its "range" collapses to a single figure.
const fmtMoneyRange = (a, b, sym) => (Math.round(a) === Math.round(b) ? fmtMoney(b, sym) : `${fmtMoney(a, sym)} to ${fmtMoney(b, sym)}`);
const fmtMoneyCents = (n) => "$" + n.toFixed(2);
const fmtX = (n) => (n == null ? "" : (n >= 100 ? Math.round(n) : Math.round(n * 10) / 10).toLocaleString("en-US") + "x");

/* ---------------- animation hooks ---------------- */

function useCountUp(target, duration = 650) {
  const [val, setVal] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    const from = cur.current;
    const to = Number(target) || 0;
    if (from === to) return undefined;
    const start = performance.now();
    let raf;
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      const v = from + (to - from) * e;
      cur.current = v;
      setVal(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setOn(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`swym-reveal ${className}`} data-on={on} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------------- app ---------------- */

export default function SwymRevenueCalculator() {
  const [view, setView] = useState("landing"); // landing | wishlist | bis | compare
  const [lead, setLead] = useState({ captured: false, name: "", store: "", email: "" });
  const [scenarios, setScenarios] = useState({ wishlist: initialScenario("wishlist"), bis: initialScenario("bis") });
  const [compareMode, setCompareMode] = useState("wishlist");
  const [compare, setCompare] = useState({
    wishlist: { a: initialScenario("wishlist", 50000), b: initialScenario("wishlist", 100000) },
    bis: { a: initialScenario("bis", 50000), b: initialScenario("bis", 100000) },
  });
  const [copied, setCopied] = useState(null);
  const calcRef = useRef(null);

  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    if (h === "calculator/wishlist") setView("wishlist");
    else if (h === "calculator/back-in-stock") setView("bis");
    else if (h === "calculator/compare") setView("compare");

    // Pre-fill from a small embed widget elsewhere on the site (homepage, pricing page, blog
    // sidebar, etc): ?visitors=50000&aov=75&mode=wishlist redirects here already carrying the
    // numbers someone typed, so the full tool opens straight to their result instead of an
    // empty form. See MODES/EMBED_WIDGET_SNIPPET for the paired embed markup.
    const params = new URLSearchParams(window.location.search);
    const qVisitors = Number(params.get("visitors"));
    const qAov = Number(params.get("aov"));
    const qMode = params.get("mode") === "bis" ? "bis" : "wishlist";
    // "category" comes from a "Copy link" share (see buildShareUrl); unknown ids are ignored.
    const qCategory = CATEGORIES.some((c) => c.id === params.get("category")) ? params.get("category") : null;
    if (qVisitors > 0 || qAov > 0) {
      setView(qMode);
      setScenarios((prev) => ({
        ...prev,
        [qMode]: {
          ...prev[qMode],
          volume: qVisitors > 0 ? qVisitors : prev[qMode].volume,
          aov: qAov > 0 ? qAov : prev[qMode].aov,
          ...(qCategory ? { category: qCategory } : {}),
        },
      }));
      track("embed_redirect", { mode: qMode, visitors: qVisitors || null, aov: qAov || null });
      requestAnimationFrame(() => calcRef.current && calcRef.current.scrollIntoView({ behavior: "smooth", block: "start" }));
    }

    track("page_view");
  }, []);

  useEffect(() => {
    const seo =
      view === "wishlist"
        ? { title: MODES.wishlist.seoTitle, description: MODES.wishlist.seoDescription }
        : view === "bis"
        ? { title: MODES.bis.seoTitle, description: MODES.bis.seoDescription }
        : view === "compare"
        ? { title: "Compare Wishlist and Back in Stock Revenue Scenarios | Swym", description: "Run two Shopify store scenarios side by side and compare the estimated wishlist or back-in-stock revenue opportunity between them." }
        : { title: "Shopper Intent ROI Calculator: Wishlist & Back in Stock Revenue | Swym", description: "Free tools to estimate the revenue hiding in your Shopify store's shopper intent. Calculate your Wishlist Plus or Back in Stock ROI in under a minute." };
    document.title = seo.title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = seo.description;
  }, [view]);

  useEffect(() => {
    const map = { wishlist: "calculator/wishlist", bis: "calculator/back-in-stock", compare: "calculator/compare", landing: "" };
    window.location.hash = map[view];
    if (view !== "landing" && calcRef.current) {
      calcRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [view]);

  const symbol = "$"; // USD only, see the note near the top of the file
  const updateScenario = (k, patch) => setScenarios((p) => ({ ...p, [k]: { ...p[k], ...patch } }));
  const updateCompare = (k, side, patch) => setCompare((p) => ({ ...p, [k]: { ...p[k], [side]: { ...p[k][side], ...patch } } }));

  async function copyText(text, key) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch (e) {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="swym-root">
      <Styles />
      <Header view={view} setView={setView} />

      {view === "landing" && (
        <>
          <Hero onPick={setView} />
          <TrustStrip />
          <ChooseCalculator onPick={setView} />
          <HowItWorks onPick={setView} />
          <HeartMoment />
          <SuccessStories caseStudies={[...MODES.wishlist.caseStudies.slice(0, 3), MODES.bis.caseStudies[0], MODES.bis.caseStudies[1], MODES.wishlist.caseStudies[3]]} title="Brands turning shopper intent into wins" />
        </>
      )}

      <div ref={calcRef}>
        {(view === "wishlist" || view === "bis") && (
          <Calculator
            modeKey={view}
            s={scenarios[view]}
            update={(patch) => updateScenario(view, patch)}
            reset={() => setScenarios((p) => ({ ...p, [view]: initialScenario(view) }))}
            symbol={symbol}
            copied={copied}
            copyText={copyText}
            lead={lead}
            setLead={setLead}
          />
        )}
        {view === "compare" && (
          <Compare
            modeKey={compareMode}
            setModeKey={setCompareMode}
            data={compare[compareMode]}
            update={(side, patch) => updateCompare(compareMode, side, patch)}
            reset={() => setCompare((p) => ({ ...p, [compareMode]: { a: initialScenario(compareMode, 50000), b: initialScenario(compareMode, 100000) } }))}
            symbol={symbol}
          />
        )}
      </div>

      <FinalCta goLanding={() => setView("landing")} />
      <Footer setView={setView} />
    </div>
  );
}

/* ---------------- styles ---------------- */

function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=Lora:ital,wght@1,400;1,500&display=swap');
      .swym-root { --navy:#172B4D; --navy-soft:#3D4F6E; --muted:#6B7A93; --lime:#B5E56A; --lime-deep:#8FCB3F; --lime-soft:#EEF8E1; --lime-line:#CFE9A6; --blue:#2E72B8; --border:#E3E8EF; --bg-alt:#F7FAF3;
        font-family:'Figtree',-apple-system,BlinkMacSystemFont,sans-serif; color:var(--navy); background:#fff; min-height:100vh; -webkit-font-smoothing:antialiased; overflow-x:hidden; }
      .swym-serif { font-family:'Lora',Georgia,serif; font-style:italic; }
      .swym-h { letter-spacing:-0.02em; line-height:1.08; }
      .swym-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; border-radius:9999px; font-weight:600; font-size:15px; padding:13px 24px; transition:transform .18s ease, background .18s ease, box-shadow .18s ease; white-space:nowrap; cursor:pointer; }
      .swym-btn:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(23,43,77,.10); }
      .swym-btn-lime { background:var(--lime); color:var(--navy); }
      .swym-btn-lime:hover { background:#A9DF58; }
      .swym-btn-outline { background:#fff; color:var(--navy); border:1.5px solid var(--navy); }
      .swym-btn-outline:hover { background:var(--bg-alt); }
      .swym-btn-ghost { background:#fff; color:var(--navy); border:1px solid var(--border); font-size:14px; padding:9px 16px; }
      .swym-btn-ghost:hover { background:var(--bg-alt); }
      .swym-card { background:#fff; border:1px solid var(--border); border-radius:24px; }
      .swym-card-lime { background:var(--lime-soft); border:1px solid var(--lime-line); border-radius:20px; }
      .swym-card-navy { background:var(--navy); color:#fff; border-radius:20px; }
      .swym-band { position:relative; background:#fff; }
      .swym-band::before { content:""; position:absolute; inset:0; background:linear-gradient(112deg, transparent 0%, transparent 34%, var(--lime-soft) 34.2%, var(--lime-soft) 66%, transparent 66.2%); pointer-events:none; }
      .swym-grid { background-image:linear-gradient(rgba(23,43,77,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(23,43,77,.04) 1px, transparent 1px); background-size:56px 56px; }
      .swym-tabs { display:inline-flex; background:var(--lime-soft); border:1px solid var(--lime-line); border-radius:9999px; padding:4px; gap:2px; }
      .swym-tab { display:inline-flex; align-items:center; gap:8px; border-radius:9999px; padding:9px 18px; font-size:15px; font-weight:600; color:var(--navy-soft); transition:all .18s ease; }
      .swym-tab[data-active="true"] { background:var(--lime); color:var(--navy); box-shadow:0 1px 2px rgba(23,43,77,.08); }
      .swym-nav a { font-size:15px; font-weight:500; color:var(--navy); padding:8px 12px; border-radius:9999px; transition:background .15s ease; }
      .swym-nav a:hover { background:var(--bg-alt); }
      .swym-chip { border:1px solid var(--border); background:#fff; color:var(--navy-soft); border-radius:9999px; padding:6px 12px; font-size:13px; font-weight:600; transition:all .15s ease; }
      .swym-chip[data-active="true"] { border-color:var(--lime-deep); background:var(--lime-soft); color:var(--navy); }
      .swym-input { width:100%; border:1.5px solid var(--border); border-radius:14px; padding:13px 14px; font-size:17px; color:var(--navy); background:#fff; font-family:inherit; transition:border-color .15s ease, box-shadow .15s ease; }
      .swym-input:focus { outline:none; border-color:var(--lime-deep); box-shadow:0 0 0 4px rgba(181,229,106,.3); }
      .swym-label { font-size:14px; font-weight:600; color:var(--navy); }
      .swym-help { font-size:13px; color:var(--muted); margin-top:6px; }
      .swym-eyebrow { font-size:12px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); }
      .swym-range { -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:9999px; background:var(--border); }
      .swym-range::-webkit-slider-thumb { -webkit-appearance:none; width:22px; height:22px; border-radius:9999px; background:var(--lime); border:3px solid #fff; box-shadow:0 0 0 1.5px var(--lime-deep); cursor:pointer; transition:transform .12s ease; }
      .swym-range::-webkit-slider-thumb:hover { transform:scale(1.1); }
      .swym-range::-moz-range-thumb { width:22px; height:22px; border-radius:9999px; background:var(--lime); border:3px solid #fff; box-shadow:0 0 0 1.5px var(--lime-deep); cursor:pointer; }
      .swym-select { border:1px solid var(--border); border-radius:9999px; padding:9px 14px; font-size:14px; font-weight:600; color:var(--navy); background:#fff; font-family:inherit; }
      .swym-root button:focus-visible, .swym-root a:focus-visible, .swym-range:focus-visible { outline:2px solid var(--lime-deep); outline-offset:2px; }
      .swym-step { border-bottom:1px solid var(--lime-line); padding:14px 0; }
      .swym-step:last-child { border-bottom:none; }
      .swym-bar { height:8px; border-radius:9999px; transition:width .6s cubic-bezier(.2,.8,.2,1); }
      .swym-num { font-variant-numeric:tabular-nums; }
      .swym-panel { background:#fff; border:1px solid var(--border); border-radius:28px; overflow:hidden; }
      .swym-planband { background:var(--navy); color:#fff; }
      .swym-seg { display:inline-flex; background:var(--bg-alt); border:1px solid var(--border); border-radius:9999px; padding:3px; }
      .swym-seg button { border-radius:9999px; padding:7px 14px; font-size:13px; font-weight:600; color:var(--navy-soft); transition:background .2s ease, color .2s ease; }
      .swym-seg button[data-active="true"] { background:var(--navy); color:#fff; }
      .swym-stack { display:flex; gap:3px; height:18px; border-radius:9999px; overflow:hidden; }
      .swym-stack > span { flex-basis:0; min-width:4px; transition:flex-grow .7s cubic-bezier(.2,.8,.2,1); }
      .swym-ledger { display:grid; grid-template-columns:1fr auto 7rem; align-items:center; gap:16px; padding:12px 0; border-bottom:1px solid var(--border); }
      .swym-ledger:last-child { border-bottom:none; }
      .swym-rungs { display:grid; grid-auto-flow:column; grid-auto-columns:1fr; gap:4px; }
      .swym-rungs > span { height:10px; border-radius:9999px; background:rgba(255,255,255,.14); }
      .swym-rungs > span[data-active="true"] { background:var(--lime); }
      .swym-marker { position:absolute; top:5px; width:20px; height:20px; border-radius:9999px; background:#fff; border:4px solid var(--lime-deep); transform:translate(-50%,-50%); transition:left .7s cubic-bezier(.2,.8,.2,1); box-shadow:0 0 0 3px var(--navy); }
      @media (prefers-reduced-motion: reduce) { .swym-stack > span, .swym-marker { transition:none } }
      .swym-shot { margin:0; border-radius:20px; overflow:hidden; background:#fff; border:1px solid var(--border); box-shadow:0 30px 60px -30px rgba(23,43,77,.35); }
      .swym-cardimg { height:200px; background:var(--lime-soft); border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:center; padding:20px 20px 0; overflow:hidden; }
      .swym-cardimg img { width:100%; height:100%; object-fit:cover; object-position:top left; border-radius:12px 12px 0 0; }
      .swym-reveal { opacity:0; transform:translateY(18px); transition:opacity .7s ease, transform .7s cubic-bezier(.2,.8,.2,1); }
      .swym-reveal[data-on="true"] { opacity:1; transform:none; }
      .swym-float { animation:swymFloat 6s ease-in-out infinite; }
      .swym-float-2 { animation:swymFloat 7s ease-in-out infinite; animation-delay:-2s; }
      .swym-float-3 { animation:swymFloat 8s ease-in-out infinite; animation-delay:-4s; }
      @keyframes swymFloat { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-12px) } }
      .swym-heart { animation:swymBeat 2.6s ease-in-out infinite; transform-origin:50% 55%; filter:drop-shadow(0 18px 30px rgba(143,203,63,.35)); }
      @keyframes swymBeat { 0%,100% { transform:scale(1) } 14% { transform:scale(1.08) } 28% { transform:scale(1) } 42% { transform:scale(1.05) } 60% { transform:scale(1) } }
      .swym-particle { position:absolute; border-radius:9999px; background:var(--lime-deep); opacity:.75; animation:swymDrift linear infinite; }
      @keyframes swymDrift { 0% { transform:translate(0,0) scale(.6); opacity:0 } 20% { opacity:.8 } 100% { transform:translate(var(--dx), var(--dy)) scale(1.1); opacity:0 } }
      .swym-pop { animation:swymPop .5s cubic-bezier(.2,.8,.2,1); }
      @keyframes swymPop { 0% { transform:scale(.96); opacity:.4 } 100% { transform:scale(1); opacity:1 } }
      .swym-marquee { display:flex; gap:48px; width:max-content; animation:swymMarquee 28s linear infinite; }
      @keyframes swymMarquee { from { transform:translateX(0) } to { transform:translateX(-50%) } }
      .swym-drawer { position:fixed; inset:0; z-index:60; }
      .swym-drawer-bg { position:absolute; inset:0; background:rgba(23,43,77,.5); backdrop-filter:blur(4px); }
      .swym-drawer-panel { position:absolute; right:0; top:0; height:100%; width:min(320px, 88vw); background:#fff; padding:24px; box-shadow:-10px 0 40px rgba(23,43,77,.2); animation:swymSlide .45s cubic-bezier(.16,1,.3,1); }
      @keyframes swymSlide { from { transform:translateX(100%) } to { transform:none } }
      .swym-cs { transition:transform .2s ease, box-shadow .2s ease; }
      .swym-cs:hover { transform:translateY(-4px); box-shadow:0 14px 30px rgba(23,43,77,.10); }
      .swym-logo { filter:grayscale(1) contrast(1.05); opacity:.62; transition:filter .25s ease, opacity .25s ease; }
      .swym-logo:hover { filter:none; opacity:1; }
      .swym-heart-btn { animation:swymHeartTap 3.2s ease-in-out infinite; }
      @keyframes swymHeartTap { 0%,70%,100% { transform:scale(1) } 76% { transform:scale(1.3) } 84% { transform:scale(.92) } 92% { transform:scale(1.08) } }
      .swym-toast { animation:swymToast 7s ease-in-out infinite; }
      @keyframes swymToast { 0%,8% { opacity:0; transform:translate(-50%,-12px) } 14%,60% { opacity:1; transform:translate(-50%,0) } 68%,100% { opacity:0; transform:translate(-50%,-12px) } }
      .swym-glow { animation:swymGlow .9s ease-out; }
      @keyframes swymGlow { 0% { box-shadow:0 0 0 0 rgba(143,203,63,.0) } 25% { box-shadow:0 0 0 8px rgba(143,203,63,.28) } 100% { box-shadow:0 0 0 0 rgba(143,203,63,0) } }
      .swym-enter { animation:swymEnter .55s cubic-bezier(.2,.8,.2,1) both; }
      @keyframes swymEnter { from { opacity:0; transform:translateY(16px) scale(.98) } to { opacity:1; transform:none } }
      .swym-burst { position:absolute; left:50%; top:50%; width:8px; height:8px; border-radius:9999px; background:var(--lime-deep); animation:swymBurst .9s ease-out forwards; pointer-events:none; }
      @keyframes swymBurst { 0% { transform:translate(0,0) scale(.4); opacity:1 } 100% { transform:translate(var(--dx),var(--dy)) scale(1); opacity:0 } }
      .swym-shimmer { position:relative; overflow:hidden; }
      .swym-shimmer::after { content:""; position:absolute; inset:0; background:linear-gradient(100deg, transparent 20%, rgba(255,255,255,.55) 50%, transparent 80%); transform:translateX(-120%); animation:swymShimmer 1.1s ease-out; }
      @keyframes swymShimmer { to { transform:translateX(120%) } }
      .swym-beat { animation:swymBeat 2.6s ease-in-out infinite; transform-origin:center; }
      @media (prefers-reduced-motion: reduce) { .swym-float,.swym-float-2,.swym-float-3,.swym-heart,.swym-particle,.swym-marquee { animation:none } .swym-reveal { transition:none; opacity:1; transform:none } }
    `}</style>
  );
}

/* ---------------- header ---------------- */

const NAV = [
  { label: "Platform", href: SWYM + "/" },
  { label: "Verticals", href: SWYM + "/verticals" },
  { label: "Integrations", href: SWYM + "/technology-partners" },
  { label: "Resources", href: SWYM + "/blog" },
  { label: "Pricing", href: SWYM + "/pricing" },
  { label: "Company", href: SWYM + "/about-us" },
];

function Header({ view, setView }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="px-6 py-2 text-center text-sm" style={{ background: "#EAF3FB", color: "var(--navy)" }}>
        <span className="swym-serif">Turn shopper intent into revenue with Swym.</span>{" "}
        <a href={SWYM + "/casestudies/customer-success-stories"} target="_blank" rel="noopener noreferrer" className="font-semibold" style={{ color: "var(--blue)" }}>
          See the results <ArrowRight size={13} className="inline" />
        </a>
      </div>
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-10">
          <button onClick={() => setView("landing")} className="flex items-center gap-3">
            <img src={LOGO_SRC} alt="Swym" style={{ height: 28, width: "auto" }} />
            <span className="swym-h text-3xl font-bold" style={{ letterSpacing: "-0.04em" }}>
              swym
            </span>
          </button>
          <nav className="swym-nav hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <a key={n.label} href={n.href} target="_blank" rel="noopener noreferrer">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <a href={MODES.wishlist.installUrl} target="_blank" rel="noopener noreferrer" className="swym-btn swym-btn-outline" style={{ padding: "10px 20px" }} onClick={() => track("cta_install", { placement: "header" })}>
              Install Now
            </a>
          </div>
          <button className="flex h-11 w-11 items-center justify-center rounded-full lg:hidden" style={{ background: "var(--lime-soft)" }} onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
        </div>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 pb-4 sm:px-10">
          <div className="swym-tabs" role="tablist" aria-label="Calculator">
            <button role="tab" className="swym-tab" data-active={view === "wishlist"} onClick={() => setView("wishlist")}>
              <Heart size={16} /> Wishlist
            </button>
            <button role="tab" className="swym-tab" data-active={view === "bis"} onClick={() => setView("bis")}>
              <Bell size={16} /> Back in Stock
            </button>
            <button role="tab" className="swym-tab" data-active={view === "compare"} onClick={() => setView("compare")}>
              <Scale size={16} /> Compare
            </button>
          </div>
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            Revenue Opportunity Calculator
          </span>
        </div>
      </header>

      {open && (
        <div className="swym-drawer" role="dialog" aria-modal="true">
          <div className="swym-drawer-bg" onClick={() => setOpen(false)} />
          <div className="swym-drawer-panel flex flex-col">
            <div className="flex items-center justify-between">
              <img src={LOGO_SRC} alt="Swym" style={{ height: 24 }} />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "var(--bg-alt)" }}>
                <X size={18} />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-1">
              {NAV.map((n, i) => (
                <a key={n.label} href={n.href} target="_blank" rel="noopener noreferrer" className="swym-reveal rounded-xl px-4 py-3 text-lg font-semibold" data-on="true" style={{ transitionDelay: `${i * 60}ms` }}>
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="mt-auto space-y-3">
              <a href={MODES.wishlist.installUrl} target="_blank" rel="noopener noreferrer" className="swym-btn swym-btn-lime w-full">
                Install Now <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------- hero ---------------- */

function Hero({ onPick }) {
  return (
    <section className="swym-band swym-grid relative overflow-hidden px-6 pb-20 pt-14 sm:px-10 sm:pt-20">
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <h1 className="swym-h text-5xl font-semibold sm:text-6xl lg:text-7xl">
              Turn shopper intent
              <br />
              into revenue.
              <br />
              See the numbers.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-7 max-w-xl text-lg sm:text-xl" style={{ color: "var(--navy-soft)" }}>
              97% of shoppers don't buy on their first visit. Most stores never write down what they wanted. This calculator estimates what that unrecorded intent could be worth, and what it would take to capture it.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-9 flex flex-wrap gap-3">
              <button className="swym-btn swym-btn-lime" onClick={() => onPick("wishlist")}>
                <Heart size={16} /> Wishlist calculator <ArrowRight size={16} />
              </button>
              <button className="swym-btn swym-btn-outline" onClick={() => onPick("bis")}>
                <Bell size={16} /> Back in Stock calculator <ArrowRight size={16} />
              </button>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap items-center gap-5 text-base">
              <span className="flex items-center gap-1" style={{ color: "#F5B301" }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={18} fill="#F5B301" />
                ))}
              </span>
              <span className="font-medium">Over 1.3K 5 star reviews</span>
              <span className="hidden h-5 w-px sm:block" style={{ background: "var(--border)" }} />
              <span className="font-medium">45K+ brands trust Swym</span>
            </div>
          </Reveal>
        </div>

        <div className="relative lg:col-span-6">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

const IMG = {
  dashboard: "67c5760e8ee448a02973ea00_wishlist_insightspng.png",
  productCard: "67b33a0c1a55af297774152d_hero_screenshot04.png",
  wishlist: "67adbca3308dfcca86c4df36_screenshot_solution_wishlistPlus.png",
  bis: "67adf1dbe1be5ec98a5a6457_screenshot_backInStock.png",
  saveForLater: "67ade11d894708a134cf7219_screenshot_saveForLater.png",
  bisFlow: "67eb6ec0d9c1e32c555d376a_ae5eda4f5e1b94df4f651171723b5e1a_heroImage_back-in-stock.png",
};

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl pb-10 lg:pb-0">
      <Reveal delay={150}>
        <figure className="swym-shot">
          <img src={CDN + IMG.dashboard} alt="Wishlist Plus dashboard showing shoppers, saved products, wishlist value and revenue" className="block w-full" />
        </figure>
      </Reveal>
      <Reveal delay={350} className="swym-shot-float absolute -bottom-2 -left-4 w-36 sm:-left-10 sm:w-48">
        <figure className="swym-shot">
          <img src={CDN + IMG.productCard} alt="Product card with a wishlist heart and add to cart button" className="block w-full" />
        </figure>
      </Reveal>
      <Reveal delay={500} className="absolute -right-2 -top-5 sm:-right-6">
        <div className="rounded-2xl px-4 py-3 shadow-lg" style={{ background: "var(--lime)" }}>
          <p className="text-xs font-semibold">Wishlist revenue, last 7 days</p>
          <p className="swym-h text-2xl font-bold">$16.9K</p>
        </div>
      </Reveal>
    </div>
  );
}

/* ---------------- trust strip ---------------- */

const CDN = "https://cdn.prod.website-files.com/67a1ca5bb1b9dbe1837f156e/";
const BRANDS = [
  ["Princess Polly", "67adf7e660a20a7aa80a7309_logo_customer_princessPoly.png"],
  ["Steve Madden", "67ab57b1bbc12415e6c42970_logo_customer_steveMadden.png"],
  ["Reebok", "67ab57b08b2006a1b4963889_logo_customer_reebok.png"],
  ["DKNY", "67ab57b09183fa4edb3a561a_logo_customer_DKNY.png"],
  ["Credo Beauty", "67ab57b1bea97e1dd60a66e3_logo_customer_credo.png"],
  ["Arhaus", "67ab57b0cce3dedd87f44a4c_logo_customer_arhaus.png"],
  ["Murad", "67ab57b058084ebc3b857d95_logo_customer_murad.png"],
  ["Sol de Janeiro", "67ab57b0dd75e59752c834dd_logo_customer_solDeJeneiro.png"],
  ["King Arthur Baking", "67ab57b0691d5802d0b0a797_logo_customer_kingArthur.png"],
  ["Tibi", "67ab57af20ca4917ce2cbb6e_logo_customer_tibi.png"],
  ["Brighton", "67ab57b0758e9480d2feb842_logo_customer_brighton.png"],
  ["Oh Polly", "67ab57b072511c662f6d776e_logo_customer_ohPolly.png"],
  ["Culture Kings", "67ab57af2730fccd307c4804_logo_customer_cultureKings.png"],
  ["Killstar", "67ab57b159aeb6ab187f2218_logo_customer_killStar.png"],
  ["GA\u00C2LA", "67ab57b02e16087be3226eab_logo_customer_gaala.png"],
  ["Missoma", "67ebc4e9160ce9bf8055a573_logo_customer_missoma.svg"],
  ["Tommy John", "67ab57b0306f97c1a2fba1fa_logo_customer_tommyJohn.png"],
  ["Topo Designs", "67ab57b019cfce396646f0ef_logo_customer_topDesigns.png"],
  ["Pink Lily", "67ab57b0ad021a0ce357602f_logo_customer_pinkLilly.png"],
];

function BrandLogo({ name, file }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="swym-h text-xl font-bold" style={{ color: "var(--navy-soft)", opacity: 0.7 }}>
        {name}
      </span>
    );
  }
  return <img src={CDN + file} alt={name} loading="lazy" onError={() => setFailed(true)} className="swym-logo" style={{ height: 34, width: "auto", maxWidth: 150, objectFit: "contain" }} />;
}

function TrustStrip() {
  const items = [...BRANDS, ...BRANDS];
  return (
    <section className="border-y py-9" style={{ borderColor: "var(--border)", background: "#fff" }}>
      <p className="swym-eyebrow text-center">Trusted by 45,000+ brands including</p>
      <div className="mt-6 overflow-hidden">
        <div className="swym-marquee items-center">
          {items.map(([name, file], i) => (
            <BrandLogo key={`${name}-${i}`} name={name} file={file} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- choose your calculator ---------------- */

const CALC_CARDS = [
  {
    id: "wishlist",
    Icon: Heart,
    accent: "#E5484D",
    accentSoft: "#FFE8EC",
    img: IMG.wishlist,
    alt: "Wishlist page and add to wishlist button on a storefront",
    title: "Wishlist Revenue Calculator",
    copy: "See how much revenue a Shopify wishlist app could capture from shoppers who save products but haven't purchased yet.",
    tags: ["3 inputs", "Plan match", "ROI multiple"],
    cta: "Calculate wishlist revenue",
  },
  {
    id: "bis",
    Icon: Bell,
    accent: "var(--navy)",
    accentSoft: "var(--lime-soft)",
    img: IMG.bis,
    alt: "Notify me when available form on an out of stock product",
    title: "Back-in-Stock Revenue Calculator",
    copy: "Estimate the revenue you could recover from shoppers who hit an out-of-stock page and signed up for a back-in-stock alert.",
    tags: ["OOS derivation", "Plan match", "ROI multiple"],
    cta: "Calculate back-in-stock revenue",
  },
  {
    id: "compare",
    Icon: Scale,
    accent: "var(--blue)",
    accentSoft: "#EAF3FB",
    img: IMG.saveForLater,
    alt: "Save for later option in a cart",
    title: "Side-by-Side Comparison",
    copy: "Run two scenarios simultaneously, compare different store sizes, AOVs, or product types, and see the revenue delta between them.",
    tags: ["Two scenarios", "Revenue delta", "Plan comparison"],
    cta: "Compare scenarios",
  },
];

function ChooseCalculator({ onPick }) {
  return (
    <section className="px-6 py-20 sm:px-10" style={{ background: "var(--bg-alt)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <p className="swym-eyebrow text-center">Free tools</p>
          <h2 className="swym-h mx-auto mt-3 max-w-2xl text-4xl font-semibold sm:text-5xl">Choose your calculator</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg" style={{ color: "var(--navy-soft)" }}>
            Most stores already have a wishlist. Very few can tell you what it earned last quarter. This is how you find out.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CALC_CARDS.map((c, i) => (
            <Reveal key={c.id} delay={i * 100}>
              <div className="swym-card swym-cs flex h-full flex-col overflow-hidden">
                <div className="swym-cardimg">
                  <img src={CDN + c.img} alt={c.alt} loading="lazy" />
                </div>
                <div className="flex flex-1 flex-col p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: c.accentSoft }}>
                  <c.Icon size={22} style={{ color: c.accent }} />
                </span>
                <h3 className="swym-h mt-6 text-2xl font-semibold">{c.title}</h3>
                <p className="mt-3 text-base" style={{ color: "var(--navy-soft)" }}>
                  {c.copy}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <span key={t} className="swym-chip" style={{ cursor: "default" }}>
                      {t}
                    </span>
                  ))}
                </div>
                <button onClick={() => onPick(c.id)} className="swym-btn swym-btn-lime mt-auto w-full justify-center" style={{ marginTop: 28 }}>
                  {c.cta} <ArrowRight size={16} />
                </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- how it works ---------------- */

function HowItWorks({ onPick }) {
  const steps = [
    { n: "01", t: "Enter three things", d: "Monthly sessions, average order value, and your store category. Sessions are in Shopify Analytics under Reports.", I: MousePointerClick },
    { n: "02", t: "We size the opportunity", d: "We show a quick wins and a full implementation range, from conservative ecommerce benchmarks tuned to your category.", I: BarChart3 },
    { n: "03", t: "See the ROI of acting on it", d: "We match your estimated usage to a real Swym plan and show estimated revenue per dollar spent, so the next step is obvious: book a demo or install.", I: Sparkles },
  ];
  return (
    <section className="px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="swym-eyebrow">How it works</p>
          <h2 className="swym-h mt-3 max-w-2xl text-4xl font-semibold sm:text-5xl">From three inputs to a revenue number you can act on.</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 120}>
              <div className="swym-card h-full p-8">
                <div className="flex items-center justify-between">
                  <span className="swym-h text-4xl font-bold" style={{ color: "var(--lime-deep)" }}>
                    {s.n}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: "var(--lime-soft)" }}>
                    <s.I size={20} />
                  </span>
                </div>
                <h3 className="swym-h mt-6 text-2xl font-semibold">{s.t}</h3>
                <p className="mt-3 text-base" style={{ color: "var(--navy-soft)" }}>
                  {s.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <div className="mt-10 flex flex-wrap gap-3">
            <button className="swym-btn swym-btn-lime" onClick={() => onPick("wishlist")}>
              Start with Wishlist <ArrowRight size={16} />
            </button>
            <button className="swym-btn swym-btn-outline" onClick={() => onPick("compare")}>
              Compare two scenarios
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- heart moment ---------------- */

function HeartMoment() {
  return (
    <section className="px-6 py-16 sm:px-10" style={{ background: "var(--bg-alt)" }}>
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <p className="swym-eyebrow">Why intent matters</p>
          <h2 className="swym-h mt-3 text-4xl font-semibold sm:text-5xl">A save is a shopper raising their hand.</h2>
          <p className="mt-5 max-w-xl text-lg" style={{ color: "var(--navy-soft)" }}>
            Every wishlist save and every "notify me" click is a shopper telling you exactly what they want and when. Most stores let that signal disappear. The only purchase intent you'll ever own is the intent captured on your own store, and this calculator shows what it's worth when you act on it.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              ["45K+", "brands on Swym"],
              ["1.3K+", "5 star reviews"],
              ["~100", "countries served"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="swym-h text-3xl font-bold">{n}</p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {l}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={150}>
          <figure className="swym-shot">
            <img src={CDN + IMG.bisFlow} alt="A shopper signs up for a back in stock alert, then gets an email when the item returns" loading="lazy" className="block w-full" />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- success stories ---------------- */

function SuccessStories({ caseStudies, title, subtitle }) {
  return (
    <section className="px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="swym-eyebrow">Success stories</p>
              <h2 className="swym-h mt-3 max-w-2xl text-4xl font-semibold sm:text-5xl">{title}</h2>
              {subtitle && (
                <p className="mt-4 max-w-2xl text-lg" style={{ color: "var(--navy-soft)" }}>
                  {subtitle}
                </p>
              )}
            </div>
            <a href={SWYM + "/casestudies/customer-success-stories"} target="_blank" rel="noopener noreferrer" className="swym-btn swym-btn-outline">
              All case studies <ArrowRight size={16} />
            </a>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((c, i) => (
            <Reveal key={`${c.url}-${i}`} delay={(i % 3) * 100}>
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="swym-card swym-cs block h-full p-7" onClick={() => track("cta_case_study", { brand: c.brand })}>
                <p className="swym-eyebrow">{c.vertical}</p>
                <p className="swym-h mt-4 text-5xl font-bold">{c.stat}</p>
                <p className="swym-serif mt-2 text-base" style={{ color: "var(--navy-soft)" }}>
                  {c.statLabel}
                </p>
                <div className="mt-6 flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--border)" }}>
                  <span className="text-sm font-semibold">{c.brand}</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--blue)" }}>
                    Read case study <ArrowRight size={14} className="inline" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-xs" style={{ color: "var(--muted)" }}>
          Figures as published on getswym.com by Swym and its customers. They describe what those brands saw, not a projection for your store.
        </p>
      </div>
    </section>
  );
}

/* ---------------- calculator ---------------- */

function LeadGate({ cfg, lead, setLead, monthlyPreview, symbol }) {
  const [name, setName] = useState(lead.name);
  const [store, setStore] = useState(lead.store);
  const [email, setEmail] = useState(lead.email);
  const [error, setError] = useState("");

  function submit() {
    if (!name.trim() || !email.trim() || !email.includes("@")) {
      setError("Add your name and a work email to see your number.");
      return;
    }
    setError("");
    const leadData = { name: name.trim(), store: store.trim(), email: email.trim() };
    track("lead_captured", { mode: cfg.key, has_store: !!store.trim() });
    setLead({ captured: true, ...leadData });
    // Fire-and-forget: never block unlocking the calculator on this call, whether it succeeds,
    // fails, or HubSpot isn't configured yet.
    submitToHubSpot(leadData).then((result) => {
      track("hubspot_submit", { mode: cfg.key, ...result });
    });
  }

  return (
    <div className="swym-card p-7 sm:p-8 text-center">
      <p className="swym-eyebrow">Your estimate is ready</p>
      <h2 className="swym-h mt-2 text-3xl font-semibold">
        {fmtMoney(monthlyPreview, symbol).slice(0, 1)}
        <span style={{ filter: "blur(6px)" }}>{fmtMoney(monthlyPreview, symbol).slice(1)}</span>
        <span className="text-lg font-medium" style={{ color: "var(--muted)" }}>
          {" "}
          / month
        </span>
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm" style={{ color: "var(--muted)" }}>
        Tell us where to send it, and we'll unlock your plan match and ROI too.
      </p>
      <div className="mx-auto mt-6 max-w-sm space-y-4 text-left">
        <div>
          <label className="swym-label" htmlFor="lead-name">
            Name
          </label>
          <input id="lead-name" className="swym-input mt-2" placeholder="Jordan Reyes" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="swym-label" htmlFor="lead-store">
            Store name (optional)
          </label>
          <input id="lead-store" className="swym-input mt-2" placeholder="yourstore.com" value={store} onChange={(e) => setStore(e.target.value)} />
        </div>
        <div>
          <label className="swym-label" htmlFor="lead-email">
            Work email
          </label>
          <input id="lead-email" type="email" className="swym-input mt-2" placeholder="you@yourstore.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {error && (
          <p className="text-sm font-semibold" style={{ color: "#C0392B" }}>
            {error}
          </p>
        )}
        <button className="swym-btn swym-btn-lime w-full" onClick={submit}>
          See my results <ArrowRight size={16} />
        </button>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          We'll only use this to follow up about your results, no spam. See Swym's{" "}
          <a href={SWYM + "/terms-policies/swym-privacy-policy"} target="_blank" rel="noopener noreferrer" className="underline">
            privacy policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

function Calculator({ modeKey, s, update, reset, symbol, copied, copyText, lead, setLead }) {
  const cfg = MODES[modeKey];
  const r = useMemo(() => compute(modeKey, s), [modeKey, s]);
  const [refineOpen, setRefineOpen] = useState(false);
  const [formulaOpen, setFormulaOpen] = useState(false);
  const typicalAnim = useCountUp(r.typical.monthly, 900);
  const strongAnim = useCountUp(r.strong.monthly, 900);
  const annualAnim = useCountUp(r.strong.annual, 900);

  useEffect(() => {
    const id = setTimeout(() => track("estimate", { mode: modeKey, category: s.category, monthly_typical: Math.round(r.typical.monthly), monthly_strong: Math.round(r.strong.monthly), plan: r.plan.label }), 1500);
    return () => clearTimeout(id);
  }, [r.typical.monthly, r.strong.monthly, r.plan.label, modeKey, s.category]);

  function onVolume(v) {
    update({ volume: Math.max(0, Number(v) || 0) });
  }

  const sameRange = Math.round(r.typical.monthly) === Math.round(r.strong.monthly);
  const summary = `My store may have an estimated ${fmtMoneyRange(r.typical.monthly, r.strong.monthly, symbol)} monthly revenue opportunity from ${cfg.summaryNoun}, estimated with Swym's Revenue Opportunity Calculator.`;

  return (
    <main className="px-6 pb-8 pt-12 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "var(--lime-soft)" }}>
              <cfg.Icon size={22} />
            </span>
            <h1 className="swym-h text-4xl font-semibold sm:text-5xl">{cfg.title}</h1>
          </div>
          <p className="mt-4 max-w-2xl text-lg" style={{ color: "var(--navy-soft)" }}>
            {cfg.subtitle}
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          <div className="swym-card p-7 sm:p-8 lg:sticky lg:top-6 lg:col-span-5">
            <div className="flex items-baseline justify-between">
              <h2 className="swym-h text-2xl font-semibold">Your store</h2>
              <button onClick={reset} className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--navy-soft)" }}>
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Field id="volume" label="Monthly sessions" help="Shopify Analytics, Reports, Sessions" value={s.volume} onChange={onVolume} />
              <Field id="aov" label="Average order value" help="Average revenue per order" value={s.aov} onChange={(v) => update({ aov: Math.max(0, Number(v) || 0) })} prefix={symbol} />
            </div>
            <div className="mt-5">
              <CategorySelect id="category" value={s.category} onChange={(v) => update({ category: v })} />
            </div>

            <button onClick={() => setRefineOpen(!refineOpen)} className="mt-6 flex w-full items-center justify-between border-t pt-5 text-sm font-semibold" style={{ borderColor: "var(--border)", color: "var(--navy-soft)" }} aria-expanded={refineOpen}>
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={16} /> Refine your assumptions
              </span>
              {refineOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {refineOpen && (
              <div className="swym-pop mt-4 space-y-5">
                <div className="flex items-center justify-between gap-4 rounded-2xl p-4" style={{ background: "var(--bg-alt)" }}>
                  <div>
                    <p className="swym-label">Use my own counts</p>
                    <p className="swym-help" style={{ marginTop: 2 }}>
                      Replace the benchmarks with your real monthly numbers.
                    </p>
                  </div>
                  <Toggle checked={s.useOwnData} onChange={(v) => update({ useOwnData: v })} label="Use my own counts" />
                </div>
                {s.useOwnData ? (
                  <div className="space-y-5">
                    <Field id="own1" label={`Actual monthly ${cfg.stage1Label.toLowerCase()}`} value={s.ownStage1} onChange={(v) => update({ ownStage1: Math.max(0, Number(v) || 0) })} />
                    <Field id="own2" label={`Actual monthly ${cfg.stage2Label.toLowerCase()}`} value={s.ownStage2} onChange={(v) => update({ ownStage2: Math.max(0, Number(v) || 0) })} />
                  </div>
                ) : (
                  <p className="swym-help">
                    Estimates use conservative ecommerce benchmarks, tuned by store category. We assume an industry average {BENCH.iacvr}% conversion rate and {BENCH.cartAbandon}% cart abandonment.
                  </p>
                )}
              </div>
            )}

            {lead.captured && <ProofPoints cfg={cfg} />}
          </div>

          <div key={modeKey} className="swym-enter space-y-6 lg:col-span-7">
            {!lead.captured ? (
              <LeadGate cfg={cfg} lead={lead} setLead={setLead} monthlyPreview={r.strong.monthly} symbol={symbol} />
            ) : (
              <>
                <section className="swym-panel" aria-live="polite">
                  <div className="p-7 sm:p-9">
                    <p className="text-sm font-semibold" style={{ color: "var(--navy-soft)" }}>
                      {cfg.resultLabel}
                    </p>
                    <p className="swym-h swym-num mt-2 text-4xl font-bold sm:text-6xl">
                      {sameRange ? fmtMoney(strongAnim, symbol) : <>{fmtMoney(typicalAnim, symbol)} <span className="text-2xl font-medium sm:text-4xl" style={{ color: "var(--muted)" }}>to</span> {fmtMoney(strongAnim, symbol)}</>}
                    </p>
                    <p className="mt-3 max-w-lg text-sm" style={{ color: "var(--navy-soft)" }}>
                      {s.useOwnData
                        ? "Based on the counts you entered."
                        : `Conservative estimate for a ${getCategory(s.category).label.toLowerCase()} store. Up to ${fmtMoney(annualAnim, symbol)} a year${sameRange ? "" : " with every feature live"}.`}
                    </p>

                    <Breakdown modeKey={modeKey} cfg={cfg} s={s} r={r} symbol={symbol} />
                  </div>

                  <PlanFit r={r} cfg={cfg} symbol={symbol} />
                </section>

                <div className="flex flex-wrap items-center gap-3">
                  <button className="swym-btn swym-btn-ghost" onClick={() => copyText(summary, "summary")}>
                    {copied === "summary" ? <Check size={15} /> : <Copy size={15} />}
                    {copied === "summary" ? "Copied" : "Copy summary"}
                  </button>
                  <button className="swym-btn swym-btn-ghost" onClick={() => copyText(buildShareUrl(modeKey, s), "link")}>
                    {copied === "link" ? <Check size={15} /> : <Copy size={15} />}
                    {copied === "link" ? "Copied" : "Copy link"}
                  </button>
                  <button onClick={() => setFormulaOpen(!formulaOpen)} className="ml-auto flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--navy-soft)" }} aria-expanded={formulaOpen}>
                    How we estimate this {formulaOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
                {formulaOpen && <Formula modeKey={modeKey} cfg={cfg} s={s} r={r} symbol={symbol} />}
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  An illustrative estimate from the inputs above, not a guarantee. Results depend on shopper behavior, product mix, and how fully Swym is set up.
                </p>

                <NextStep cfg={cfg} r={r} />
                <TrustStripInline />
              </>
            )}
          </div>
        </div>

        <Insights cfg={cfg} />
        <FAQ cfg={cfg} />
      </div>

      <div className="mx-auto mt-16 max-w-7xl">
        <div className="-mx-6 sm:-mx-10">
          <SuccessStories caseStudies={cfg.caseStudies} title={modeKey === "bis" ? "Brands recovering revenue from stockouts" : "Brands turning wishlists into revenue"} subtitle="Real results from Swym customers in the same product area you just calculated." />
        </div>
        <ResourcesRow modeKey={modeKey} />
      </div>
    </main>
  );
}

function NextStep({ cfg, r }) {
  return (
    <div className="swym-band relative overflow-hidden rounded-3xl border p-8 sm:p-10" style={{ borderColor: "var(--lime-line)" }}>
      <div className="relative">
        <p className="swym-eyebrow">Your next step</p>
        <h3 className="swym-h mt-3 text-3xl font-semibold">{cfg.productHeadline}</h3>
        <p className="mt-3 max-w-xl text-base" style={{ color: "var(--navy-soft)" }}>
          {cfg.productCopy}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {r.enterprise ? (
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="swym-btn swym-btn-lime" onClick={() => track("cta_demo", { mode: cfg.key, plan: "enterprise" })}>
              Speak to our team <ArrowRight size={16} />
            </a>
          ) : (
            <>
              <a href={cfg.installUrl} target="_blank" rel="noopener noreferrer" className="swym-btn swym-btn-lime" onClick={() => track("cta_install", { mode: cfg.key, plan: r.plan.label })}>
                Install {cfg.productName} on Shopify <ArrowRight size={16} />
              </a>
              <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="swym-btn swym-btn-outline" onClick={() => track("cta_demo", { mode: cfg.key, plan: r.plan.label })}>
                Book a demo <ArrowRight size={16} />
              </a>
            </>
          )}
          <button
            className="swym-btn swym-btn-outline"
            onClick={() => {
              track("cta_chat", { mode: cfg.key, plan: r.plan.label });
              if (typeof window !== "undefined" && window.Intercom) window.Intercom("show");
              else window.open(DEMO_URL, "_blank", "noopener,noreferrer");
            }}
          >
            Chat with us
          </button>
          <a href={cfg.productUrl} target="_blank" rel="noopener noreferrer" className="swym-btn swym-btn-ghost">
            Explore {cfg.productName}
          </a>
        </div>
        <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
          {r.enterprise
            ? "At your volume, pricing is tailored. Talk to our team for an exact number."
            : `${r.plan.label} plan${r.plan.price ? ` at $${r.plan.price.toFixed(2)}/mo USD` : ", free at this volume"}. 30-day free trial on paid plans.`}
        </p>
      </div>
    </div>
  );
}

function ProofPoints({ cfg }) {
  return (
    <div className="mt-6 rounded-2xl p-5" style={{ background: "var(--bg-alt)", border: "1px solid var(--border)" }}>
      <p className="swym-eyebrow">What the numbers say</p>
      <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
        Source: aggregated Swym network data (getswym.com/statistics)
      </p>
      <ul className="mt-3 space-y-3">
        {cfg.citationsData.map((c, i) => (
          <li key={i} className="flex items-baseline gap-3">
            <span className="swym-h shrink-0 text-lg font-bold" style={{ color: "var(--blue)", minWidth: 64 }}>
              {c.stat}
            </span>
            <span className="text-sm" style={{ color: "var(--navy-soft)" }}>
              {c.context}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const DRIVER_COLORS = ["var(--navy)", "var(--lime-deep)", "var(--lime-line)"];

function Breakdown({ modeKey, cfg, s, r, symbol }) {
  // One stacked bar split by revenue driver. The scenario toggle only exists where the two
  // scenarios differ (Wishlist, benchmark mode); Back in Stock has one figure.
  const hasToggle = modeKey === "wishlist" && !s.useOwnData;
  const [view, setView] = useState("strong");
  const sc = hasToggle ? r[view] : r.strong;
  if (s.useOwnData) {
    return (
      <p className="swym-num mt-8 border-t pt-5 text-sm" style={{ borderColor: "var(--border)", color: "var(--navy-soft)" }}>
        {fmtCount(sc.stage1)} {cfg.stage1Label.toLowerCase()}, {fmtCount(sc.stage2)} {cfg.stage2Label.toLowerCase()}, {fmtMoney(s.aov, symbol)} average order value.
      </p>
    );
  }
  const drivers = [...sc.drivers].sort((a, b) => b.value - a.value).map((d, i) => ({ ...d, color: DRIVER_COLORS[modeKey === "bis" ? 1 : i] }));
  const total = sc.monthly || 1;
  return (
    <div className="mt-8 border-t pt-6" style={{ borderColor: "var(--border)" }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold">Where it comes from</h3>
        {hasToggle && (
          <div className="swym-seg" role="radiogroup" aria-label="Scenario">
            {[
              ["typical", "Quick wins"],
              ["strong", "Full implementation"],
            ].map(([k, label]) => (
              <button key={k} role="radio" aria-checked={view === k} data-active={view === k} onClick={() => setView(k)}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      {hasToggle && (
        <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
          {view === "typical" ? "Reminders and save for later switched on, with a first lift in conversion." : "Every feature live, closing half the gap to a best-in-class conversion rate."}
        </p>
      )}

      <div className="swym-stack mt-5" aria-hidden="true">
        {drivers.map((d) => (
          <span key={d.label} style={{ flexGrow: Math.max(d.value, total * 0.012), background: d.color }} />
        ))}
      </div>

      <ul className="mt-5">
        {drivers.map((d) => (
          <li key={d.label} className="swym-ledger">
            <span className="flex items-center gap-3">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: d.color }} />
              <span className="text-sm font-semibold">{d.label}</span>
            </span>
            <span className="swym-num text-sm" style={{ color: "var(--muted)" }}>
              {Math.round((d.value / total) * 100)}%
            </span>
            <span className="swym-num text-right text-base font-bold">{fmtMoney(d.value, symbol)}</span>
          </li>
        ))}
      </ul>

      <p className="swym-num mt-5 text-sm leading-relaxed" style={{ color: "var(--navy-soft)" }}>
        {fmtCount(r.volume)} sessions
        {sc.steps.map((st) => (
          <span key={st.label}>
            <span className="mx-2" style={{ color: "var(--lime-deep)" }}>
              /
            </span>
            {fmtCount(st.value)} {st.label.startsWith("Swym") ? st.label : st.label.charAt(0).toLowerCase() + st.label.slice(1)}
          </span>
        ))}
      </p>
    </div>
  );
}

function PlanFit({ r, cfg, symbol }) {
  const p = r.plan;
  const roiAnim = useCountUp(r.roiStrong || 0, 900);
  const sameRoi = Math.round(r.typical.monthly) === Math.round(r.strong.monthly);
  // Plans as equal segments, not a log scale: the marker sits inside the matched plan, at how far
  // usage has moved from the previous plan's cap to this one's.
  const rungs = [...cfg.plans, { id: "enterprise", label: "Enterprise", cap: null }];
  const idx = r.enterprise ? rungs.length - 1 : rungs.findIndex((x) => x.id === p.id);
  const prevCap = idx > 0 ? rungs[idx - 1].cap : 0;
  const within = r.enterprise ? 0.5 : Math.min(1, Math.max(0, (r.strong.usage - prevCap) / ((p.cap || 1) - prevCap)));
  const marker = ((idx + within) / rungs.length) * 100;
  const notes = [];
  if (r.enterprise) notes.push(cfg.entBundlesWishlist ? "At this volume, Back in Stock's Enterprise tier is one bundled plan that also includes Wishlist Plus." : "At this scale, pricing usually covers the wider Swym suite, tailored to your volume.");
  if (p.requiresShopifyPlus || (r.enterprise && cfg.key === "wishlist")) notes.push("Available on Shopify Plus.");
  if (r.nearQuota) notes.push(`You would use about ${r.quotaPct}% of this plan's monthly cap. Over the cap, Swym pauses new actions until the next cycle or an upgrade.`);
  if (r.monthsToLifetime != null) notes.push(`About ${r.monthsToLifetime} months to the ${fmtCount(p.lifetimeCap)}-action storage limit. The oldest data drops off after that.`);
  if (r.showEnterpriseNote) notes.push("Stores this size sometimes move to Enterprise for support and customization. Check with our team.");
  return (
    <div className="swym-planband p-7 sm:p-9">
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-5">
        <div className="min-w-0">
          <p className="text-sm" style={{ color: "rgba(255,255,255,.72)" }}>
            Your plan
          </p>
          <p className="swym-h mt-1 text-3xl font-bold">
            {r.enterprise ? "Enterprise" : p.label}
            <span className="ml-3 text-lg font-medium" style={{ color: "rgba(255,255,255,.75)" }}>
              {r.enterprise ? "custom pricing" : p.price === 0 ? "free" : `${fmtMoneyCents(p.price)} a month`}
            </span>
          </p>
        </div>
        {!r.enterprise && p.price > 0 && (
          <div className="sm:text-right">
            <p className="swym-h swym-num text-4xl font-bold" style={{ color: "var(--lime)" }}>
              {sameRoi ? fmtX(roiAnim) : <>{fmtX(r.roiTypical)} to {fmtX(roiAnim)}</>}
            </p>
            <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,.72)" }}>
              revenue for every $1 of plan cost
            </p>
          </div>
        )}
        {r.enterprise && r.roiFloor != null && (
          <p className="max-w-xs text-sm" style={{ color: "rgba(255,255,255,.8)" }}>
            Even at Premium pricing, this estimate is about <strong className="text-white">{fmtX(r.roiFloor)}</strong> the subscription cost.
          </p>
        )}
      </div>

      <p className="swym-num mt-4 text-sm" style={{ color: "rgba(255,255,255,.72)" }}>
        About {fmtCount(r.strong.usage)} {cfg.usageNoun} a month{!r.enterprise && p.cap ? `, and ${p.label} allows up to ${fmtCount(p.cap)}` : ""}.
      </p>

      <div className="relative mt-6">
        <div className="swym-rungs">
          {rungs.map((x, i) => (
            <span key={x.id} data-active={i === idx} />
          ))}
        </div>
        <span className="swym-marker" style={{ left: `${marker}%` }} title={`About ${fmtCount(r.strong.usage)} ${cfg.usageNoun} a month`} />
        <div className="mt-3 grid" style={{ gridTemplateColumns: `repeat(${rungs.length}, minmax(0, 1fr))` }}>
          {rungs.map((x, i) => (
            <span key={x.id} className="pr-2 text-xs" style={{ color: i === idx ? "#fff" : "rgba(255,255,255,.55)", fontWeight: i === idx ? 700 : 500 }}>
              {x.label}
              <span className="swym-num mt-0.5 block font-normal" style={{ color: "rgba(255,255,255,.5)" }}>
                {x.cap ? `up to ${fmtCount(x.cap)}` : "custom"}
              </span>
            </span>
          ))}
        </div>
      </div>

      {!r.enterprise && p.price > 0 && (
        <p className="swym-num mt-6 text-sm" style={{ color: "rgba(255,255,255,.8)" }}>
          {fmtMoney(r.net, symbol)} a month left after the subscription{sameRoi ? "" : ", with full implementation"}.
        </p>
      )}
      {!r.enterprise && p.price === 0 && (
        <p className="mt-6 text-sm" style={{ color: "rgba(255,255,255,.8)" }}>
          No subscription cost at this volume.
        </p>
      )}
      {notes.length > 0 && (
        <ul className="mt-4 space-y-1 text-xs" style={{ color: "rgba(255,255,255,.62)" }}>
          {notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,.55)" }}>
        Matched on estimated usage, not billing. Prices in USD from{" "}
        <a href={cfg.pricingUrl} target="_blank" rel="noopener noreferrer" className="underline">
          getswym.com/pricing
        </a>
        .
      </p>
    </div>
  );
}

function Formula({ modeKey, cfg, s, r, symbol }) {
  // Deliberately light on specifics: shows what was estimated, not every benchmark behind it.
  const lines = [];
  lines.push(`Store category: ${getCategory(s.category).label}. Conservative benchmarks, ${BENCH.iacvr}% industry average conversion rate assumed`);
  lines.push(`Estimated revenue: ${fmtMoneyRange(r.typical.monthly, r.strong.monthly, symbol)} monthly`);
  lines.push(`Estimated usage: ${fmtCount(r.strong.usage)} ${cfg.usageNoun}/mo, used only to match a plan`);
  if (!r.enterprise && r.plan.price > 0) lines.push(`Revenue per $1 of plan: ${fmtX(r.roiTypical)} to ${fmtX(r.roiStrong)} against a $${r.plan.price.toFixed(2)} plan`);
  return (
    <div className="swym-pop mt-3 rounded-2xl p-5 text-sm leading-relaxed" style={{ background: "var(--bg-alt)", color: "var(--navy-soft)" }}>
      {lines.map((t) => (
        <p key={t} className="py-1">
          {t}
        </p>
      ))}
    </div>
  );
}

function FAQ({ cfg }) {
  return (
    <div className="mt-12">
      <p className="swym-eyebrow">Quick answers</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cfg.faq.map((f, i) => (
          <div key={i} className="swym-card p-6">
            <p className="font-semibold">{f.q}</p>
            <p className="mt-2 text-sm" style={{ color: "var(--navy-soft)" }}>
              {f.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrustStripInline() {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl px-5 py-4" style={{ background: "var(--bg-alt)", border: "1px solid var(--border)" }}>
      <img src={"https://cdn.prod.website-files.com/67a1ca5bb1b9dbe1837f156e/67a9b1261772e51d19d15846_shopifyPlus_certifiedPartner.png"} alt="Shopify Plus certified app" style={{ height: 34, width: "auto" }} />
      <span className="hidden h-6 w-px sm:block" style={{ background: "var(--border)" }} />
      <span className="flex items-center gap-1" style={{ color: "#F5B301" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={14} fill="#F5B301" />
        ))}
      </span>
      <span className="text-sm font-medium">Over 1.3K 5 star reviews</span>
    </div>
  );
}

function Insights({ cfg }) {
  return (
    <div className="mt-12">
      <p className="swym-eyebrow">Where to investigate next</p>
      <p className="mt-2 max-w-2xl text-base" style={{ color: "var(--navy-soft)" }}>
        Can you say what your {cfg.key === "bis" ? "restock alerts" : "wishlist"} earned last quarter? Most merchants can't. Start here.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cfg.insights.map((q) => (
          <li key={q} className="flex items-start gap-3 rounded-2xl p-4 text-base" style={{ background: "var(--bg-alt)", color: "var(--navy-soft)" }}>
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--lime-deep)" }} />
            {q}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResourcesRow({ modeKey }) {
  const links = [
    { t: "Swym blog", d: "Strategies to capture and convert shopper intent.", href: SWYM + "/blog" },
    { t: "Wishlist statistics", d: "Data and benchmarks from across the Swym network.", href: SWYM + "/statistics" },
    { t: "Marketing playbooks", d: "Step-by-step plays for wishlist and restock campaigns.", href: SWYM + "/playbooks" },
    { t: modeKey === "bis" ? "Back in Stock product page" : "Wishlist Plus product page", d: "Features, integrations and pricing in one place.", href: modeKey === "bis" ? MODES.bis.productUrl : MODES.wishlist.productUrl },
  ];
  return (
    <div className="mt-4">
      <p className="swym-eyebrow flex items-center gap-2">
        <BookOpen size={14} /> Keep reading
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="swym-card swym-cs block p-5">
            <p className="font-semibold">{l.t}</p>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              {l.d}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ---------------- compare ---------------- */

function Compare({ modeKey, setModeKey, data, update, reset, symbol }) {
  const cfg = MODES[modeKey];
  const ra = useMemo(() => compute(modeKey, data.a), [modeKey, data.a]);
  const rb = useMemo(() => compute(modeKey, data.b), [modeKey, data.b]);
  // Uses the full-implementation scenario for the delta, consistent with plan matching elsewhere.
  const deltaM = rb.strong.monthly - ra.strong.monthly;
  const deltaA = rb.strong.annual - ra.strong.annual;
  const deltaPct = ra.strong.monthly > 0 ? (deltaM / ra.strong.monthly) * 100 : null;
  const dAnim = useCountUp(Math.abs(deltaM));

  return (
    <main className="px-6 pb-8 pt-12 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="swym-h text-4xl font-semibold sm:text-5xl">Compare two scenarios</h1>
            <p className="mt-4 max-w-2xl text-lg" style={{ color: "var(--navy-soft)" }}>
              Run two calculations side by side to see the revenue delta between them, handy for "what if traffic grows" or "what if we capture more intent" conversations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="swym-tabs">
              <button className="swym-tab" data-active={modeKey === "wishlist"} onClick={() => setModeKey("wishlist")}>
                <Heart size={15} /> Wishlist
              </button>
              <button className="swym-tab" data-active={modeKey === "bis"} onClick={() => setModeKey("bis")}>
                <Bell size={15} /> Back in Stock
              </button>
            </div>
            <button onClick={reset} className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--navy-soft)" }}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <ScenarioCard title="Scenario A" modeKey={modeKey} cfg={cfg} s={data.a} r={ra} update={(p) => update("a", p)} symbol={symbol} />
          <ScenarioCard title="Scenario B" modeKey={modeKey} cfg={cfg} s={data.b} r={rb} update={(p) => update("b", p)} symbol={symbol} />
        </div>

        <div key={modeKey} className="swym-card-navy swym-enter mt-6 p-7 sm:p-8" aria-live="polite">
          <p className="swym-eyebrow" style={{ color: "rgba(255,255,255,.7)" }}>
            Scenario B compared to A
          </p>
          <div className="mt-3 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="swym-h text-5xl font-bold" style={{ color: deltaM >= 0 ? "var(--lime)" : "#FFB4B4" }}>
                {deltaM >= 0 ? "+" : "-"}
                {fmtMoney(dAnim, symbol)}
              </p>
              <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,.7)" }}>
                monthly revenue delta
              </p>
            </div>
            <div>
              <p className="swym-h text-3xl font-bold">
                {deltaA >= 0 ? "+" : "-"}
                {fmtMoney(Math.abs(deltaA), symbol)}
              </p>
              <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,.7)" }}>
                annual revenue delta
              </p>
            </div>
            <div>
              <p className="swym-h text-3xl font-bold">{deltaPct == null ? "n/a" : `${deltaPct >= 0 ? "+" : ""}${Math.round(deltaPct)}%`}</p>
              <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,.7)" }}>
                change vs Scenario A
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="swym-btn swym-btn-lime" onClick={() => track("cta_demo", { mode: modeKey, placement: "compare" })}>
              Book a demo <ArrowRight size={16} />
            </a>
            <a href={cfg.installUrl} target="_blank" rel="noopener noreferrer" className="swym-btn text-white" style={{ border: "1.5px solid rgba(255,255,255,.5)" }} onClick={() => track("cta_install", { mode: modeKey, placement: "compare" })}>
              Install {cfg.productName}
            </a>
          </div>
          <p className="mt-5 text-xs" style={{ color: "rgba(255,255,255,.6)" }}>
            Both scenarios are illustrative estimates from the assumptions entered above, not projections.
          </p>
        </div>
      </div>
    </main>
  );
}

function ScenarioCard({ title, modeKey, cfg, s, r, update, symbol }) {
  const mAnim = useCountUp(r.strong.monthly);
  function onVolume(v) {
    update({ volume: Math.max(0, Number(v) || 0) });
  }
  return (
    <div className="swym-card p-7">
      <div className="flex items-center justify-between">
        <h2 className="swym-h text-2xl font-semibold">{title}</h2>
        <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "var(--lime-soft)", border: "1px solid var(--lime-line)" }}>
          Full implementation
        </span>
      </div>
      <div className="mt-6 space-y-5">
        <Field id={`${title}-v`} label="Monthly sessions" value={s.volume} onChange={onVolume} />
        <Field id={`${title}-aov`} label="Average order value" value={s.aov} onChange={(v) => update({ aov: Math.max(0, Number(v) || 0) })} prefix={symbol} />
        <CategorySelect id={`${title}-category`} value={s.category} onChange={(v) => update({ category: v })} />
      </div>
      <div className="swym-card-lime mt-6 p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold" style={{ color: "var(--navy-soft)" }}>
            {cfg.stage1Label}
          </span>
          <span className="swym-h text-lg font-bold">{fmtCount(r.strong.stage1)}</span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-sm font-semibold" style={{ color: "var(--navy-soft)" }}>
            {cfg.stage2Label}
          </span>
          <span className="swym-h text-lg font-bold">{fmtCount(r.strong.stage2)}</span>
        </div>
        <div className="mt-3 flex items-baseline justify-between border-t pt-3" style={{ borderColor: "var(--lime-line)" }}>
          <span className="text-sm font-semibold">Estimated monthly revenue</span>
          <span className="swym-h text-3xl font-bold">{fmtMoney(mAnim, symbol)}</span>
        </div>
        <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
          {r.enterprise ? `Enterprise volume (${fmtCount(r.strong.usage)} ${cfg.usageNoun}/mo), custom pricing` : `${r.plan.label} plan${r.plan.price ? ` ($${r.plan.price.toFixed(2)}/mo), est. ${fmtX(r.roiStrong)} revenue per $1` : ", free at this volume"}`}
        </p>
      </div>
    </div>
  );
}

/* ---------------- shared inputs ---------------- */

function Field({ id, label, help, value, onChange, prefix }) {
  return (
    <div>
      <label htmlFor={id} className="swym-label">
        {label}
      </label>
      <div className="relative mt-2">
        {prefix && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base" style={{ color: "var(--muted)" }}>
            {prefix}
          </span>
        )}
        <input id={id} type="number" min={0} inputMode="decimal" className="swym-input" style={prefix ? { paddingLeft: 32 } : undefined} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
      {help && <p className="swym-help">{help}</p>}
    </div>
  );
}

function CategorySelect({ id, value, onChange }) {
  return (
    <fieldset className="min-w-0">
      <legend id={id} className="swym-label">
        Store category
      </legend>
      <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-labelledby={id}>
        {CATEGORIES.map((c) => (
          <button key={c.id} type="button" role="radio" aria-checked={value === c.id} data-active={value === c.id} className="swym-chip" onClick={() => onChange(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <p className="swym-help">Sets the engagement and order value benchmarks for your vertical.</p>
    </fieldset>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className="relative h-7 w-12 shrink-0 rounded-full transition-colors" style={{ background: checked ? "var(--lime-deep)" : "var(--border)" }}>
      <span className="absolute top-1 h-5 w-5 rounded-full bg-white transition-transform" style={{ transform: checked ? "translateX(24px)" : "translateX(4px)" }} />
    </button>
  );
}

/* ---------------- final cta + footer ---------------- */

function FinalCta({ goLanding }) {
  return (
    <section className="px-6 py-16 sm:px-10">
      <div className="swym-band mx-auto max-w-7xl overflow-hidden rounded-3xl border p-10 text-center sm:p-16" style={{ borderColor: "var(--lime-line)" }}>
        <div className="relative">
          <h3 className="swym-h mx-auto max-w-3xl text-4xl font-semibold sm:text-6xl">The intent already exists. Most stores never write it down.</h3>
          <p className="mx-auto mt-6 max-w-xl text-lg" style={{ color: "var(--navy-soft)" }}>
            Swym turns that shopper intent into revenue you can measure, captured on your own store.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="swym-btn swym-btn-lime" onClick={() => track("cta_demo", { placement: "final" })}>
              Book a demo <ArrowRight size={16} />
            </a>
            <a href={MODES.wishlist.installUrl} target="_blank" rel="noopener noreferrer" className="swym-btn swym-btn-outline" onClick={() => track("cta_install", { placement: "final" })}>
              Install on Shopify <ArrowRight size={16} />
            </a>
            <button onClick={goLanding} className="swym-btn swym-btn-ghost">
              Try the calculator again
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const FOOTER_COLS = [
  { h: "Learn more", links: [["About Us", "/about-us"], ["Agency Program", "/agency-program"], ["Customization Services", "/build-your-swym-experiences"], ["Technology Partners", "/technology-partners"], ["Pricing", "/pricing"], ["Careers", "/careers"]] },
  { h: "Verticals", links: [["Fashion", "/industry/apparel"], ["Beauty", "/industry/beauty"], ["Home & Decor", "/industry/home"], ["Jewelry", "/industry/jewelry"]] },
  { h: "Resources", links: [["Blog", "/blog"], ["Statistics", "/statistics"], ["Case Studies", "/casestudies/customer-success-stories"], ["Marketing Playbooks", "/playbooks"], ["Product Updates", "/product-updates"]] },
  { h: "Products", links: [["Wishlist Plus", "/features/wishlist"], ["Save for Later", "/features/save-for-later"], ["Back in Stock", "/features/back-in-stock-product-alerts"], ["Gift Registry", "/features/gift-registry"]] },
];

function Footer({ setView }) {
  return (
    <footer className="border-t px-6 pb-10 pt-14 sm:px-10" style={{ borderColor: "var(--border)", background: "var(--bg-alt)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <img src={LOGO_SRC} alt="Swym" style={{ height: 26 }} />
              <span className="swym-h text-2xl font-bold" style={{ letterSpacing: "-0.04em" }}>
                swym
              </span>
            </div>
            <p className="mt-4 max-w-xs text-base" style={{ color: "var(--navy-soft)" }}>
              Turning shopper intent into revenue you can measure.
            </p>
            <a href={MODES.wishlist.installUrl} target="_blank" rel="noopener noreferrer" className="swym-btn swym-btn-outline mt-6" style={{ padding: "10px 18px", fontSize: 14 }}>
              Get it on the Shopify App Store
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {FOOTER_COLS.map((c) => (
              <div key={c.h}>
                <p className="text-sm font-bold">{c.h}</p>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map(([t, p]) => (
                    <li key={t}>
                      <a href={SWYM + p} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: "var(--navy-soft)" }}>
                        {t}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-sm font-bold">Tools</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <button onClick={() => setView("wishlist")} className="text-sm" style={{ color: "var(--navy-soft)" }}>
                    Wishlist ROI Calculator
                  </button>
                </li>
                <li>
                  <button onClick={() => setView("bis")} className="text-sm" style={{ color: "var(--navy-soft)" }}>
                    Back in Stock ROI Calculator
                  </button>
                </li>
                <li>
                  <button onClick={() => setView("compare")} className="text-sm" style={{ color: "var(--navy-soft)" }}>
                    Compare Scenarios
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-xs" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
          <span>Copyright {"\u00A9"} 2026 Swym. Estimates are illustrative, not a guarantee of results.</span>
          <div className="flex items-center gap-4">
            <a href={SWYM + "/terms-policies/terms-of-service"} target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>
            <a href={SWYM + "/terms-policies/swym-privacy-policy"} target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
