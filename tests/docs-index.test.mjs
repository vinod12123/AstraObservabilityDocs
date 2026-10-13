import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSearchIndex } from '../scripts/build-search-index.mjs';

test('search index exports the same customer guides as the docs app', () => {
  const index = buildSearchIndex();
  assert.equal(index.schemaVersion, 1);
  assert.ok(index.documents.length > 100);
  assert.ok(index.documents.some((doc) => doc.path === 'collect-data/gcp' && /service account/i.test(doc.text)));
  assert.ok(index.documents.some((doc) => doc.path === 'collect-data/azure' && /client secret/i.test(doc.text)));
  for (const path of ['settings/settings-overview', 'settings/ai-llm', 'settings/api-keys', 'settings/agent-settings', 'settings/remediation-policy', 'settings/data-deletion']) {
    assert.ok(index.documents.some((doc) => doc.path === path), `Missing Settings guide: ${path}`);
  }
  for (const path of ['astra-intelligence/intelligence-overview', 'astra-intelligence/astra-agents', 'astra-intelligence/analyzer', 'astra-intelligence/code', 'astra-intelligence/ask-astra']) {
    assert.ok(index.documents.some((doc) => doc.path === path), `Missing ASTRA Intelligence guide: ${path}`);
  }
  assert.ok(index.documents.every((doc) => doc.section && doc.title && doc.text));
});
