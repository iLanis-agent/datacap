var D = require('./engine.js'), pass = 0, fail = 0;
function eq(n, a, b, t) { if (a !== null && a !== undefined && Math.abs(a - b) <= (t || 0.001)) pass++; else { fail++; console.log('FAIL', n, a, b); } }
function ok(n, c) { if (c) pass++; else { fail++; console.log('FAIL', n); } }
// Netflix help page figures
eq('low', D.TIERS.low.gbh, 0.3); eq('medium', D.TIERS.medium.gbh, 0.7); eq('sd', D.TIERS.sd.gbh, 1); eq('hd', D.TIERS.hd.gbh, 3); eq('uhd', D.TIERS.uhd.gbh, 7);
// worked examples: 2 h SD movie 2 GB, HD 6 GB, 4K 14 GB; half-hour show 0.5 / 1.5 / 3.5 GB
eq('2h sd', D.analyze(100, 'GB', 'sd', 2, 1, 30).perDayGb, 2); eq('2h hd', D.analyze(100, 'GB', 'hd', 2, 1, 30).perDayGb, 6); eq('2h 4k', D.analyze(100, 'GB', 'uhd', 2, 1, 30).perDayGb, 14);
eq('0.5h sd', D.analyze(100, 'GB', 'sd', 0.5, 1, 30).perDayGb, 0.5); eq('0.5h hd', D.analyze(100, 'GB', 'hd', 0.5, 1, 30).perDayGb, 1.5); eq('0.5h 4k', D.analyze(100, 'GB', 'uhd', 0.5, 1, 30).perDayGb, 3.5);
// month totals
var a = D.analyze(1, 'TB', 'hd', 2, 1, 30); eq('hd 2h month', a.monthGb, 180); eq('pct', a.pct, 18); ok('does not run out', a.runsOut === false && a.capDay === null); eq('days to cap', a.daysToCap, 1000 / 6);
var b = D.analyze(1, 'TB', 'hd', 6, 2, 30); eq('b per day', b.perDayGb, 36); eq('b month', b.monthGb, 1080); ok('runs out', b.runsOut === true); eq('b days to cap', b.daysToCap, 1000 / 36); ok('cap day 28', b.capDay === 28);
// max hours per day within cap
eq('max hours', D.analyze(300, 'GB', 'hd', 1, 1, 30).maxHoursPerDay, 300 / 90); eq('max hours 2 streams', D.analyze(300, 'GB', 'hd', 1, 2, 30).maxHoursPerDay, 300 / 180);
// best fitting tier
ok('best for 300 GB 2h', D.analyze(300, 'GB', 'low', 2, 1, 30).bestFitting === 'hd'); ok('best for 100 GB 2h', D.analyze(100, 'GB', 'low', 2, 1, 30).bestFitting === 'sd'); ok('none fits', D.analyze(5, 'GB', 'low', 2, 1, 30).bestFitting === null);
// unit and Mbps
eq('TB to GB', D.capGb(1.5, 'TB'), 1500); eq('GB passthrough', D.capGb(250, 'GB'), 250); eq('3 GB/h in Mbps', D.mbps(3), 6.6667, 0.001); eq('7 GB/h in Mbps', D.mbps(7), 15.5556, 0.001); eq('1 GB/h Mbps', D.mbps(1), 2.2222, 0.001);
// rows
var r = D.analyze(300, 'GB', 'hd', 2, 1, 30).rows; ok('5 rows', r.length === 5); eq('uhd row month', r[4].month, 420); ok('uhd does not fit', r[4].fits === false); ok('hd fits', r[3].fits === true);
// validation
ok('bad tier', D.analyze(100, 'GB', 'x', 2, 1, 30) === null); ok('bad cap', D.analyze(0, 'GB', 'hd', 2, 1, 30) === null); ok('bad hours', D.analyze(100, 'GB', 'hd', 25, 1, 30) === null); ok('bad streams', D.analyze(100, 'GB', 'hd', 2, 0, 30) === null && D.analyze(100, 'GB', 'hd', 2, 1.5, 30) === null); ok('bad days', D.analyze(100, 'GB', 'hd', 2, 1, 27) === null); ok('NaN', D.analyze(NaN, 'GB', 'hd', 2, 1, 30) === null);
console.log(pass + '/' + (pass + fail) + ' pass'); process.exit(fail ? 1 : 0);
