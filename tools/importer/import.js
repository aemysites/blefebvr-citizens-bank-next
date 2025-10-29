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

// Helper function to create block cell
const createBlockCell = (content) => {
  const cell = document.createElement('div');
  if (typeof content === 'string') {
    cell.innerHTML = content;
  } else {
    cell.appendChild(content);
  }
  return cell;
};

// Transform Hero Section
const transformHero = (main, document) => {
  const hero = main.querySelector('.dcom-c-hero-commercial');
  if (!hero) return;

  const cells = [];

  // First row: Block name
  cells.push(['Hero-Checking']);

  // Second row: Image (if exists)
  const picture = hero.querySelector('picture');
  if (picture) {
    cells.push([picture.cloneNode(true)]);
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

// Transform Cards Section (3 checking accounts)
const transformCards = (main, document) => {
  const cards = main.querySelectorAll('.dcom-c-featureGrid__item');
  if (!cards || cards.length === 0) return;

  const cells = [['Cards-Accounts']];

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
  // Replace the parent container
  const firstCard = main.querySelector('.dcom-c-featureGrid__item');
  if (firstCard) {
    const container = firstCard.parentElement.parentElement;
    container.replaceWith(block);
  }
};

// Transform Columns Section (2 additional accounts)
const transformColumns = (main, document) => {
  const columnsSection = main.querySelector('.dcom-c-textBlock.dcom-c-textBlock--full-width');
  if (!columnsSection) return;

  const cells = [['Columns-Accounts']];

  // Find the two h4 elements for EverValue and Student checking
  const h4Elements = columnsSection.querySelectorAll('h4');
  if (h4Elements.length === 2) {
    const contents = [];

    h4Elements.forEach((h4) => {
      // Get the parent container for this h4
      const container = h4.closest('[class*="grid__col"]');

      // Clone the entire container to preserve all HTML structure
      const containerClone = container.cloneNode(true);

      contents.push(containerClone);
    });

    cells.push([contents[0], contents[1]]);
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  columnsSection.replaceWith(block);
};

// Transform FAQ Accordion
const transformAccordion = (main, document) => {
  const accordion = main.querySelector('.dcom-c-accordion');
  if (!accordion) return;

  const cells = [['Accordion-FAQ']];

  const items = accordion.querySelectorAll('.cbds-c-accordion__item');
  items.forEach((item) => {
    const button = item.querySelector('button');
    const answerDiv = item.querySelector('.cbds-c-accordion__card-body');

    if (button && answerDiv) {
      // Clone the answer div to preserve all HTML structure
      const answerClone = answerDiv.cloneNode(true);

      cells.push([
        cleanText(button.textContent),
        answerClone
      ]);
    }
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  accordion.replaceWith(block);
};

// Create Section Metadata
const createSectionMetadata = (style) => {
  return {
    '': [
      ['Section Metadata'],
      ['style', style]
    ]
  };
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
    transformCards(main, document);
    transformColumns(main, document);
    transformAccordion(main, document);

    // Collect references to the block tables before adding metadata
    const tables = Array.from(main.querySelectorAll('table'));
    const heroBlock = tables[0];
    const cardsBlock = tables[1];
    const columnsBlock = tables[2];
    const accordionBlock = tables[3];

    // Add section metadata and separators
    // Section 1: Hero (sage) | Section 2: Cards + Columns (default/light) | Section 3: Accordion (grey)

    // Accordion section (grey background)
    if (accordionBlock) {
      const accordionSeparator = document.createElement('hr');
      accordionBlock.before(accordionSeparator);

      const accordionMetadata = WebImporter.DOMUtils.createTable([
        ['Section Metadata'],
        ['style', 'grey']
      ], document);
      accordionSeparator.before(accordionMetadata);
    }

    // Separator between hero and cards/columns section
    if (cardsBlock) {
      const separator = document.createElement('hr');
      cardsBlock.before(separator);
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
