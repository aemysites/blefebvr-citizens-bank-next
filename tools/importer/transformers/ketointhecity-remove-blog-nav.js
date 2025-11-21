/**
 * Transformer for ketointhecity.com
 * Removes blog navigation, metadata, and social sharing elements from pages
 *
 * @param {string} hookName - The transformation hook ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element being transformed
 * @param {Object} payload - Additional context (document, url, params)
 */
export default function transform(hookName, element, payload) {
  const { document } = payload;

  console.log(`[TRANSFORMER] Running ${hookName} hook`);

  // Run before block parsing to remove blog navigation, metadata, and social sharing
  if (hookName === 'beforeTransform') {
    // Remove blog pagination navigation from the entire document
    const blogPagination = document.querySelectorAll('.BlogItem-pagination');
    console.log(`[TRANSFORMER] Found ${blogPagination.length} .BlogItem-pagination element(s)`);

    blogPagination.forEach(nav => {
      console.log(`[TRANSFORMER] Removing element:`, nav.className);
      nav.remove();
    });

    // Verify removal
    const remainingPagination = document.querySelectorAll('.BlogItem-pagination');
    console.log(`[TRANSFORMER] After removal, ${remainingPagination.length} .BlogItem-pagination element(s) remain`);

    // Remove blog metadata
    const blogMeta = document.querySelectorAll('.BlogItem-meta');
    console.log(`[TRANSFORMER] Found ${blogMeta.length} .BlogItem-meta element(s)`);

    blogMeta.forEach(meta => {
      console.log(`[TRANSFORMER] Removing element:`, meta.className);
      meta.remove();
    });

    // Verify removal
    const remainingMeta = document.querySelectorAll('.BlogItem-meta');
    console.log(`[TRANSFORMER] After removal, ${remainingMeta.length} .BlogItem-meta element(s) remain`);

    // Remove blog social sharing
    const blogShare = document.querySelectorAll('.BlogItem-share');
    console.log(`[TRANSFORMER] Found ${blogShare.length} .BlogItem-share element(s)`);

    blogShare.forEach(share => {
      console.log(`[TRANSFORMER] Removing element:`, share.className);
      share.remove();
    });

    // Verify removal
    const remainingShare = document.querySelectorAll('.BlogItem-share');
    console.log(`[TRANSFORMER] After removal, ${remainingShare.length} .BlogItem-share element(s) remain`);
  }
}
