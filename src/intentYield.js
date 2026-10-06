// Client for the Intent Yield API (swym-corp/intent-yield, web/api.ts).
//
// Intent Yield's ROI needs a scan of the store first: POST /api/scan starts it, GET /api/scan/:id
// reports progress, and POST /api/roi recalculates that scan's ROI from monthly sessions and AOV.
// `mode: "fast"` is sent on every scan: without it the API runs a paid deep scan.
//
// The base URL comes from VITE_IY_BASE. In local dev it is "/iy", which vite.config.js proxies to
// the real service, because the service does not send cross-origin headers for this site yet.

import { scenariosFromRoi } from "./roiModel.js";

export const IY_BASE = import.meta.env.VITE_IY_BASE || "https://score.getswym.com/intent-yield";

const POLL_MS = 3000;
const POLL_LIMIT = 60; // about 3 minutes; fast scans finished in about 40 seconds when tested

async function call(path, options = {}) {
  let res;
  try {
    res = await fetch(`${IY_BASE}${path}`, options);
  } catch (err) {
    if (err.name === "AbortError") throw err;
    // fetch only rejects without a response when the request never completed: the browser
    // refused it (cross-origin) or the network failed. The two cannot be told apart here.
    throw new Error("Could not reach Intent Yield. The browser blocked the request or the network failed.");
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Intent Yield returned ${res.status}`);
  return body;
}

export async function scanStore(storeUrl, signal) {
  const started = await call("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: storeUrl, mode: "fast" }),
    signal,
  });
  for (let i = 0; i < POLL_LIMIT; i++) {
    const job = await call(`/api/scan/${started.jobId}`, { signal });
    if (job.done) {
      if (!job.result) throw new Error(job.error || "Intent Yield finished without a result for this store.");
      return { jobId: started.jobId, vertical: job.result.vertical || null };
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }
  throw new Error("Intent Yield did not finish the scan in 3 minutes. Try again.");
}

export async function getRoi(jobId, sessions, aov, signal) {
  const body = await call("/api/roi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: jobId, monthly_sessions: sessions, aov_usd: aov }),
    signal,
  });
  if (!body.roi) throw new Error(body.note || "Intent Yield returned no estimate for these numbers.");
  return body.roi;
}

// Puts Intent Yield's figures into the calculator's result shape through the same
// scenariosFromRoi() the calculator uses for its own estimate. Plan usage stays the calculator's
// own: Intent Yield does not return it.
export function applyIntentYield(r, roi, modeKey, premiumPrice) {
  const sc = scenariosFromRoi(roi, modeKey);
  const typical = { ...r.typical, monthly: sc.quick.monthly, annual: sc.quick.monthly * 12, drivers: sc.quick.drivers };
  const strong = { ...r.strong, monthly: sc.full.monthly, annual: sc.full.monthly * 12, drivers: sc.full.drivers };
  const price = r.plan.price;
  return {
    ...r,
    typical,
    strong,
    roiTypical: price > 0 ? typical.monthly / price : null,
    roiStrong: price > 0 ? strong.monthly / price : null,
    roiFloor: r.enterprise ? strong.monthly / premiumPrice : null,
    net: price != null ? strong.monthly - price : null,
    source: "intent-yield",
  };
}
