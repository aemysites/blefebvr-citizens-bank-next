# Block Parsers

This directory contains block-specific parser functions for the import workflow.

## Current Status

**No parsers needed** for the current page template (`blog-post`).

The blog posts from ketointhecity.com use **default content only**:
- Headings (H1, H3)
- Paragraphs
- Images
- Lists (bulleted ingredients, numbered directions)
- Horizontal rules

All of this content is handled by the standard WebImporter default content extraction - no custom block parsers required.

## When Parsers Are Needed

Block parsers will be added here when migrating pages that use EDS blocks such as:
- Hero blocks
- Cards blocks
- Columns blocks
- Accordion blocks
- Custom block variants

Each parser file will be named `{block-variant-name}.js` and follow the WebImporter parser signature.
