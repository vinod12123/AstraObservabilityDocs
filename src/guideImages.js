// Product screenshots intentionally contrast with the documentation canvas.
// Keep the original capture when a page has not yet been captured in both app themes.
export function imageSourceForTheme(block, docsTheme) {
  if (docsTheme === 'dark') return block.appLightSrc || block.src;
  return block.appDarkSrc || block.src;
}
