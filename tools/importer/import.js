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

/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

// Import parsers
import heroParser from './parsers/hero.js';
import cardsParser from './parsers/cards.js';
import columnsParser from './parsers/columns.js';
import accordionParser from './parsers/accordion.js';

const createMetadata = (main, document) => {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.textContent.replace(/[\n\t]/gm, '');
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: async ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // Define the main element: remove header, footer and others
    WebImporter.DOMUtils.remove(document, [
      'header',
      'footer',
      'nav',
      '.header',
      '.footer',
      '.nav',
      '.navigation',
      '[role="banner"]',
      '[role="navigation"]',
      '[role="contentinfo"]',
      '[class*="cookie"]',
      '[id*="cookie"]',
      'script',
      'noscript',
    ]);

    const main = document.body;

    // Parse Hero sections
    const heroSections = main.querySelectorAll('section.dcom-c-hero-commercial');
    heroSections.forEach((section) => {
      heroParser(section, { document });
    });

    // Parse Cards sections (Feature Grid)
    const cardsSections = main.querySelectorAll('section.dcom-c-featureGrid');
    cardsSections.forEach((section) => {
      cardsParser(section, { document });
    });

    // Parse Columns sections (Text Block)
    const columnsSections = main.querySelectorAll('section.dcom-c-textBlock');
    columnsSections.forEach((section) => {
      columnsParser(section, { document });
    });

    // Parse Accordion sections
    const accordionSections = main.querySelectorAll('section.dcom-c-accordion');
    accordionSections.forEach((section) => {
      accordionParser(section, { document });
    });

    // Create the metadata block and append it to the main element
    createMetadata(main, document);

    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    let p = new URL(url).pathname;
    if (p.endsWith('/')) {
      p = `${p}index`;
    }
    // Remove .aspx extension
    p = p.replace(/\.aspx$/, '');
    return decodeURIComponent(p)
      .toLowerCase()
      .replace(/\.html$/, '')
      .replace(/[^a-z0-9/]/gm, '-');
  },
};
