/* global WebImporter */

/**
 * Parser for cards block
 *
 * Source: https://www.citizensbank.com/checking/overview.aspx
 * Base Block: cards
 *
 * Block Structure:
 * - Row 1: Block name header ("Cards")
 * - Row 2-N: Each card with image (col 1) | content (col 2)
 *
 * Source HTML Pattern (VALIDATED):
 * <section class="dcom-c-featureGrid">
 *   <div class="dcom-c-featureGrid__item">
 *     <img src="..." class="dcom-c-featureGrid__item-image">
 *     <div class="dcom-c-featureGrid__item-content">
 *       <h3>Card Title</h3>
 *       <p>Description</p>
 *       <ul><li>Fee details</li></ul>
 *     </div>
 *     <div class="dcom-c-featureGrid__item-footer">
 *       <a href="...">Open Account</a>
 *       <a href="...">Account Details</a>
 *     </div>
 *   </div>
 * </section>
 *
 * Generated: 2025-11-10T16:34:00Z
 */
export default function parse(element, { document }) {
  // Extract all card items from the feature grid
  // VALIDATED: .dcom-c-featureGrid__item exists in source HTML
  const cardItems = element.querySelectorAll('.dcom-c-featureGrid__item');

  // Build cells array matching cards block structure
  // Row 1: Header (single column with block name)
  const cells = [
    ['Cards']
  ];

  // Process each card item
  cardItems.forEach((card) => {
    // Extract image (validated: .dcom-c-featureGrid__item-image exists)
    const image = card.querySelector('.dcom-c-featureGrid__item-image') ||
                  card.querySelector('img');

    // Extract content container (validated: .dcom-c-featureGrid__item-content exists)
    const contentDiv = card.querySelector('.dcom-c-featureGrid__item-content');

    // Extract heading (validated: h3.dcom-c-featureGrid__item-heading exists)
    const heading = card.querySelector('.dcom-c-featureGrid__item-heading') ||
                    card.querySelector('h3, h4, h2');

    // Extract description paragraphs (validated: multiple <p> tags in content)
    const descriptions = contentDiv ?
      Array.from(contentDiv.querySelectorAll('p')) :
      Array.from(card.querySelectorAll('p'));

    // Extract lists (validated: <ul> with fee details exists)
    const lists = contentDiv ?
      Array.from(contentDiv.querySelectorAll('ul')) :
      Array.from(card.querySelectorAll('ul'));

    // Extract CTAs from footer (validated: .dcom-c-featureGrid__item-footer exists)
    const footer = card.querySelector('.dcom-c-featureGrid__item-footer');
    const ctaLinks = footer ?
      Array.from(footer.querySelectorAll('a')) :
      Array.from(card.querySelectorAll('a.cbds-c-button, a.dcom-c-button'));

    // Build content cell: heading, descriptions, lists, CTAs
    const contentCell = [];
    if (heading) contentCell.push(heading);
    contentCell.push(...descriptions);
    contentCell.push(...lists);
    contentCell.push(...ctaLinks);

    // Add card row: [image | content]
    if (image && contentCell.length > 0) {
      cells.push([image, contentCell]);
    }
  });

  // Create block table using WebImporter utility
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with structured block table
  element.replaceWith(block);
}
