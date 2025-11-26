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

/**
 * Hero-Recipe block parser for Vitamix recipe pages
 * Extracts: image, title, description, metadata (time/yield/difficulty), dietary tags, attribution
 */
export default function heroRecipeParser(element, { document }) {
  const cells = [];

  // Block name row
  cells.push(['Hero-Recipe']);

  // Content cell
  const contentCell = [];

  // Extract image
  const imageEl = element.querySelector('.ognm-header-recipe__image-carousel__img, .recipe-image img, img');
  if (imageEl) {
    const img = document.createElement('img');
    img.src = imageEl.src;
    img.alt = imageEl.alt || 'Recipe image';
    contentCell.push(img);
  }

  // Extract title
  const titleEl = element.querySelector('.elmt-caption__title, h1, .recipe-title');
  if (titleEl) {
    const h1 = document.createElement('h1');
    h1.textContent = titleEl.textContent.trim();
    contentCell.push(h1);
  }

  // Extract description
  const descEl = element.querySelector('.elmt-caption__desc, .recipe-description, p');
  if (descEl) {
    const p = document.createElement('p');
    p.textContent = descEl.textContent.trim();
    contentCell.push(p);
  }

  // Extract meta info (time, yield, difficulty)
  const metaItems = [];
  const timeEl = element.querySelector('[data-total-time], .recipe-time, .total-time');
  const yieldEl = element.querySelector('[data-yield], .recipe-yield, .servings');
  const difficultyEl = element.querySelector('[data-difficulty], .recipe-difficulty, .difficulty');

  if (timeEl) metaItems.push(`**Total Time:** ${timeEl.textContent.trim()}`);
  if (yieldEl) metaItems.push(`**Yield:** ${yieldEl.textContent.trim()}`);
  if (difficultyEl) metaItems.push(`**Difficulty:** ${difficultyEl.textContent.trim()}`);

  // Try to find combined meta list
  const metaList = element.querySelector('.recipe-meta, .elmt-caption__meta, ul.meta');
  if (metaList && metaItems.length === 0) {
    const items = metaList.querySelectorAll('li');
    items.forEach((item) => {
      metaItems.push(item.textContent.trim());
    });
  }

  if (metaItems.length > 0) {
    const metaP = document.createElement('p');
    metaP.innerHTML = `<strong>${metaItems.join(' | ')}</strong>`;
    contentCell.push(metaP);
  }

  // Extract dietary tags
  const tagsContainer = element.querySelector('.dietary-tags, .recipe-tags, .tags');
  if (tagsContainer) {
    const tags = [];
    tagsContainer.querySelectorAll('.tag, span, li').forEach((tag) => {
      const text = tag.textContent.trim();
      if (text) tags.push(text);
    });
    if (tags.length > 0) {
      const tagsP = document.createElement('p');
      tagsP.textContent = tags.join(', ');
      contentCell.push(tagsP);
    }
  }

  // Extract attribution
  const attributionEl = element.querySelector('.attribution, .submitted-by, .recipe-author');
  if (attributionEl) {
    const attrP = document.createElement('p');
    attrP.innerHTML = `<em>${attributionEl.textContent.trim()}</em>`;
    contentCell.push(attrP);
  }

  cells.push([contentCell]);

  return cells;
}
