/**
 * Transformer for ketointhecity.com (Squarespace blog)
 * Handles site-wide DOM cleanup before content extraction
 *
 * Removes:
 * - Squarespace announcement bars
 * - Mobile navigation overlays
 * - Site loaders and parallax hosts
 * - Cookie banners and consent dialogs
 */

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Remove Squarespace announcement bar
    const announcementBar = element.querySelector('.sqs-announcement-bar-dropzone');
    if (announcementBar) {
      announcementBar.remove();
    }

    // Remove mobile navigation elements
    const mobileElements = element.querySelectorAll('.Mobile, .Mobile-bar, .Mobile-overlay');
    mobileElements.forEach((el) => el.remove());

    // Remove site loader
    const loader = element.querySelector('.Loader');
    if (loader) {
      loader.remove();
    }

    // Remove parallax host (background effects)
    const parallax = element.querySelector('.Parallax-host-outer');
    if (parallax) {
      parallax.remove();
    }

    // Remove header and footer (handled by EDS blocks)
    const header = element.querySelector('.Header');
    if (header) {
      header.remove();
    }

    const footer = element.querySelector('.Footer');
    if (footer) {
      footer.remove();
    }

    // Remove blog metadata, sharing, and navigation (auto-generated in EDS)
    const blogMeta = element.querySelector('.Blog-meta.BlogItem-meta');
    if (blogMeta) {
      blogMeta.remove();
    }

    const blogShare = element.querySelector('.BlogItem-share');
    if (blogShare) {
      blogShare.remove();
    }

    const blogPagination = element.querySelector('.BlogItem-pagination');
    if (blogPagination) {
      blogPagination.remove();
    }

    const comments = element.querySelector('.BlogItem-comments');
    if (comments) {
      comments.remove();
    }

    // Clean up Squarespace-specific wrapper classes (keep structure, remove classes)
    const squarespaceWrappers = element.querySelectorAll('[class*="sqs-"]');
    squarespaceWrappers.forEach((wrapper) => {
      // Remove sqs- prefixed classes but keep the element
      const classes = Array.from(wrapper.classList);
      classes.forEach((className) => {
        if (className.startsWith('sqs-')) {
          wrapper.classList.remove(className);
        }
      });
    });
  }

  // No afterTransform logic needed for this site
}
