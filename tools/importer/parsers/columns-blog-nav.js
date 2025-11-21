/**
 * Parser for columns-blog-nav block
 * Transforms blog navigation (previous/next links) into 2-column block
 *
 * @param {Element} element - The DOM element containing the blog pagination (.BlogItem-pagination)
 * @param {Object} context - Context object with { document, url, params }
 * @returns {Array} Block cells array for WebImporter
 */
export default function parseColumnsBlogNav(element, { document }) {
  if (!element) {
    return null;
  }

  // Find previous and next links
  const prevLink = element.querySelector('.BlogItem-pagination-link--prev');
  const nextLink = element.querySelector('.BlogItem-pagination-link--next');

  if (!prevLink && !nextLink) {
    return null;
  }

  // Create block header
  const cells = [
    ['Columns (Blog Nav)']
  ];

  // Build previous column content
  const prevDiv = document.createElement('div');
  if (prevLink) {
    const prevTitle = prevLink.querySelector('.BlogItem-pagination-link-title');
    const prevLabel = prevLink.querySelector('.BlogItem-pagination-link-label');
    const prevUrl = prevLink.getAttribute('href') || '';

    if (prevLabel) {
      const label = document.createElement('p');
      label.textContent = prevLabel.textContent.trim();
      prevDiv.append(label);
    }

    if (prevTitle) {
      const titleLink = document.createElement('a');
      titleLink.href = prevUrl;
      titleLink.textContent = prevTitle.textContent.trim();
      prevDiv.append(titleLink);
    }
  }

  // Build next column content
  const nextDiv = document.createElement('div');
  if (nextLink) {
    const nextTitle = nextLink.querySelector('.BlogItem-pagination-link-title');
    const nextLabel = nextLink.querySelector('.BlogItem-pagination-link-label');
    const nextUrl = nextLink.getAttribute('href') || '';

    if (nextLabel) {
      const label = document.createElement('p');
      label.textContent = nextLabel.textContent.trim();
      nextDiv.append(label);
    }

    if (nextTitle) {
      const titleLink = document.createElement('a');
      titleLink.href = nextUrl;
      titleLink.textContent = nextTitle.textContent.trim();
      nextDiv.append(titleLink);
    }
  }

  // Add content row with two columns
  cells.push([prevDiv, nextDiv]);

  return cells;
}
