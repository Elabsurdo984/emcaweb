const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function load() {
  const context = vm.createContext({ console });
  for (const file of ['pc-components-db.js', 'pc-compatibility.js', 'pc-recommender.js']) {
    vm.runInContext(readFileSync(path.join(__dirname, '../public/js', file), 'utf8'), context);
  }
  return vm.runInContext('({ engine: EMCA_RECOMMENDER, db: PC_DB, check: checkCompatibility, rate: emcaApplyCurrencyRate })', context);
}

test('Every offered build is complete, compatible, cooled and inside the available budget', () => {
  const { engine, check } = load();
  let checked = 0;
  for (const [use, config] of Object.entries(engine.uses)) {
    for (const profile of config.profiles) {
      for (const budget of [100000, 600000, 900000, 1500000, 3000000, 10000000]) {
        for (const wifi of [false, true]) {
          const r = engine.recommend({ use, goal: profile.id, budget, reserve: 50000, wifi });
          if (!r.proposal) {
            assert.equal(r.status, 'insufficient');
            assert.ok(r.minimumTotal > budget - 50000);
            continue;
          }
          const b = r.proposal.build;
          for (const cat of ['cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'pccase', 'cooler']) assert.ok(b[cat], cat);
          assert.equal(check(b).errors.length, 0);
          assert.ok(check(b).warnings.every(w => w.cats.includes('os')));
          assert.ok(b.gpu.id !== 'gpu-none' || b.cpu.hasIgpu);
          assert.ok(b.cooler.sockets.includes(b.cpu.socket));
          assert.equal(b.ram.type, b.motherboard.ramType);
          assert.ok(parseFloat(b.ram.capacity) >= 16);
          assert.ok(b.storage.storageType.startsWith('SSD'));
          assert.ok(!wifi || b.motherboard.hasWifi || /Wi-Fi/.test(b.wifi?.features));
          const sum = Object.values(b).reduce((s, p) => s + (p?.price || 0), 0);
          assert.equal(r.proposal.total, sum + engine.assembly);
          assert.ok(r.proposal.total + r.reserve <= budget);
          assert.equal(r.savings, budget - r.reserve - r.proposal.total);
          checked++;
        }
      }
    }
  }
  assert.ok(checked > 80);
});

test('More budget never inflates a build after the requested need is met', () => {
  const { engine } = load();
  for (const [use, config] of Object.entries(engine.uses)) for (const p of config.profiles) {
    const a = engine.recommend({ use, goal: p.id, budget: 10000000 });
    const b = engine.recommend({ use, goal: p.id, budget: 50000000 });
    assert.equal(a.status, 'recommended');
    assert.equal(b.proposal.total, a.proposal.total);
    assert.deepEqual(b.proposal.build, a.proposal.build);
  }
});

test('Office saves money on GPU, RAM, cooler and unrequested extras', () => {
  const { engine } = load();
  const r = engine.recommend({ use: 'oficina', goal: 'diario', budget: 10000000 });
  assert.equal(r.proposal.build.gpu.price, 0);
  assert.equal(r.proposal.build.cooler.price, 0);
  assert.equal(parseFloat(r.proposal.build.ram.capacity), 16);
  assert.equal(r.proposal.build.wifi, null);
  assert.ok(r.savings > r.proposal.total);
});

test('Gaming never uses a basic display-only iGPU as a gaming recommendation', () => {
  const { engine } = load();
  const light = engine.recommend({ use: 'gaming', goal: 'livianos', budget: 10000000 });
  assert.ok(['cpu-5600g', 'cpu-5600gt', 'cpu-8600g'].includes(light.proposal.build.cpu.id));
  const full = engine.recommend({ use: 'gaming', goal: '1080', budget: 10000000 });
  assert.notEqual(full.proposal.build.gpu.id, 'gpu-none');
  const cheaper = engine.recommend({ use: 'gaming', goal: '1080', budget: light.proposal.total });
  assert.equal(cheaper.status, 'alternative');
  assert.equal(cheaper.requested.id, '1080');
  assert.equal(cheaper.target.id, 'livianos');
  assert.ok(cheaper.desiredTotal > cheaper.available);
});

test('Too little money gives advice, not an unaffordable or incomplete build', () => {
  const { engine } = load();
  const r = engine.recommend({ use: 'oficina', goal: 'diario', budget: 1000 });
  assert.equal(r.status, 'insufficient');
  assert.equal(r.proposal, undefined);
  const atMinimum = engine.recommend({ use: 'oficina', goal: 'diario', budget: r.minimumTotal });
  assert.equal(atMinimum.status, 'recommended');
  assert.equal(atMinimum.savings, 0);
  assert.equal(engine.recommend({ use: 'oficina', goal: 'diario', budget: r.minimumTotal - 1 }).status, 'insufficient');
});

test('Storage, Wi-Fi and reserve are respected even when offering a simpler goal', () => {
  const { engine } = load();
  const input = { use: 'gaming', goal: '1440', budget: 10000000, storage: 2000, wifi: true, reserve: 300000 };
  const r = engine.recommend(input);
  assert.equal(r.proposal.build.storage.capacity, '2 TB');
  const simple = engine.recommend({ ...input, goal: 'livianos' });
  const alternative = engine.recommend({ ...input, budget: simple.proposal.total + input.reserve });
  assert.equal(alternative.status, 'alternative');
  assert.equal(alternative.proposal.build.storage.capacity, '2 TB');
  assert.ok(alternative.proposal.build.wifi || alternative.proposal.build.motherboard.hasWifi);
  assert.equal(alternative.savings, 0);
});

test('New prices change both the chosen parts and affordability; no duplicated price table', () => {
  const { engine, db, rate } = load();
  const input = { use: 'oficina', goal: 'diario', budget: 10000000 };
  const a = engine.recommend(input);
  db.cpu.find(p => p.id === a.proposal.build.cpu.id).price += 1000000;
  const b = engine.recommend(input);
  assert.notEqual(b.proposal.build.cpu.id, a.proposal.build.cpu.id);
  rate(1560);
  const c = engine.recommend(input);
  rate(3120);
  const d = engine.recommend(input);
  assert.ok(d.proposal.total > c.proposal.total * 1.9);
  assert.equal(engine.recommend({ ...input, budget: c.proposal.total }).status, 'insufficient');
});

test('Missing components, bad prices and invalid inputs fail without fabricating a build', () => {
  const { engine, db } = load();
  for (const budget of [NaN, Infinity, -1, 0]) assert.equal(engine.recommend({ use: 'oficina', goal: 'diario', budget }).status, 'invalid');
  assert.equal(engine.recommend({ use: 'missing', goal: 'missing', budget: 1000000 }).status, 'invalid');
  assert.equal(engine.recommend({ use: 'oficina', goal: 'diario', budget: 1000, reserve: 1000 }).status, 'invalid');
  const input = { use: 'oficina', goal: 'diario', budget: 10000000 };
  assert.equal(engine.recommend(input, { ...db, psu: [] }).status, 'unavailable');
  assert.equal(engine.recommend(input, { ...db, cpu: db.cpu.map(p => ({ ...p, price: NaN })) }).status, 'unavailable');
});
