/* global WebImporter */

/**
 * Parser for cards-tombstones block
 *
 * Source: https://www.citizensbank.com/corporate-finance/capability/financing/asset-based-lending.aspx
 * Base Block: cards
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Cards-Tombstones")
 * - Row 2-N: Each row represents one card with 2 columns:
 *   - Column 1: Image (mandatory)
 *   - Column 2: Text content (title, description, CTA) - often empty for tombstones
 *
 * Source HTML Pattern:
 * <section class="dcom-c-tombstones">
 *   <div class="cbds-l-grid__row">
 *     <div class="dcom-c-tombstones__item">
 *       <img class="dcom-c-tombstones__item-image" src="..." alt="...">
 *     </div>
 *     <!-- More items... -->
 *   </div>
 * </section>
 *
 * Generated: 2025-11-18T21:10:00Z
 */
export default function parse(element, { document }) {
  // Extract all tombstone items from the grid
  const tombstoneItems = Array.from(
    element.querySelectorAll('.dcom-c-tombstones__item')
  );

  // If no items with specific class, try more generic selectors
  if (tombstoneItems.length === 0) {
    tombstoneItems.push(
      ...Array.from(element.querySelectorAll('.cbds-l-grid__col--6@sm, .cbds-l-grid__col--3@lg'))
    );
  }

  // Build cells array matching Cards block structure
  const cells = [
    ['Cards-Tombstones']  // Row 1: Block name header
  ];

  // Process each tombstone item as a card row
  tombstoneItems.forEach((item) => {
    // Extract image from item
    const image = item.querySelector('img.dcom-c-tombstones__item-image') ||
                  item.querySelector('img') ||
                  item.querySelector('picture img');

    // Skip items without images
    if (!image) {
      return;
    }

    // Extract any text content (title, description) - tombstones usually don't have text
    const textContainer = item.querySelector('.dcom-c-tombstones__item-text') ||
                         item.querySelector('.card-body') ||
                         item.querySelector('[class*="content"]');

    const title = textContainer?.querySelector('h3, h4, .title, [class*="heading"]');
    const description = textContainer?.querySelector('p, .description');
    const link = textContainer?.querySelector('a');

    // Build text content cell (may be empty for pure tombstones)
    const textContent = [];
    if (title) textContent.push(title);
    if (description) textContent.push(description);
    if (link) textContent.push(link);

    // Add row with 2 columns: image | text
    // For tombstones without text, second column will be empty
    cells.push([image, textContent.length > 0 ? textContent : '']);
  });

  // Create block table using WebImporter utility
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with structured block table
  element.replaceWith(block);
}
