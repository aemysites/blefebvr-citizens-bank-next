/* global WebImporter */

/**
 * Parser for columns block
 *
 * Source: https://www.citizensbank.com/checking/overview.aspx
 * Base Block: columns
 *
 * Block Structure:
 * - Row 1: Block name header ("Columns")
 * - Row 2: Content columns (multiple columns side-by-side)
 *
 * Source HTML Pattern (VALIDATED):
 * <section class="dcom-c-textBlock">
 *   <div class="cbds-l-grid__row">
 *     <div class="cbds-l-grid__col--12 cbds-l-grid__col--6@md">
 *       <h4>Citizens EverValue Checking</h4>
 *       <p>Description</p>
 *       <ul><li>Fee details</li></ul>
 *       <p><a href="...">Account Details</a></p>
 *       <p><a href="...">Open Account</a></p>
 *     </div>
 *     <div class="cbds-l-grid__col--12 cbds-l-grid__col--6@md">
 *       <h4>Student Checking</h4>
 *       ...
 *     </div>
 *   </div>
 * </section>
 *
 * Generated: 2025-11-10T16:35:00Z
 */
export default function parse(element, { document }) {
  // Extract column containers from the text block
  // VALIDATED: Pattern shows columns within .cbds-l-grid__row
  const gridRow = element.querySelector('.cbds-l-grid__row') || element;

  // Extract individual column divs (validated: .cbds-l-grid__col--6@md exists)
  // Look for column divs that contain the actual content
  const columnDivs = Array.from(
    gridRow.querySelectorAll('.cbds-l-grid__col--12.cbds-l-grid__col--6\\@md')
  );

  // Fallback if specific class not found
  if (columnDivs.length === 0) {
    // Try other common column patterns
    const fallbackColumns = Array.from(
      gridRow.querySelectorAll('[class*="col"]')
    ).filter(col => col.querySelector('h4, h3, h2'));

    if (fallbackColumns.length > 0) {
      columnDivs.push(...fallbackColumns);
    }
  }

  // Build cells array matching columns block structure
  // Row 1: Header (single column with block name)
  const cells = [
    ['Columns']
  ];

  // Row 2: Content columns
  // Each column contains: heading, description, fee list, links
  const contentColumns = [];

  columnDivs.forEach((columnDiv) => {
    // Extract heading (validated: h4 exists in source)
    const heading = columnDiv.querySelector('h4') ||
                    columnDiv.querySelector('h3, h2, h5');

    // Extract paragraphs (validated: multiple <p> elements exist)
    const paragraphs = Array.from(columnDiv.querySelectorAll('p'));

    // Extract lists (validated: <ul> with fee details exists)
    const lists = Array.from(columnDiv.querySelectorAll('ul, ol'));

    // Extract links (validated: links exist within paragraphs and as buttons)
    const links = Array.from(
      columnDiv.querySelectorAll('a')
    ).filter(link => !link.closest('ul')); // Exclude links within lists

    // Build column content array
    const columnContent = [];
    if (heading) columnContent.push(heading);

    // Add paragraphs (filter out those that only contain links)
    paragraphs.forEach(p => {
      // If paragraph contains more than just a link, add it
      if (p.textContent.trim() && !p.querySelector('a.cbds-c-button')) {
        columnContent.push(p);
      }
    });

    // Add lists
    columnContent.push(...lists);

    // Add links
    columnContent.push(...links);

    // Add this column to the row
    if (columnContent.length > 0) {
      contentColumns.push(columnContent);
    }
  });

  // Add content row with all columns
  if (contentColumns.length > 0) {
    cells.push(contentColumns);
  }

  // Create block table using WebImporter utility
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with structured block table
  element.replaceWith(block);
}
