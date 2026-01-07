/* global WebImporter */

/**
 * Transformer for Frameconcept website cleanup
 * Purpose: Remove navigation, footer, and non-content elements
 * Applies to: michaelgrob.ch/frameconcept.ch (all templates)
 * Generated: 2026-01-07
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - Elements found: .sidebar, .mobile-navigation, .credits
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform'
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove sidebar navigation (left sidebar with menu)
    // EXTRACTED: Found <div class="sidebar"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.sidebar',
      '.mobile-navigation'
    ]);

    // Remove skip link
    // EXTRACTED: Found <a class="skip-link button"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.skip-link'
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove any remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link'
    ]);
  }
}
