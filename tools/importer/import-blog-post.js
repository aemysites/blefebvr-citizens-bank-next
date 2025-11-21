/* global WebImporter */
/* eslint-disable no-console */

// TRANSFORMER IMPORTS - Import transformers for DOM cleanup
import ketointhecityRemoveBlogNav from './transformers/ketointhecity-remove-blog-nav.js';

// PARSER IMPORTS - Import all parsers needed for this template
import formNewsletterParser from './parsers/form-newsletter.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'form-newsletter': formNewsletterParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'blog-post',
  description: 'Blog post pages from ketointhecity.com',
  urls: [
    'https://ketointhecity.com/blog/keto-recipe-peanut-butter-cup-chia-pudding'
  ],
  blocks: [
    {
      name: 'form-newsletter',
      instances: ['.newsletter-block'],
      section: 'orange'
    }
  ]
};

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  // Find all block instances defined in the template
  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach(element => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  /**
   * Main transformation function
   * See references/helix-importer-guidelines.md for transform() pattern
   */
  transform: (payload) => {
    const { document, url, params } = payload;

    // Run transformers before processing
    ketointhecityRemoveBlogNav('beforeTransform', document.body, payload);

    const main = document.body;

    // Remove unwanted elements (header, footer, navigation)
    WebImporter.DOMUtils.remove(main, [
      'header',
      'footer',
      '.Header',
      '.Footer',
      '.Mobile',
      '.Mobile-bar',
      '.Mobile-overlay',
      'nav',
      '.sqs-announcement-bar-dropzone',
      'script',
      'style',
      'noscript',
    ]);

    // Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // Create a new main container for transformed content
    const newMain = document.createElement('main');

    // Get the main blog content (article body)
    const blogArticle = document.querySelector('article.BlogItem');
    if (blogArticle) {
      // Extract title
      const title = blogArticle.querySelector('.BlogItem-title');
      if (title) {
        newMain.append(title);
      }

      // Extract main content (the sqs-layout container)
      const content = blogArticle.querySelector('.sqs-layout');
      if (content) {
        // Remove blocks that will be parsed separately
        pageBlocks.forEach(block => {
          const blockElement = content.querySelector(block.selector);
          if (blockElement) {
            blockElement.remove();
          }
        });
        newMain.append(content);
      }

      // Extract metadata
      const meta = blogArticle.querySelector('.Blog-meta');
      if (meta) {
        newMain.append(meta);
      }
    }

    // Add a separator before blocks
    newMain.append(document.createElement('hr'));

    // Parse each block using registered parsers
    pageBlocks.forEach(block => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          const cells = parser(block.element, { document, url, params });
          if (cells) {
            const table = WebImporter.DOMUtils.createTable(cells, document);
            newMain.append(table);

            // Add section metadata if specified
            if (block.section) {
              const sectionMetadata = WebImporter.DOMUtils.createTable([
                ['Section Metadata'],
                ['Style', block.section]
              ], document);
              newMain.append(sectionMetadata);
            }

            // Add separator after each block
            newMain.append(document.createElement('hr'));
          }
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // Apply WebImporter built-in rules
    WebImporter.rules.createMetadata(newMain, document);
    WebImporter.rules.transformBackgroundImages(newMain, document);
    WebImporter.rules.adjustImageUrls(newMain, url, params.originalURL);

    // Generate sanitized path (full localized path without extension)
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: newMain,
      path,
      report: {
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map(b => ({ name: b.name, selector: b.selector })),
        url: params.originalURL,
      }
    }];
  }
};
