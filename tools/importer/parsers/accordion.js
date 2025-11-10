/* global WebImporter */

/**
 * Parser for accordion block
 *
 * Source: https://www.citizensbank.com/checking/overview.aspx
 * Base Block: accordion
 *
 * Block Structure:
 * - Row 1: Block name header ("Accordion")
 * - Row 2-N: Each accordion item with question (col 1) | answer (col 2)
 *
 * Source HTML Pattern (VALIDATED):
 * <section class="dcom-c-accordion">
 *   <h2 class="dcom-c-accordion__heading">Checking Account FAQs</h2>
 *   <div class="cbds-c-accordion">
 *     <div class="cbds-c-accordion__item">
 *       <h3 class="cbds-c-accordion__heading">
 *         <button class="cbds-c-accordion__trigger">
 *           <span>How do I open a checking account?</span>
 *         </button>
 *       </h3>
 *       <div class="cbds-c-accordion__card-body">
 *         <p>Answer content...</p>
 *       </div>
 *     </div>
 *   </div>
 * </section>
 *
 * Generated: 2025-11-10T16:36:00Z
 */
export default function parse(element, { document }) {
  // Extract section heading (optional) - typically "FAQs" heading
  // VALIDATED: .dcom-c-accordion__heading exists at section level
  const sectionHeading = element.querySelector('.dcom-c-accordion__heading') ||
                         element.querySelector('h2');

  // Extract all accordion items
  // VALIDATED: .cbds-c-accordion__item exists in source HTML
  const accordionItems = element.querySelectorAll('.cbds-c-accordion__item');

  // Build cells array matching accordion block structure
  // Row 1: Header (single column with block name)
  const cells = [
    ['Accordion']
  ];

  // Optional: Add section heading as first accordion item if it exists
  // This provides context for what the accordion contains
  if (sectionHeading && sectionHeading.textContent.trim()) {
    // Create a description row or prepend to first item
    // For now, we'll handle it as part of the first item if needed
  }

  // Process each accordion item
  accordionItems.forEach((item) => {
    // Extract question text
    // VALIDATED: Question is in <span> within button.cbds-c-accordion__trigger
    const questionSpan = item.querySelector('.cbds-c-accordion__trigger span') ||
                         item.querySelector('button span') ||
                         item.querySelector('.cbds-c-accordion__heading');

    const question = questionSpan ? questionSpan.textContent.trim() : '';

    // Extract answer content
    // VALIDATED: Answer is in div.cbds-c-accordion__card-body
    const answerDiv = item.querySelector('.cbds-c-accordion__card-body');

    // Get answer content (preserve all elements - paragraphs, lists, links, images)
    const answerContent = [];
    if (answerDiv) {
      // Get all direct child elements to preserve structure
      Array.from(answerDiv.children).forEach(child => {
        answerContent.push(child);
      });
    }

    // Add accordion row: [question | answer]
    if (question && answerContent.length > 0) {
      cells.push([question, answerContent]);
    } else if (question) {
      // If no structured answer content, try to get text
      const answerText = answerDiv ? answerDiv.innerHTML : '';
      if (answerText) {
        // Create a paragraph element with the answer
        const p = document.createElement('p');
        p.innerHTML = answerText;
        cells.push([question, [p]]);
      }
    }
  });

  // Create block table using WebImporter utility
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with structured block table
  element.replaceWith(block);
}
