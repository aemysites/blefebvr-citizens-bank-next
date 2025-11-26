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

// Import parsers
import heroRecipeParser from './parsers/hero-recipe.js';
import tableNutritionParser from './parsers/table-nutrition.js';
import cardsCtaParser from './parsers/cards-cta.js';
import cardsParser from './parsers/cards.js';

// Import transformers
import vitamixCleanup from './transformers/vitamix-cleanup.js';

/**
 * A map of custom parser names to imported parser functions.
 */
export const customParsers = {
  'hero-recipe': heroRecipeParser,
  'table-nutrition': tableNutritionParser,
  'cards-cta': cardsCtaParser,
  cards: cardsParser,
};

/**
 * An array of custom page elements to parse.
 * The name is the parser name.
 * If the element is a string, it will be used as a selector to the element to parse.
 * If the element is not provided, the parser will be applied to the main element.
 */
export const customElements = [
  {
    name: 'hero-recipe',
    element: 'section.recipe-header, .ognm-header-recipe',
  },
  {
    name: 'table-nutrition',
    element: '.nutrition, .ognm-banner-recipe__nutrition',
  },
  {
    name: 'cards-cta',
    element: '.ognm-cardlist-left-aligned-caption__flex',
  },
  {
    name: 'cards',
    element: '.ognm-cardlist-product-knockout-grid__flex',
  },
];

/**
 * Custom transformers - applied before parsing
 */
export const customTransformers = {
  vitamix: vitamixCleanup,
};
