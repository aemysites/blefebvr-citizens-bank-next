/**
 * Parser for form-newsletter block
 * Transforms newsletter signup forms into form block that references form definition
 *
 * @param {Element} element - The DOM element containing the newsletter form (.newsletter-block)
 * @param {Object} context - Context object with { document, url, params }
 * @returns {Array} Block cells array for WebImporter
 */
export default function parseFormNewsletter(element) {
  if (!element) {
    return null;
  }

  // Extract the newsletter title and description for context
  const title = element.querySelector('.newsletter-form-header-title');
  const description = element.querySelector('.newsletter-form-header-description');

  // Create block table with form definition path
  const cells = [
    ['Form (Newsletter)'],
    ['/forms/newsletter-signup']
  ];

  // Optionally preserve title and description as comments for migration reference
  if (title || description) {
    console.log('Newsletter form context:');
    if (title) console.log('  Title:', title.textContent.trim());
    if (description) console.log('  Description:', description.textContent.trim());
  }

  return cells;
}
