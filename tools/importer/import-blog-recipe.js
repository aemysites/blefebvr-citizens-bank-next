/* global WebImporter */

/**
 * Import script for blog-recipe template
 * Template: Keto recipe blog posts with title, intro, image, ingredients, and directions
 * Content Type: 100% default content (no blocks)
 * Source: ketointhecity.com
 * Generated: 2025-11-25
 */

import ketointhecityCleanup from './transformers/ketointhecity-cleanup.js';

/**
 * Extract metadata from the page
 */
function extractMetadata(document) {
  const metadata = {};

  // Title from H1 or meta tags
  const h1 = document.querySelector('h1.BlogItem-title, h1');
  if (h1) {
    metadata.title = h1.textContent.trim();
  } else {
    const metaTitle = document.querySelector('meta[property="og:title"]');
    if (metaTitle) {
      metadata.title = metaTitle.content.split(' — ')[0].trim();
    }
  }

  // Description from meta tags
  const metaDesc = document.querySelector('meta[property="og:description"], meta[name="description"]');
  if (metaDesc) {
    metadata.description = metaDesc.content;
  }

  // Image from og:image
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) {
    metadata.image = ogImage.content;
  }

  // Author from blog meta
  const author = document.querySelector('.Blog-meta-item--author');
  if (author) {
    metadata.author = author.textContent.trim();
  }

  // Date from blog meta
  const date = document.querySelector('.Blog-meta-item--date');
  if (date) {
    metadata.date = date.textContent.trim();
  }

  // Tags from blog meta
  const tags = document.querySelectorAll('.Blog-meta-item--tags a');
  if (tags.length > 0) {
    metadata.tags = Array.from(tags).map((t) => t.textContent.trim()).join(', ');
  }

  // Template
  metadata.template = 'blog-article';

  return metadata;
}

/**
 * Create metadata table
 */
function createMetadataBlock(document, metadata) {
  const cells = [['Metadata']];
  Object.entries(metadata).forEach(([key, value]) => {
    if (value) {
      cells.push([key, value]);
    }
  });
  return WebImporter.DOMUtils.createTable(cells, document);
}

/**
 * Main transformation function
 */
export default {
  /**
   * Apply transformations to the document.
   * @param {Object} params - Transformation parameters
   * @param {HTMLDocument} params.document - The document to transform
   * @param {string} params.url - The URL of the page being imported
   * @returns {Array} - Array of import results
   */
  transform: ({ document, url }) => {
    // Apply transformer cleanup before processing
    ketointhecityCleanup('beforeTransform', document.body, { document, url });

    // Find main content area
    const main = document.querySelector('article.BlogItem, main.Main--blog-item, .Main-content');

    if (!main) {
      console.warn('No main content found for:', url);
      return [];
    }

    // Extract metadata before cleanup
    const metadata = extractMetadata(document);

    // Apply afterTransform cleanup
    ketointhecityCleanup('afterTransform', main, { document, url });

    // Remove the title H1 if it exists (we'll regenerate from metadata)
    const titleH1 = main.querySelector('h1.BlogItem-title');
    if (titleH1) {
      titleH1.remove();
    }

    // Create a new document structure with title
    const content = document.createElement('div');

    // Add title as H1
    if (metadata.title) {
      const h1 = document.createElement('h1');
      h1.textContent = metadata.title;
      content.appendChild(h1);
    }

    // Add horizontal rule
    const hr1 = document.createElement('hr');
    content.appendChild(hr1);

    // Get main content from article
    const articleContent = main.querySelector('.sqs-layout, .sqs-block-content');
    if (articleContent) {
      // Clone content to preserve it
      const contentClone = articleContent.cloneNode(true);

      // Clean up Squarespace-specific wrappers
      const blocksToUnwrap = contentClone.querySelectorAll('.sqs-block-content, .sqs-html-content');
      blocksToUnwrap.forEach((block) => {
        const parent = block.parentNode;
        while (block.firstChild) {
          parent.insertBefore(block.firstChild, block);
        }
        block.remove();
      });

      // Append cleaned content
      while (contentClone.firstChild) {
        content.appendChild(contentClone.firstChild);
      }
    }

    // Add closing horizontal rule
    const hr2 = document.createElement('hr');
    content.appendChild(hr2);

    // Add metadata block
    const metadataBlock = createMetadataBlock(document, metadata);
    content.appendChild(metadataBlock);

    // Generate document path from URL
    const urlObj = new URL(url);
    let path = urlObj.pathname;
    if (path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    return [{
      element: content,
      path,
    }];
  },
};
