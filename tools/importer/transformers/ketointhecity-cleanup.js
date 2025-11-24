/**
 * Transformer for ketointhecity.com pages
 * Removes site-wide navigation, footer, blog UI chrome, and other non-content elements
 *
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The main content element being transformed
 * @param {object} payload - Additional context (document, url, etc.)
 */
export default function transform(hookName, element, payload) {
  const { document } = payload;

  if (hookName === 'beforeTransform') {
    // Remove announcement bar
    const announcementBar = document.querySelector('.sqs-announcement-bar');
    if (announcementBar) {
      announcementBar.remove();
    }

    // Remove all headers (top and bottom)
    const headers = document.querySelectorAll('.Header, header.Header');
    headers.forEach(header => header.remove());

    // Remove mobile navigation overlay and bar
    const mobileOverlay = document.querySelector('.Mobile-overlay');
    if (mobileOverlay) {
      mobileOverlay.remove();
    }
    const mobileBars = document.querySelectorAll('.Mobile-bar');
    mobileBars.forEach(bar => bar.remove());

    // Remove footer
    const footer = document.querySelector('.Footer, footer.Footer');
    if (footer) {
      footer.remove();
    }

    // Remove blog metadata (categories, author, date, tags)
    const blogMeta = document.querySelector('.Blog-meta, .BlogItem-meta');
    if (blogMeta) {
      blogMeta.remove();
    }

    // Remove social sharing buttons
    const shareButtons = document.querySelector('.BlogItem-share, .Share');
    if (shareButtons) {
      shareButtons.remove();
    }

    // Remove blog post pagination (prev/next links)
    const blogPagination = document.querySelector('.BlogItem-pagination');
    if (blogPagination) {
      blogPagination.remove();
    }

    // Remove comments section
    const comments = document.querySelector('.BlogItem-comments');
    if (comments) {
      comments.remove();
    }

    // Remove parallax host (visual effects container)
    const parallaxHost = document.querySelector('.Parallax-host-outer');
    if (parallaxHost) {
      parallaxHost.remove();
    }

    // Remove site loader
    const loader = document.querySelector('.Loader');
    if (loader) {
      loader.remove();
    }
  }

  // No afterTransform processing needed for this site
}
