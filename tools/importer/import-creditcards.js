/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// Helper function to clean text content
const cleanText = (text) => text.trim().replace(/\s+/g, ' ');

// Transform Hero Section
const transformHero = (main, document) => {
  const hero = main.querySelector('.dcom-c-hero-commercial');
  if (!hero) return;

  const cells = [];

  // First row: Block name
  cells.push(['Hero-Creditcards']);

  // Second row: Image (if exists)
  const picture = hero.querySelector('picture');
  const img = hero.querySelector('img');
  if (picture) {
    cells.push([picture.cloneNode(true)]);
  } else if (img) {
    cells.push([img.cloneNode(true)]);
  }

  // Third row: Content
  const messageContainer = hero.querySelector('.dcom-c-hero-commercial__message-container');

  if (messageContainer) {
    // Clone the entire message container to preserve all HTML structure
    const contentClone = messageContainer.cloneNode(true);
    cells.push([contentClone]);
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  hero.replaceWith(block);
};

// Transform Feature Single (Summit Reserve card)
const transformFeatureSingle = (main, document) => {
  const featureSingle = main.querySelector('.dcom-c-featureSingle');
  if (!featureSingle) return;

  const cells = [['Columns-Creditcards']];

  // Get the image and content columns
  const columns = featureSingle.querySelectorAll('[class*="grid__col"]');
  if (columns.length >= 2) {
    const imageCol = columns[0];
    const contentCol = columns[1];

    // Clone both columns to preserve all HTML structure
    const imageClone = imageCol.cloneNode(true);
    const contentClone = contentCol.cloneNode(true);

    cells.push([imageClone, contentClone]);
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  featureSingle.replaceWith(block);
};

// Transform Cards Section (credit cards or icon cards)
const transformCards = (main, document, selector) => {
  const featureGrid = main.querySelector(selector);
  if (!featureGrid) return;

  const cards = featureGrid.querySelectorAll('.dcom-c-featureGrid__item');
  if (!cards || cards.length === 0) return;

  const cells = [['Cards-Creditcards']];

  cards.forEach((card) => {
    const image = card.querySelector('img');
    const contentDiv = card.querySelector('.dcom-c-featureGrid__item-content');
    const footerDiv = card.querySelector('.dcom-c-featureGrid__item-footer');

    // Clone the content div to preserve all HTML structure (paragraphs, lists, etc.)
    const contentClone = contentDiv ? contentDiv.cloneNode(true) : document.createElement('div');

    // Add footer links if they exist
    if (footerDiv) {
      const footerLinks = footerDiv.querySelectorAll('a');
      footerLinks.forEach((link) => {
        const p = document.createElement('p');
        const strongLink = document.createElement('strong');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = cleanText(link.textContent);
        strongLink.appendChild(a);
        p.appendChild(strongLink);
        contentClone.appendChild(p);
      });
    }

    cells.push([
      image ? image.cloneNode(true) : '',
      contentClone
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  featureGrid.replaceWith(block);
};

export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (optional)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: ({
    document, url, html, params,
  }) => {
    // Use helper to remove header, footer, etc.
    WebImporter.DOMUtils.remove(document, [
      'header',
      'footer',
      'script',
      'style',
      'noscript',
      '.dcom-c-header',
      '.dcom-c-footer',
      '.dcom-c-nav',
    ]);

    const main = document.querySelector('body');

    // Transform each section
    transformHero(main, document);
    transformFeatureSingle(main, document); // Summit Reserve card
    transformCards(main, document, '.dcom-c-featureGrid.dcom-c-featureGrid--image'); // 3 credit cards
    transformCards(main, document, '.dcom-c-featureGrid.dcom-c-featureGrid--icon'); // Icon cards

    // Collect references to the block tables before adding metadata
    const tables = Array.from(main.querySelectorAll('table'));
    const heroBlock = tables[0];
    const columnsBlock = tables[1];
    const cardsBlock = tables[2];
    const iconCardsBlock = tables[3];

    // Add section metadata and separators
    // Section 1: Hero (sage) | Section 2: Columns (light) | Section 3: Cards (light) | Section 4: Icon Cards (grey)

    // Icon cards section (grey background)
    if (iconCardsBlock) {
      const iconSeparator = document.createElement('hr');
      iconCardsBlock.before(iconSeparator);

      const iconMetadata = WebImporter.DOMUtils.createTable([
        ['Section Metadata'],
        ['style', 'grey']
      ], document);
      iconSeparator.before(iconMetadata);
    }

    // Cards section (light background)
    if (cardsBlock) {
      const cardsSeparator = document.createElement('hr');
      cardsBlock.before(cardsSeparator);

      const cardsMetadata = WebImporter.DOMUtils.createTable([
        ['Section Metadata'],
        ['style', 'light']
      ], document);
      cardsSeparator.before(cardsMetadata);
    }

    // Columns section (light background)
    if (columnsBlock) {
      const columnsSeparator = document.createElement('hr');
      columnsBlock.before(columnsSeparator);

      const columnsMetadata = WebImporter.DOMUtils.createTable([
        ['Section Metadata'],
        ['style', 'light']
      ], document);
      columnsSeparator.before(columnsMetadata);
    }

    // Hero section (sage background)
    if (heroBlock) {
      const heroMetadata = WebImporter.DOMUtils.createTable([
        ['Section Metadata'],
        ['style', 'sage']
      ], document);
      heroBlock.before(heroMetadata);
    }

    // Create metadata for the page
    const meta = {};
    const title = document.querySelector('title');
    if (title) {
      meta.Title = title.textContent.replace(/[\n\t]/gm, '');
    }
    const desc = document.querySelector('[property="og:description"]');
    if (desc) {
      meta.Description = desc.content;
    }

    const block = WebImporter.Blocks.getMetadataBlock(document, meta);
    main.append(block);

    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (optional)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    document, url, html, params,
  }) => {
    return new URL(url).pathname.replace(/\.aspx$/, '').replace(/\/$/, '');
  },
};
