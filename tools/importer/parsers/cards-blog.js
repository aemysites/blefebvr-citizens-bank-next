/* global WebImporter */

/**
 * Parser for cards-blog block
 *
 * Source: https://michaelgrob.ch/frameconcept.ch/
 * Base Block: cards
 *
 * Block Structure (from markdown example):
 * - Row per card: 2 columns [image | heading + link + description]
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="posts">
 *   <div class="post-container">
 *     <div class="post-...">
 *       <figure class="featured-media">
 *         <a href="..."><img src="..." /></a>
 *       </figure>
 *       <div class="post-header">
 *         <h2 class="post-title"><a href="...">Title</a></h2>
 *       </div>
 *       <div class="post-excerpt"><p>Description...</p></div>
 *     </div>
 *   </div>
 *   ...
 * </div>
 *
 * Generated: 2026-01-07
 */
export default function parse(element, { document }) {
  // Extract all post containers from the posts grid
  // VALIDATED: .post-container exists in captured DOM
  const postContainers = element.querySelectorAll('.post-container');

  // Build cells array - one row per card
  const cells = [];

  postContainers.forEach((container) => {
    // Extract image
    // VALIDATED: .featured-media img exists in captured DOM
    const img = container.querySelector('.featured-media img') ||
                container.querySelector('figure img') ||
                container.querySelector('img');

    // Extract title link
    // VALIDATED: .post-title a exists in captured DOM
    const titleLink = container.querySelector('.post-title a') ||
                      container.querySelector('h2 a') ||
                      container.querySelector('a');

    // Extract excerpt
    // VALIDATED: .post-excerpt p exists in captured DOM
    const excerpt = container.querySelector('.post-excerpt p') ||
                    container.querySelector('.post-excerpt') ||
                    container.querySelector('p');

    // Build content cell with title link and description
    const contentCell = [];

    if (titleLink) {
      // Create heading element with link
      const heading = document.createElement('p');
      const strong = document.createElement('strong');
      const link = document.createElement('a');
      link.href = titleLink.href;
      link.textContent = titleLink.textContent;
      strong.appendChild(link);
      heading.appendChild(strong);
      contentCell.push(heading);
    }

    if (excerpt) {
      const desc = document.createElement('p');
      desc.textContent = excerpt.textContent;
      contentCell.push(desc);
    }

    // Add row: [image cell, content cell]
    if (img || contentCell.length > 0) {
      const imageCell = img ? [img.cloneNode(true)] : [];
      cells.push([imageCell, contentCell]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Blog', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
