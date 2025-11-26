/*
 * Copyright 2025 Adobe. All rights reserved.
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
/* eslint-disable no-console */

/**
 * Vitamix Recipe Detail Import Script
 *
 * Imports recipe pages with BLOCKS:
 * - Hero-Recipe block (image, title, description, meta, dietary, submitted by)
 * - Ingredients (default content)
 * - Directions (default content)
 * - Table-Nutrition block (no-header variant)
 * - Metadata block
 *
 * REMOVES all client-side content:
 * - CTA cards (Did You Make It?, Create Your Recipe Book)
 * - Product grid (Shop Now, Blenders, etc.)
 * - Reviews section
 * - Related recipes
 * - Search forms
 * - Navigation elements
 */

/**
 * Remove client-side and non-content elements
 */
function cleanupDocument(document) {
  // Remove header/navigation
  document.querySelectorAll('header, nav, .header, .navigation, .nav-container').forEach((el) => el.remove());

  // Remove footer
  document.querySelectorAll('footer, .footer').forEach((el) => el.remove());

  // Remove cookie consent
  document.querySelectorAll('[class*="cookie"], [class*="consent"], #onetrust-consent-sdk').forEach((el) => el.remove());

  // Remove CTA cards section (Did You Make It?, Create Your Recipe Book)
  document.querySelectorAll('.ognm-cardlist-left-aligned-caption__flex, [class*="cardlist-left-aligned"]').forEach((el) => el.remove());

  // Remove product grid section (Shop Now, Blenders, etc.)
  document.querySelectorAll('.ognm-cardlist-product-knockout-grid__flex, [class*="product-knockout"]').forEach((el) => el.remove());

  // Remove reviews section
  document.querySelectorAll('[class*="reviews"], [class*="rating"], .bazaarvoice, [class*="bv-"]').forEach((el) => el.remove());

  // Remove related recipes section
  document.querySelectorAll('[class*="related-recipe"], [class*="try-related"]').forEach((el) => el.remove());

  // Remove search forms
  document.querySelectorAll('form[action*="search"], .search-form, [class*="search"]').forEach((el) => el.remove());

  // Remove save/print/share buttons
  document.querySelectorAll('[class*="save-button"], [class*="print-button"], [class*="share"]').forEach((el) => el.remove());

  // Remove recipe navigation tabs
  document.querySelectorAll('.nav-tabs, [class*="recipe-nav"], [role="tablist"]').forEach((el) => el.remove());

  // Remove cook mode toggle
  document.querySelectorAll('[class*="cook-mode"]').forEach((el) => el.remove());

  // Remove "What Else Did You Want To Make Today" section
  document.querySelectorAll('[class*="what-else"], [class*="popular-searches"]').forEach((el) => el.remove());

  // Remove signup/newsletter sections
  document.querySelectorAll('[class*="signup"], [class*="newsletter"], [class*="email-capture"]').forEach((el) => el.remove());

  // Remove scripts and styles
  document.querySelectorAll('script, noscript, style, iframe').forEach((el) => el.remove());

  // Remove promotional banners
  document.querySelectorAll('[class*="promo"], [class*="banner"]').forEach((el) => el.remove());

  // Remove breadcrumbs
  document.querySelectorAll('[class*="breadcrumb"]').forEach((el) => el.remove());

  // Remove container size selector
  document.querySelectorAll('[class*="container-size"], [class*="refine-recipe"]').forEach((el) => el.remove());

  // Remove chef's notes (optional - can keep if needed)
  // document.querySelectorAll('[class*="chef-note"]').forEach((el) => el.remove());
}

/**
 * Extract recipe hero content
 */
function extractHero(document) {
  const hero = {};

  // Title
  const titleEl = document.querySelector('article h2, h1, .recipe-title');
  hero.title = titleEl?.textContent?.trim() || '';

  // Description
  const descEl = document.querySelector('article p, .recipe-description');
  hero.description = descEl?.textContent?.trim() || '';

  // Image
  const imgEl = document.querySelector('article img[alt], .recipe-image img');
  hero.image = imgEl?.src || '';
  hero.imageAlt = imgEl?.alt || hero.title;

  // Meta info (time, yield, difficulty)
  hero.meta = {};
  document.querySelectorAll('article ul li, .recipe-meta li').forEach((item) => {
    const label = item.querySelector('div:first-child, .label')?.textContent?.trim();
    const value = item.querySelector('div:last-child, .value')?.textContent?.trim();
    if (label && value && label !== value) {
      if (label.includes('Time')) hero.meta.totalTime = value;
      if (label.includes('Yield')) hero.meta.yield = value;
      if (label.includes('Difficulty')) hero.meta.difficulty = value;
    }
  });

  // Dietary interests
  hero.dietary = [];
  document.querySelectorAll('a[href*="refineby"]').forEach((link) => {
    const text = link.textContent.trim().replace(/,\s*$/, '');
    if (text && !hero.dietary.includes(text)) hero.dietary.push(text);
  });

  // Submitted by - find h4 with "Submitted" text and get next sibling
  const h4Elements = document.querySelectorAll('h4');
  let submittedBy = 'Vitamix';
  h4Elements.forEach((h4) => {
    if (h4.textContent.includes('Submitted')) {
      const nextEl = h4.nextElementSibling;
      if (nextEl) submittedBy = nextEl.textContent.trim();
    }
  });
  hero.submittedBy = submittedBy;

  return hero;
}

/**
 * Extract ingredients list
 * Vitamix uses .js-recipe-section__toggle-section for ingredients (multiple copies for container sizes)
 * Get only the FIRST container to avoid duplicates (JS hasn't hidden others yet during import)
 */
function extractIngredients(document) {
  const ingredients = [];
  const sections = [];
  let currentSection = null;

  // Get only the FIRST toggle section container (Vitamix has 3 copies for container sizes)
  let ingredientContainer = document.querySelector('.js-recipe-section__toggle-section');
  let ingredientItems = ingredientContainer?.querySelectorAll('ul li') || [];

  // Fallback to elmt-caption__desc if toggle section not found
  if (ingredientItems.length === 0) {
    ingredientContainer = document.querySelector('.elmt-caption__desc');
    ingredientItems = ingredientContainer?.querySelectorAll('ul li') || [];
  }

  // Fallback to generic ingredient selectors
  if (ingredientItems.length === 0) {
    ingredientItems = document.querySelectorAll('[class*="ingredient"] li, .ognm-banner-recipe__ingredients li');
  }

  ingredientItems.forEach((item) => {
    const text = item.textContent.trim().replace(/\s+/g, ' ');
    if (!text || text.length < 2) return;

    // Check if it's a section header (e.g., "Soup:", "Crouton Garnish:")
    if (text.endsWith(':') || item.querySelector('strong, b')) {
      currentSection = text.replace(/:$/, '');
      sections.push({ name: currentSection, items: [] });
    } else if (sections.length > 0) {
      sections[sections.length - 1].items.push(text);
    } else {
      ingredients.push(text);
    }
  });

  return { ingredients, sections };
}

/**
 * Extract directions/steps
 * Vitamix uses .direction-elements for directions (multiple copies for container sizes)
 * Get only the FIRST container to avoid duplicates (JS hasn't hidden others yet during import)
 */
function extractDirections(document) {
  const directions = [];

  // Get only the FIRST direction-elements container (Vitamix has 3 copies for container sizes)
  let directionContainer = document.querySelector('.direction-elements');
  let directionItems = directionContainer?.querySelectorAll('li') || [];

  // Fallback to carousel list if direction-elements not found
  if (directionItems.length === 0) {
    directionContainer = document.querySelector('.ognm-banner-recipe__carousel__list');
    directionItems = directionContainer?.querySelectorAll('li') || [];
  }

  // Fallback to generic direction selectors
  if (directionItems.length === 0) {
    directionItems = document.querySelectorAll('[class*="direction"] ol li, .ognm-banner-recipe__directions li');
  }

  // Final fallback to step-based selectors
  if (directionItems.length === 0) {
    directionItems = document.querySelectorAll('[class*="step"], .recipe-step');
  }

  directionItems.forEach((item) => {
    const text = item.textContent.trim();
    if (text && text.length > 5) directions.push(text);
  });

  return directions;
}

/**
 * Extract nutrition information
 * Vitamix uses .ognm-banner-recipe__nutrition with __row items containing __text spans
 */
function extractNutrition(document) {
  const nutrition = [];

  // Look for nutrition section
  const nutritionSection = document.querySelector('.ognm-banner-recipe__nutrition');
  if (nutritionSection) {
    // Serving size - in the __table__title element
    const servingEl = nutritionSection.querySelector('.ognm-banner-recipe__nutrition__table__title');
    const servingText = servingEl?.textContent?.trim();
    if (servingText) {
      nutrition.push({ label: 'Serving Size', value: servingText });
    }

    // Nutrition values - in __row elements with __text spans
    nutritionSection.querySelectorAll('.ognm-banner-recipe__nutrition__row').forEach((row) => {
      const texts = row.querySelectorAll('.ognm-banner-recipe__nutrition__text');
      if (texts.length >= 2) {
        const label = texts[0]?.textContent?.trim();
        const value = texts[1]?.textContent?.trim();
        if (label && value) {
          nutrition.push({ label, value });
        }
      }
    });
  }

  // Fallback to generic nutrition selectors if Vitamix-specific not found
  if (nutrition.length === 0) {
    const genericSection = document.querySelector('[class*="nutrition"]');
    if (genericSection) {
      genericSection.querySelectorAll('div > div').forEach((item) => {
        const children = item.querySelectorAll('div, span');
        if (children.length >= 2) {
          const label = children[0]?.textContent?.trim();
          const value = children[1]?.textContent?.trim();
          if (label && value && label !== value && !label.includes('serving')) {
            nutrition.push({ label, value });
          }
        }
      });
    }
  }

  return nutrition;
}

/**
 * Extract page metadata
 */
function extractMetadata(document, url) {
  const meta = {};

  const titleEl = document.querySelector('meta[property="og:title"]');
  meta.Title = titleEl?.content || document.title || '';

  const descEl = document.querySelector('meta[property="og:description"]')
    || document.querySelector('meta[name="description"]');
  meta.Description = descEl?.content || '';

  const imageEl = document.querySelector('meta[property="og:image"]');
  if (imageEl?.content) {
    meta.Image = imageEl.content;
  }

  return meta;
}

/**
 * Create a block table with header
 */
function createBlockTable(document, blockName) {
  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = blockName;
  headerRow.appendChild(th);
  table.appendChild(headerRow);
  return table;
}

/**
 * Create Hero-Recipe block table
 */
function createHeroRecipeBlock(document, hero) {
  const table = createBlockTable(document, 'Hero-Recipe');
  const row = document.createElement('tr');
  const cell = document.createElement('td');

  // Image
  if (hero.image) {
    const img = document.createElement('img');
    img.src = hero.image;
    img.alt = hero.imageAlt;
    cell.appendChild(img);
    cell.appendChild(document.createElement('br'));
  }

  // Title
  if (hero.title) {
    const h1 = document.createElement('h1');
    h1.textContent = hero.title;
    cell.appendChild(h1);
  }

  // Description
  if (hero.description) {
    const p = document.createElement('p');
    p.textContent = hero.description;
    cell.appendChild(p);
  }

  // Meta info (time, yield, difficulty)
  if (hero.meta.totalTime || hero.meta.yield || hero.meta.difficulty) {
    const metaP = document.createElement('p');
    const parts = [];
    if (hero.meta.totalTime) parts.push(`<strong>Total Time:</strong> ${hero.meta.totalTime}`);
    if (hero.meta.yield) parts.push(`<strong>Yield:</strong> ${hero.meta.yield}`);
    if (hero.meta.difficulty) parts.push(`<strong>Difficulty:</strong> ${hero.meta.difficulty}`);
    metaP.innerHTML = parts.join(' | ');
    cell.appendChild(metaP);
  }

  // Dietary interests
  if (hero.dietary && hero.dietary.length > 0) {
    const dietaryP = document.createElement('p');
    dietaryP.textContent = hero.dietary.join(', ');
    cell.appendChild(dietaryP);
  }

  // Submitted by
  if (hero.submittedBy) {
    const submitP = document.createElement('p');
    submitP.innerHTML = `<em>Submitted by: ${hero.submittedBy}</em>`;
    cell.appendChild(submitP);
  }

  row.appendChild(cell);
  table.appendChild(row);
  return table;
}

/**
 * Create Table-Nutrition block (no-header variant)
 */
function createNutritionBlock(document, nutrition) {
  const table = createBlockTable(document, 'Table-Nutrition (no-header)');

  nutrition.forEach((item) => {
    const row = document.createElement('tr');
    const labelTd = document.createElement('td');
    labelTd.textContent = item.label;
    const valueTd = document.createElement('td');
    valueTd.textContent = item.value;
    row.appendChild(labelTd);
    row.appendChild(valueTd);
    table.appendChild(row);
  });

  return table;
}

/**
 * Create metadata block table
 */
function createMetadataBlock(document, meta) {
  const table = createBlockTable(document, 'Metadata');

  Object.entries(meta).forEach(([key, value]) => {
    if (value) {
      const row = document.createElement('tr');
      const keyTd = document.createElement('td');
      keyTd.textContent = key;
      const valueTd = document.createElement('td');

      if (key === 'Image' && value) {
        const img = document.createElement('img');
        img.src = value;
        valueTd.appendChild(img);
      } else {
        valueTd.textContent = value;
      }

      row.appendChild(keyTd);
      row.appendChild(valueTd);
      table.appendChild(row);
    }
  });

  return table;
}

/**
 * Build the transformed content with blocks (Hero-Recipe, Table-Nutrition)
 */
function buildContentWithBlocks(document, hero, ingredientData, directions, nutrition) {
  const container = document.createElement('div');

  // Hero-Recipe Block
  const heroBlock = createHeroRecipeBlock(document, hero);
  container.appendChild(heroBlock);

  // Separator
  container.appendChild(document.createElement('hr'));

  // Ingredients (default content)
  const ingredientsH2 = document.createElement('h2');
  ingredientsH2.textContent = 'Ingredients';
  container.appendChild(ingredientsH2);

  // Ingredient sections
  if (ingredientData.sections.length > 0) {
    ingredientData.sections.forEach((section) => {
      if (section.name) {
        const sectionH3 = document.createElement('h3');
        sectionH3.textContent = section.name;
        container.appendChild(sectionH3);
      }
      const ul = document.createElement('ul');
      section.items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      container.appendChild(ul);
    });
  } else if (ingredientData.ingredients.length > 0) {
    const ul = document.createElement('ul');
    ingredientData.ingredients.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  // Directions (default content)
  const directionsH2 = document.createElement('h2');
  directionsH2.textContent = 'Directions';
  container.appendChild(directionsH2);

  if (directions.length > 0) {
    const ol = document.createElement('ol');
    directions.forEach((step) => {
      const li = document.createElement('li');
      li.textContent = step;
      ol.appendChild(li);
    });
    container.appendChild(ol);
  }

  // Nutrition section heading
  const nutritionH3 = document.createElement('h3');
  nutritionH3.textContent = 'Nutrition';
  container.appendChild(nutritionH3);

  // Table-Nutrition Block (no-header variant)
  if (nutrition.length > 0) {
    const nutritionBlock = createNutritionBlock(document, nutrition);
    container.appendChild(nutritionBlock);
  }

  return container;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  /**
   * Main transformation function for Vitamix Recipe Detail pages
   * Generates content with blocks: Hero-Recipe, Table-Nutrition
   */
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    const originalURL = params?.originalURL || url;

    console.log(`Importing: ${originalURL}`);

    // 1. Extract metadata before cleanup
    const meta = extractMetadata(document, originalURL);

    // 2. Extract recipe content before cleanup
    const hero = extractHero(document);
    const ingredientData = extractIngredients(document);
    const directions = extractDirections(document);
    const nutrition = extractNutrition(document);

    console.log(`Extracted: title="${hero.title}", ingredients=${ingredientData.sections.length + ingredientData.ingredients.length}, directions=${directions.length}, nutrition=${nutrition.length}`);

    // 3. Clean up document (remove client-side content)
    cleanupDocument(document);

    // 4. Build content with blocks (Hero-Recipe, Table-Nutrition)
    const content = buildContentWithBlocks(document, hero, ingredientData, directions, nutrition);

    // 5. Add separator and metadata block
    content.appendChild(document.createElement('hr'));
    const metadataTable = createMetadataBlock(document, meta);
    content.appendChild(metadataTable);

    // 6. Replace main content
    main.innerHTML = '';
    main.appendChild(content);

    // 7. Apply WebImporter transformations
    if (typeof WebImporter !== 'undefined') {
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, originalURL);
    }

    // 8. Generate path
    let path;
    if (typeof WebImporter !== 'undefined' && WebImporter.FileUtils) {
      path = WebImporter.FileUtils.sanitizePath(
        new URL(originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
      );
    } else {
      const urlObj = new URL(originalURL);
      path = urlObj.pathname.replace(/\/$/, '').replace(/\.html$/, '');
    }

    console.log(`Generated path: ${path}`);

    return [{
      element: main,
      path,
      report: {
        title: meta.Title || hero.title,
        url: originalURL,
        ingredientsCount: ingredientData.sections.length + ingredientData.ingredients.length,
        directionsCount: directions.length,
        nutritionCount: nutrition.length,
      },
    }];
  },
};
