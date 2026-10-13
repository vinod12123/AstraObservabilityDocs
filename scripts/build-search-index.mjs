import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DOC_SECTIONS } from '../src/docsData.js';
import { getGuide } from '../src/guideContent.js';

// The browser and Ask ASTRA consume the same authored guides. Publish only customer-facing
// text; screenshots and external URLs are intentionally not indexed as answer content.
function blockText(block) {
  switch (block.type) {
    case 'text': return block.value;
    case 'note': return `${block.title}: ${block.value}`;
    case 'list': return block.items.join('\n');
    case 'steps': return block.items.map(([title, detail]) => `${title}: ${detail}`).join('\n');
    case 'table': return [block.headers.join(' | '), ...block.rows.map((row) => row.join(' | '))].join('\n');
    case 'accordion': return block.items.map(([title, detail]) => `${title}: ${detail}`).join('\n');
    case 'tabs': return block.tabs.map((tab) => `${tab.title}: ${tab.text} Verify: ${tab.next}`).join('\n');
    case 'checklist': return block.items.join('\n');
    case 'code': return block.value;
    default: return '';
  }
}

export function buildSearchIndex() {
  const documents = [];
  for (const group of DOC_SECTIONS) {
    for (const page of group.pages) {
      const guide = getGuide(group, page);
      for (const section of guide.sections) {
        const text = section.blocks.map(blockText).filter(Boolean).join('\n').trim();
        if (!text) continue;
        documents.push({
          path: `${group.id}/${page.id}`,
          section: section.id,
          title: page.title,
          heading: section.title,
          summary: page.summary,
          text,
        });
      }
    }
  }
  return { schemaVersion: 1, documents };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const output = fileURLToPath(new URL('../public/docs-index.json', import.meta.url));
  const index = buildSearchIndex();
  await writeFile(output, JSON.stringify(index));
  console.log(`Indexed ${index.documents.length} documentation sections.`);
}
