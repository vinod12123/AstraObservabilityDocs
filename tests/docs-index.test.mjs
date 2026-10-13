import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSearchIndex } from '../scripts/build-search-index.mjs';

test('search index exports the same customer guides as the docs app', () => {
  const index = buildSearchIndex();
  assert.equal(index.schemaVersion, 1);
  assert.ok(index.documents.length > 100);
  assert.ok(index.documents.some((doc) => doc.path === 'collect-data/gcp' && /service account/i.test(doc.text)));
  assert.ok(index.documents.some((doc) => doc.path === 'collect-data/azure' && /client secret/i.test(doc.text)));
  assert.ok(index.documents.every((doc) => doc.section && doc.title && doc.text));
});
