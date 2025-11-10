/* global WebImporter */

/**
 * Parser for hero block
 *
 * Source: https://www.citizensbank.com/checking/overview.aspx
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: Block name header ("Hero")
 * - Row 2: Background image (optional)
 * - Row 3: Content (heading, description, CTAs)
 *
 * Source HTML Pattern (VALIDATED):
 * <section class="dcom-c-hero-commercial">
 *   <div class="dcom-c-hero-commercial__message-container">
 *     <h1>Citizens Checking Accounts</h1>
 *     <p>Choose the account that's right for you...</p>
 *   </div>
 * </section>
 *
 * Generated: 2025-11-10T16:33:00Z
 */
export default function parse(element, { document }) {
  // Extract content from source HTML
  // VALIDATED selectors based on actual source HTML structure

  // Heading: h1 in message container (validated: exists as h1 in source)
  const heading = element.querySelector('.dcom-c-hero-commercial__message-container h1') ||
                  element.querySelector('h1, h2') ||
                  element.querySelector('[class*="heading"]');

  // Description: paragraph in message container (validated: exists as p in source)
  const description = element.querySelector('.dcom-c-hero-commercial__message-container p') ||
                     element.querySelector('p') ||
                     element.querySelector('[class*="description"]');

  // CTAs: Look for links/buttons (validated pattern: source may have CTAs in some hero instances)
  const ctaLinks = Array.from(
    element.querySelectorAll('.dcom-c-hero-commercial__message-container a') ||
    element.querySelectorAll('a.cbds-c-button, a.dcom-c-button, button')
  ).filter(link => link.closest('.dcom-c-hero-commercial__message-container'));

  // Background image: Check for background images (optional)
  // Note: Citizens uses CSS backgrounds often, but check for img elements too
  const bgImage = element.querySelector('img[class*="background"]') ||
                  element.querySelector('img[class*="hero-bg"]') ||
  element.querySelector('.dcom-c-hero-commercial img');

  // Build cells array matching hero block structure
  // Row 1: Header (single column with block name)
  const cells = [
    ['Hero']
  ];

  // Row 2: Background image (optional - only add if present)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: Content (single column containing heading, description, CTAs)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLinks.length > 0) contentCell.push(...ctaLinks);

  cells.push(contentCell);

  // Create block table using WebImporter utility
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with structured block table
  element.replaceWith(block);
}
