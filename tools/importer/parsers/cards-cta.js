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
 * Cards-CTA block parser for call-to-action cards
 * Extracts: eyebrow, heading, CTA button for each card (no images)
 */
export default function cardsCtaParser(element, { document }) {
  const cells = [];

  // Block name row
  cells.push(['Cards-Cta']);

  // Find all card elements
  const cardEls = element.querySelectorAll('.card, .cta-card, [class*="card"]');

  // If no card elements found, try to find repeating structures
  const cards = cardEls.length > 0 ? cardEls : element.children;

  const cardData = [];

  Array.from(cards).forEach((card) => {
    const cardContent = [];

    // Extract eyebrow/label text
    const eyebrowEl = card.querySelector('.eyebrow, .card-eyebrow, .label, small, .subtitle');
    if (eyebrowEl) {
      const em = document.createElement('em');
      em.textContent = eyebrowEl.textContent.trim();
      cardContent.push(em);
    }

    // Extract heading
    const headingEl = card.querySelector('h2, h3, h4, .card-title, .heading');
    if (headingEl) {
      const h2 = document.createElement('h2');
      h2.textContent = headingEl.textContent.trim();
      cardContent.push(h2);
    }

    // Extract CTA button/link
    const ctaEl = card.querySelector('a.btn, a.button, a.cta, a[class*="button"], a');
    if (ctaEl) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      const link = document.createElement('a');
      link.href = ctaEl.href;
      link.textContent = ctaEl.textContent.trim();
      strong.appendChild(link);
      p.appendChild(strong);
      cardContent.push(p);
    }

    if (cardContent.length > 0) {
      cardData.push(cardContent);
    }
  });

  // Add cards as columns in a single row
  if (cardData.length > 0) {
    cells.push(cardData);
  }

  return cells;
}
