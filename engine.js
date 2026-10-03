(function (root) {
  'use strict';
  // Netflix Help Center, "How to control how much data Netflix uses" (help.netflix.com/en/node/87):
  // data per hour, per device, "up to": Low 0.3 GB, Medium 0.7 GB, High SD 1 GB, High HD 3 GB, High 4K 7 GB.
  var TIERS = { low: { label: 'Low (basic quality)', gbh: 0.3 }, medium: { label: 'Medium (standard quality)', gbh: 0.7 }, sd: { label: 'High, standard definition', gbh: 1 }, hd: { label: 'High, HD', gbh: 3 }, uhd: { label: 'High, 4K Ultra HD', gbh: 7 } };
  var ORDER = ['low', 'medium', 'sd', 'hd', 'uhd'];
  function capGb(value, unit) { return unit === 'TB' ? value * 1000 : value; }
  function mbps(gbh) { return gbh * 1e9 * 8 / 3600 / 1e6; }
  function analyze(cap, unit, tier, hoursPerDay, streams, days) {
    var t = TIERS[tier];
    if (!t || !(cap > 0 && cap <= 100000) || !(hoursPerDay > 0 && hoursPerDay <= 24) || !(streams >= 1 && streams <= 10 && streams === Math.floor(streams)) || !(days >= 28 && days <= 31 && days === Math.floor(days))) return null;
    var capG = capGb(cap, unit), perDay = t.gbh * hoursPerDay * streams, month = perDay * days;
    var daysToCap = capG / perDay, runsOut = daysToCap < days;
    var maxHours = capG / (t.gbh * streams * days);
    var best = null; ORDER.forEach(function (k) { if (TIERS[k].gbh * hoursPerDay * streams * days <= capG) best = k; });
    var rows = ORDER.map(function (k) { var m = TIERS[k].gbh * hoursPerDay * streams * days; return { tier: k, label: TIERS[k].label, gbh: TIERS[k].gbh, month: m, pct: m / capG * 100, fits: m <= capG }; });
    return { capG: capG, perDayGb: perDay, monthGb: month, pct: month / capG * 100, daysToCap: daysToCap, runsOut: runsOut, capDay: runsOut ? Math.floor(daysToCap) + 1 : null, maxHoursPerDay: maxHours, bestFitting: best, mbps: mbps(t.gbh), rows: rows, tierLabel: t.label };
  }
  root.DataCap = { TIERS: TIERS, ORDER: ORDER, capGb: capGb, mbps: mbps, analyze: analyze };
  if (typeof module !== 'undefined') module.exports = root.DataCap;
})(typeof window !== 'undefined' ? window : globalThis);
