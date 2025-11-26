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
 * Table-Nutrition block parser for recipe nutrition facts
 * Extracts: label-value pairs for nutritional information
 */
export default function tableNutritionParser(element, { document }) {
  const cells = [];

  // Block name row with variant
  cells.push(['Table-Nutrition (no-header)']);

  // Extract nutrition data from various possible structures
  const nutritionData = [];

  // Try structured table first
  const table = element.querySelector('table');
  if (table) {
    table.querySelectorAll('tr').forEach((row) => {
      const cols = row.querySelectorAll('td, th');
      if (cols.length >= 2) {
        nutritionData.push({
          label: cols[0].textContent.trim(),
          value: cols[1].textContent.trim(),
        });
      }
    });
  }

  // Try definition list structure
  if (nutritionData.length === 0) {
    const dl = element.querySelector('dl');
    if (dl) {
      const dts = dl.querySelectorAll('dt');
      const dds = dl.querySelectorAll('dd');
      dts.forEach((dt, i) => {
        if (dds[i]) {
          nutritionData.push({
            label: dt.textContent.trim(),
            value: dds[i].textContent.trim(),
          });
        }
      });
    }
  }

  // Try list-based structure
  if (nutritionData.length === 0) {
    const items = element.querySelectorAll('.nutrition-item, .nutrition-row, li');
    items.forEach((item) => {
      const labelEl = item.querySelector('.label, .nutrition-label, strong, b');
      const valueEl = item.querySelector('.value, .nutrition-value, span:last-child');
      if (labelEl && valueEl) {
        nutritionData.push({
          label: labelEl.textContent.trim(),
          value: valueEl.textContent.trim(),
        });
      } else {
        // Try splitting text content
        const text = item.textContent.trim();
        const match = text.match(/^(.+?):\s*(.+)$/);
        if (match) {
          nutritionData.push({
            label: match[1].trim(),
            value: match[2].trim(),
          });
        }
      }
    });
  }

  // Add serving size first if found
  const servingSizeEl = element.querySelector('.serving-size, [data-serving-size]');
  if (servingSizeEl && !nutritionData.find((d) => d.label.toLowerCase().includes('serving'))) {
    nutritionData.unshift({
      label: 'Serving Size',
      value: servingSizeEl.textContent.trim(),
    });
  }

  // Create table rows
  nutritionData.forEach((item) => {
    cells.push([item.label, item.value]);
  });

  return cells;
}
