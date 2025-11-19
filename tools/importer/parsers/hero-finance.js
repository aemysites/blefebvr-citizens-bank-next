/* global WebImporter */

/**
 * Parser for hero-finance block
 *
 * Source: https://www.citizensbank.com/corporate-finance/capability/financing/asset-based-lending.aspx
 * Base Block: hero
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Hero-Finance")
 * - Row 2: Background image (optional - empty if not present)
 * - Row 3: Content (heading and description text)
 *
 * Source HTML Pattern:
 * <section class="dcom-c-hero-commercial">
 *   <div class="dcom-c-hero-commercial__wrapper">
 *     <div class="dcom-c-hero-commercial__content-container">
 *       <div class="dcom-c-hero-commercial__message-container">
 *         <h1>Heading</h1>
 *         <p>Description</p>
 *       </div>
 *     </div>
 *   </div>
 * </section>
 *
 * Generated: 2025-11-18T21:10:00Z
 */
export default function parse(element, { document }) {
  // Extract content from hero section
  // Citizens Bank uses nested div structure, target the content container
  const contentContainer = element.querySelector('.dcom-c-hero-commercial__message-container') ||
                          element.querySelector('.dcom-c-hero-commercial__content-container') ||
                          element;

  // Extract heading - could be h1, h2, or heading with various classes
  const heading = contentContainer.querySelector('h1') ||
                  contentContainer.querySelector('h2') ||
                  element.querySelector('h1, h2') ||
                  element.querySelector('[class*="title"], [class*="heading"]');

  // Extract description text
  const description = contentContainer.querySelector('p') ||
                     element.querySelector('p') ||
                     element.querySelector('[class*="desc"]');

  // Check for optional background image
  // Citizens Bank heroes may have background images in various locations
  const bgImage = element.querySelector('img[class*="background"]') ||
                  element.querySelector('img[class*="hero-bg"]') ||
                  element.querySelector('picture img');

  // Build cells array matching Hero block structure (3 rows)
  const cells = [
    ['Hero-Finance']  // Row 1: Block name header
  ];

  // Row 2: Background image (optional - add empty row if no image)
  if (bgImage) {
    cells.push([bgImage]);
  } else {
    cells.push(['']);  // Empty row for optional background
  }

  // Row 3: Content (heading and description in single cell)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);

  cells.push(contentCell);

  // Create block table using WebImporter utility
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with structured block table
  element.replaceWith(block);
}
