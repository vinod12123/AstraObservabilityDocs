import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { DOC_SECTIONS } from '../src/docsData.js';
import { GROUPS, GUIDES, getGuide } from '../src/guideContent.js';
import { HANDBOOK } from '../src/handbookContent.js';
import { PRODUCT_SCREENS } from '../src/productScreenshots.js';

test('every navigation page has sections with unique anchor IDs', () => {
  for (const area of DOC_SECTIONS) {
    for (const page of area.pages) {
      const guide = getGuide(area, page);
      assert.ok(guide.sections.length > 0);
      assert.equal(new Set(guide.sections.map(s => s.id)).size, guide.sections.length);
      for (const section of guide.sections) assert.ok(section.blocks.length > 0);
    }
  }
});

test('navigation groups cover each area exactly once', () => {
  assert.deepEqual(GROUPS.flatMap(g => g.ids).sort(), DOC_SECTIONS.map(s => s.id).sort());
});

test('authored screenshot assets exist and have explanatory captions', () => {
  for (const guide of DOC_SECTIONS.flatMap(area => area.pages.map(page => getGuide(area, page)))) {
    for (const section of guide.sections) {
      for (const block of section.blocks.filter(b => b.type === 'image')) {
        assert.ok(block.caption);
        assert.ok(existsSync(new URL(`../public${block.src}`, import.meta.url)), block.src);
      }
    }
  }
});

test('product captures belong to published routes and remain unique on repeated visits', () => {
  const routes = new Set(DOC_SECTIONS.flatMap(area => area.pages.map(page => `${area.id}/${page.id}`)));
  assert.equal(Object.keys(PRODUCT_SCREENS).length, 20);
  for (const [route, screen] of Object.entries(PRODUCT_SCREENS)) {
    assert.ok(routes.has(route), route);
    assert.match(screen.blocks[0].caption, /Actual ASTRA interface/);
    assert.ok(screen.blocks[1].items.length >= 2);
    const [areaId, pageId] = route.split('/');
    const area = DOC_SECTIONS.find(item => item.id === areaId);
    const page = area.pages.find(item => item.id === pageId);
    for (let i = 0; i < 3; i++) assert.equal(getGuide(area, page).sections.filter(item => item.id === 'product-screen').length, 1);
  }
});

test('email guide documents the SMTP fields and test-delivery procedure', () => {
  const content = JSON.stringify(GUIDES['notifications/email']);
  for (const field of ['SMTP host', 'Port', 'Implicit TLS', 'Username', 'Password', 'From address', 'Recipients', 'Deliveries']) {
    assert.ok(content.includes(field), field);
  }
});

test('all published pages are authored rather than generated from a generic fallback', () => {
  const published = DOC_SECTIONS.flatMap(area => area.pages.map(page => `${area.id}/${page.id}`));
  const authored = Object.keys({ ...GUIDES, ...HANDBOOK });
  assert.deepEqual(authored.sort(), published.sort());
  for (const area of DOC_SECTIONS) for (const page of area.pages) {
    const guide = getGuide(area, page);
    assert.ok(guide.sections.length >= 3, page.title);
    assert.ok(!guide.sections.some(section => ['Follow the workflow', 'What to explore'].includes(section.title)));
    assert.match(guide.time, /^\d+ min$/);
  }
});

test('reference material includes an explicit OTLP contract and private placeholders', () => {
  const reference = JSON.stringify(HANDBOOK['reference/api-reference']);
  for (const signal of ['metrics', 'logs', 'traces']) {
    assert.ok(reference.includes(`/api/v1/otlp/v1/${signal}`));
    assert.ok(reference.includes(`${signal}.ingest`));
  }
  assert.ok(reference.includes('partialSuccess'));
  assert.ok(reference.includes('<organization-ingest-key>'));
});

test('article blocks use supported renderers and internal guide links resolve', () => {
  const blocks = new Set(['text','list','table','note','steps','tabs','checklist','image','accordion','links','directory','code']);
  const pageIds = new Set(DOC_SECTIONS.flatMap(area => area.pages.map(page => page.id)));
  for (const guide of Object.values({ ...GUIDES, ...HANDBOOK })) {
    for (const section of guide.sections) for (const block of section.blocks) {
      assert.ok(blocks.has(block.type), block.type);
      if (block.type === 'links') for (const id of block.ids) assert.ok(pageIds.has(id), id);
      if (block.type === 'directory') assert.ok(DOC_SECTIONS.some(area => area.id === block.sectionId));
      if (block.type === 'table') for (const row of block.rows) assert.equal(row.length, block.headers.length);
    }
  }
});
