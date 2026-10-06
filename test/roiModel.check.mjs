// Checks that roiModel.js gives the same figures as Swym Intent Yield's live POST /api/roi.
//   SCAN_ID=<jobId of any finished Intent Yield scan> node test/roiModel.check.mjs
// /api/roi is free: it recalculates an existing scan and never starts one.
import { computeRoi, scenariosFromRoi } from "../src/roiModel.js";

const BASE = process.env.IY_BASE || "https://score.getswym.com/intent-yield";
const SCAN_ID = process.env.SCAN_ID;
if (!SCAN_ID) { console.error("Set SCAN_ID to a finished Intent Yield scan id."); process.exit(2); }
const CASES = [[50000, 75], [12000, 40], [250000, 180], [900, 22], [1000000, 310]];

let failed = 0;
for (const [sessions, aov] of CASES) {
  const res = await fetch(`${BASE}/api/roi`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: SCAN_ID, monthly_sessions: sessions, aov_usd: aov }),
  });
  const body = await res.json();
  if (!res.ok || !body.roi) { console.log(`FAIL ${sessions}/${aov}: API ${res.status} ${body.error || body.note}`); failed++; continue; }
  const local = computeRoi({ traffic: sessions, storeAov: aov });
  for (const mode of ["wishlist", "bis"]) {
    const a = scenariosFromRoi(local, mode), b = scenariosFromRoi(body.roi, mode);
    for (const k of ["quick", "full"]) {
      const same = Math.round(a[k].monthly) === Math.round(b[k].monthly) &&
        a[k].drivers.every((d, i) => Math.round(d.value) === Math.round(b[k].drivers[i].value));
      if (!same) failed++;
      console.log(`${same ? "PASS" : "FAIL"} ${String(sessions).padStart(7)} sessions $${aov} ${mode.padEnd(8)} ${k.padEnd(5)} calculator ${Math.round(a[k].monthly)} | Intent Yield ${Math.round(b[k].monthly)}`);
    }
  }
}
console.log(failed ? `${failed} mismatches` : "All figures match");
process.exit(failed ? 1 : 0);
