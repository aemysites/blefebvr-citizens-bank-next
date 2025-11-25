/* global WebImporter */

/**
 * Transformer for Keto In The City (Squarespace) page cleanup
 * Purpose: Remove site-wide elements not part of main content
 * Applies to: All pages from ketointhecity.com
 * Generated: 2025-11-25
 *
 * Source DOM selectors identified from: https://ketointhecity.com/blog/keto-recipe-peanut-butter-cup-chia-pudding
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element) {
  if (hookName === TransformHook.beforeTransform) {
    // Initial cleanup - remove site-wide elements before block parsing

    // Squarespace announcement bar (discount codes banner)
    // Found: <div class="sqs-announcement-bar-dropzone">
    WebImporter.DOMUtils.remove(element, [
      '.sqs-announcement-bar-dropzone',
      '.sqs-announcement-bar',
    ]);

    // Mobile navigation overlay and menu
    // Found: <div class="Mobile loaded">
    WebImporter.DOMUtils.remove(element, [
      '.Mobile',
      '.Mobile-overlay',
      '.Mobile-bar',
    ]);

    // Squarespace loader and parallax containers
    // Found: <div class="Loader">, <div class="Parallax-host-outer">
    WebImporter.DOMUtils.remove(element, [
      '.Loader',
      '.Parallax-host-outer',
      '.Parallax-host',
    ]);

    // Header elements (handled by EDS header/nav system)
    // Found: <header class="Header Header--top">, <header class="Header Header--bottom">
    WebImporter.DOMUtils.remove(element, [
      'header.Header',
      '.Header',
      '.Header-inner',
    ]);

    // Footer elements (handled by EDS footer system)
    // Found: <footer class="Footer">
    WebImporter.DOMUtils.remove(element, [
      'footer.Footer',
      '.Footer',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Final cleanup - after block parsing

    // Blog-specific elements not part of main content
    // Found: <div class="Blog-meta BlogItem-meta">, <div class="BlogItem-share">
    WebImporter.DOMUtils.remove(element, [
      '.Blog-meta',
      '.BlogItem-meta',
      '.BlogItem-share',
      '.BlogItem-comments',
      '.Share',
      '.Share-buttons',
    ]);

    // Blog pagination (dynamic navigation, not migrated)
    // Found: <nav class="BlogItem-pagination">
    WebImporter.DOMUtils.remove(element, [
      '.BlogItem-pagination',
      'nav.BlogItem-pagination',
    ]);

    // Squarespace social links in content
    // Found: <nav class="SocialLinks">
    WebImporter.DOMUtils.remove(element, [
      '.SocialLinks',
      '.socialaccountlinks-v2-block',
    ]);

    // Newsletter blocks (handled separately if needed)
    // Found: <div class="newsletter-block">
    WebImporter.DOMUtils.remove(element, [
      '.newsletter-block',
      '.newsletter-form-wrapper',
    ]);

    // Remove empty spacer blocks
    // Found: <div class="sqs-block-spacer">
    WebImporter.DOMUtils.remove(element, [
      '.sqs-block-spacer',
      '.spacer-block',
    ]);

    // Remove iframes and external embeds
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link[rel="preconnect"]',
      'link[rel="dns-prefetch"]',
    ]);
  }
}
