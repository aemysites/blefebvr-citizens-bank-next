/**
 * Parser for fragment-social block
 * Transforms social sharing buttons into fragment block that references /fragments/social-sharing
 *
 * @param {Element} element - The DOM element containing the social sharing buttons (.BlogItem-share)
 * @param {Object} context - Context object with { document, url, params }
 * @returns {Array} Block cells array for WebImporter
 */
export default function parseFragmentSocial(element) {
  if (!element) {
    return null;
  }

  // Create block table with fragment path
  const cells = [
    ['Fragment (Social)'],
    ['/fragments/social-sharing']
  ];

  return cells;
}
