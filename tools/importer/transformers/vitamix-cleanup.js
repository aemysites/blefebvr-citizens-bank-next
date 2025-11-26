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
 * Vitamix site transformer - cleans up DOM before parsing
 * Removes UI-only elements, navigation, and interactive components
 */
export default function vitamixCleanup(document) {
  // Remove header/navigation
  document.querySelectorAll('header, nav, .header, .navigation, .nav-container').forEach((el) => el.remove());

  // Remove footer
  document.querySelectorAll('footer, .footer').forEach((el) => el.remove());

  // Remove cookie consent dialogs
  document.querySelectorAll('[class*="cookie"], [class*="consent"], #onetrust-consent-sdk').forEach((el) => el.remove());

  // Remove search forms
  document.querySelectorAll('form[action*="search"], .search-form, .search-container').forEach((el) => el.remove());

  // Remove save/print/share buttons
  document.querySelectorAll('.save-button, .print-button, .share-buttons, [class*="social-share"]').forEach((el) => el.remove());

  // Remove reviews/ratings widgets (third-party)
  document.querySelectorAll('[class*="reviews"], [class*="rating-widget"], .bazaarvoice, [class*="bv-"]').forEach((el) => el.remove());

  // Remove form controls that require JS
  document.querySelectorAll('select:not(.content-select), .dropdown-toggle, .form-control').forEach((el) => el.remove());

  // Remove navigation tabs
  document.querySelectorAll('.nav-tabs, .tab-navigation, [role="tablist"]').forEach((el) => el.remove());

  // Remove modal dialogs
  document.querySelectorAll('.modal, [class*="modal"], [role="dialog"]').forEach((el) => el.remove());

  // Remove script-only elements
  document.querySelectorAll('script, noscript, style').forEach((el) => el.remove());

  // Remove empty elements
  document.querySelectorAll('div:empty, span:empty, p:empty').forEach((el) => {
    if (!el.querySelector('img, picture, video, iframe')) {
      el.remove();
    }
  });

  // Clean up Vitamix-specific UI elements
  document.querySelectorAll('.container-selector, .size-selector, .add-to-cart').forEach((el) => el.remove());

  // Remove breadcrumbs
  document.querySelectorAll('.breadcrumb, .breadcrumbs, [class*="breadcrumb"]').forEach((el) => el.remove());

  return document;
}
