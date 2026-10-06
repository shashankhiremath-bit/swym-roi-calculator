// ROI model shared with Swym Intent Yield. A line-for-line JavaScript copy of computeRoi() and
// ROI_BENCHMARKS in swym-corp/intent-yield src/roi.ts at commit dfb15d8215c1 (2026-07-12), so this
// calculator and Intent Yield's POST /api/roi return the same figures for the same sessions and AOV.
// Change it only together with intent-yield's src/roi.ts; test/roiModel.check.mjs compares the two.

export const ROI_BENCHMARKS = {
  swym_engage_rate: 4,     // % of site visitors who interact with a Swym widget
  wl_reminder_cvr: 6,      // % of wishlist reminder sends -> purchase (defined in source; not used in totals)
  bis_alert_cvr: 18,       // % of BIS alert sends -> purchase
  price_drop_cvr: 11,      // % of price-drop alert sends -> purchase
  save_later_cvr: 5,       // % of save-for-later reminder sends -> purchase
  flow_send_rate: 15,      // % of subscribers who receive a triggered flow in a month
  wl_recovery_rate: 4,     // % of total wishlisted GMV recovered per month via reminder flows
  sl_engage_rate: 20,      // % of wishlist users who also use save-for-later
  cvr_uplift_quick: 20,    // % of the CVR gap closed by connecting ESP flows alone
  cvr_uplift_full: 50,     // % of the CVR gap closed by full feature + flow implementation
  cvr_benchmark: 8,        // best-in-class Swym CVR ceiling used to size the uplift
  aov_lift_benchmark: 28,  // % AOV lift in high-performing Swym implementations
  industry_avg_cvr: 2.5,   // fallback CVR when merchant CVR is unknown
  bis_sub_rate: 0.5,       // est. BIS sub rate as % of traffic (potential when BIS off)
  wishlist_save_rate: 25,  // % of Swym-engaged sessions that create a wishlist
};

const numOr = (v, fallback = 0) => (typeof v === "number" && isFinite(v) ? v : fallback);

export function computeRoi(input, bench = ROI_BENCHMARKS) {
  const b = bench;
  const traffic = numOr(input.traffic);
  const storeAov = numOr(input.storeAov) || 100;
  const wlGmv = numOr(input.wlGmv);
  const bisOn = !!input.bisOn;
  const bisSubs = bisOn ? numOr(input.bisSubs) : 0;

  const swymAovProvided = numOr(input.swymAov) > 0;
  const swymAov = swymAovProvided ? numOr(input.swymAov) : storeAov * (1 + b.aov_lift_benchmark / 100);
  const aovLiftPct = storeAov > 0 ? Math.round(((swymAov / storeAov) - 1) * 100) : 0;

  const cvrProvided = numOr(input.currentCvr) > 0;
  const cvr = cvrProvided ? numOr(input.currentCvr) : b.industry_avg_cvr;

  const swymSessions = traffic * (b.swym_engage_rate / 100);

  const revProvided = numOr(input.currentRev) > 0;
  const curRev = revProvided ? numOr(input.currentRev) : (swymSessions && cvr ? swymSessions * (cvr / 100) * swymAov : 0);

  const hasData = !!(traffic || wlGmv || bisSubs || revProvided);
  if (!hasData) return null;

  const wlGmvEstimated = !(wlGmv > 0);
  const wlGmvUsed = wlGmvEstimated ? swymSessions * (b.wishlist_save_rate / 100) * swymAov : wlGmv;
  const wlRecovery = wlGmvUsed * (b.wl_recovery_rate / 100);

  const slUsers = wlGmvUsed > 0 ? (wlGmvUsed / swymAov) * (b.sl_engage_rate / 100) : 0;
  const slRecovery = slUsers * (b.save_later_cvr / 100) * swymAov * (b.flow_send_rate / 100);

  const bisSubsEstimated = !(bisSubs > 0);
  const bisSubsUsed = bisSubsEstimated ? traffic * (b.bis_sub_rate / 100) : bisSubs;
  const monthlySends = bisSubsUsed * (b.flow_send_rate / 100);
  const bisRecovery = monthlySends * 0.5 * (b.bis_alert_cvr / 100) * swymAov;
  const pdRecovery = monthlySends * 0.3 * (b.price_drop_cvr / 100) * swymAov;

  const cvrGap = Math.max(0, b.cvr_benchmark - cvr);
  const cvrUpliftQuick = swymSessions * (cvrGap * (b.cvr_uplift_quick / 100) / 100) * swymAov;
  const cvrUpliftFull = swymSessions * (cvrGap * (b.cvr_uplift_full / 100) / 100) * swymAov;

  const quickTotal = curRev + wlRecovery + slRecovery + bisRecovery + pdRecovery + cvrUpliftQuick;
  const fullTotal = curRev + wlRecovery + slRecovery + bisRecovery + pdRecovery + cvrUpliftFull;

  let bisPotential = null;
  let bisPotentialSubs = 0;
  if (!bisOn && traffic) {
    bisPotentialSubs = Math.round(traffic * (b.bis_sub_rate / 100));
    const estSends = bisPotentialSubs * (b.flow_send_rate / 100);
    bisPotential = estSends * 0.5 * (b.bis_alert_cvr / 100) * swymAov + estSends * 0.3 * (b.price_drop_cvr / 100) * swymAov;
  }

  return {
    resolved: { traffic, storeAov, swymAov, cvr, curRev, wlGmv: wlGmvUsed, bisOn, bisSubs: bisSubsUsed },
    estimated: { swymAov: !swymAovProvided, cvr: !cvrProvided, currentRev: !revProvided, wlGmv: wlGmvEstimated, bisSubs: bisSubsEstimated, traffic: false },
    aovLiftPct,
    drivers: {
      wishlist: wlRecovery,
      saveForLater: slRecovery,
      bis: bisRecovery,
      priceDrop: pdRecovery,
      bisPlusPriceDrop: bisRecovery + pdRecovery,
      cvrQuick: cvrUpliftQuick,
      cvrFull: cvrUpliftFull,
    },
    scenarios: { current: curRev, quick: quickTotal, full: fullTotal },
    uplift: {
      quickMonthly: quickTotal - curRev,
      fullMonthly: fullTotal - curRev,
      fullAnnual: (fullTotal - curRev) * 12,
    },
    bisPotential,
    bisPotentialSubs,
  };
}

// How the calculator shows a computeRoi() result. Used for both the calculator's own estimate and
// an estimate fetched from Intent Yield's API, so the two can only differ if their inputs differ.
// Monthly figures are `uplift` (new revenue), not `scenarios`, which add an estimate of revenue the
// store already earns. Back in Stock mode shows only the back-in-stock alert line.
export function scenariosFromRoi(roi, modeKey) {
  if (!roi) {
    const empty = { monthly: 0, drivers: [] };
    return { quick: empty, full: empty };
  }
  const d = roi.drivers;
  if (modeKey === "bis") {
    const bis = { monthly: d.bis, drivers: [{ label: "Back-in-stock alerts", value: d.bis }] };
    return { quick: bis, full: bis };
  }
  const shared = [
    { label: "Wishlist reminders", value: d.wishlist },
    { label: "Save for later", value: d.saveForLater },
    { label: "Back in stock and price drop", value: d.bisPlusPriceDrop },
  ];
  return {
    quick: { monthly: roi.uplift.quickMonthly, drivers: [...shared, { label: "Conversion uplift, quick wins", value: d.cvrQuick }] },
    full: { monthly: roi.uplift.fullMonthly, drivers: [...shared, { label: "Conversion uplift, full implementation", value: d.cvrFull }] },
  };
}
