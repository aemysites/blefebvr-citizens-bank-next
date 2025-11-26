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
 * Cards block parser for product/category cards with images
 * Extracts: image + label/link for each card
 */
export default function cardsParser(element, { document }) {
  const cells = [];

  // Block name row
  cells.push(['Cards']);

  // Find all card elements
  const cardEls = element.querySelectorAll('.card, .product-card, [class*="card"]');

  // If no card elements found, try grid children
  const cards = cardEls.length > 0 ? cardEls : element.querySelectorAll(':scope > *');

  Array.from(cards).forEach((card) => {
    const row = [];

    // Extract image
    const imgEl = card.querySelector('img');
    if (imgEl) {
      const img = document.createElement('img');
      img.src = imgEl.src;
      img.alt = imgEl.alt || '';
      row.push(img);
    }

    // Extract label/link
    const linkEl = card.querySelector('a');
    const labelEl = card.querySelector('.card-label, .card-title, h3, h4, span, p');

    if (linkEl) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      const link = document.createElement('a');
      link.href = linkEl.href;
      link.textContent = labelEl ? labelEl.textContent.trim() : linkEl.textContent.trim();
      strong.appendChild(link);
      p.appendChild(strong);
      row.push(p);
    } else if (labelEl) {
      const p = document.createElement('p');
      p.textContent = labelEl.textContent.trim();
      row.push(p);
    }

    if (row.length > 0) {
      cells.push(row);
    }
  });

  return cells;
}
