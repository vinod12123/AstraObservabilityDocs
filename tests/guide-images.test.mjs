import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
import { imageSourceForTheme } from '../src/guideImages.js';
import { PRODUCT_SCREENS } from '../src/productScreenshots.js';

test('docs theme selects the contrasting product screenshot', () => {
  const block = {src:'/fallback.png',appDarkSrc:'/app-dark.png',appLightSrc:'/app-light.png'};
  assert.equal(imageSourceForTheme(block,'light'),'/app-dark.png');
  assert.equal(imageSourceForTheme(block,'dark'),'/app-light.png');
});

test('unpaired product screenshots retain their authentic capture', () => {
  const block = {src:'/original.png'};
  assert.equal(imageSourceForTheme(block,'light'),'/original.png');
  assert.equal(imageSourceForTheme(block,'dark'),'/original.png');
});

test('every paired product screenshot points to both real assets', () => {
  for (const [route, guide] of Object.entries(PRODUCT_SCREENS)) {
    const image = guide.blocks.find(block => block.type === 'image');
    if (!image.appDarkSrc && !image.appLightSrc) continue;
    assert.ok(image.appDarkSrc && image.appLightSrc, `${route} must have both app themes`);
    for (const src of [image.appDarkSrc, image.appLightSrc]) {
      assert.ok(existsSync(new URL(`../public${src}`, import.meta.url)), `${route} is missing ${src}`);
    }
  }
});
