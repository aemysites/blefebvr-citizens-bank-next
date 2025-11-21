# Import Infrastructure

This directory contains the import infrastructure for bulk content migration from ketointhecity.com to Adobe Edge Delivery Services.

## Structure

```
tools/importer/
├── import.js              # Main import script (WebImporter transform)
├── page-templates.json    # Page type definitions and section mappings
├── parsers/              # Block parsers for transforming HTML to EDS blocks
│   ├── fragment-social.js    # Parser for social sharing fragments
│   ├── columns-blog-nav.js   # Parser for blog navigation
│   └── form-newsletter.js    # Parser for newsletter forms
└── README.md             # This file
```

## Usage

This import infrastructure is designed to work with the [Adobe Edge Delivery Services Import Tools](https://www.aem.live/developer/importer).

### Using the Import Tool

1. Open the import tool in your browser by navigating to a page with `?import` appended to the URL
2. The import.js script will automatically apply the appropriate page template based on the URL pattern
3. Parsers will transform source HTML into EDS-compliant block tables

### Page Templates

The `page-templates.json` file defines how different page types should be structured:

- **blog-post**: Standard blog post with article content, social sharing, navigation, and newsletter signup

Each template specifies:
- Section selectors (CSS selectors to find content in the source HTML)
- Section types (default content or blocks)
- Block parsers to use for transforming content
- Section metadata (e.g., background colors)

### Parsers

Each parser transforms a specific type of content into an EDS block:

- **fragment-social.js**: Creates a fragment block that references `/fragments/social-sharing`
- **columns-blog-nav.js**: Extracts previous/next blog post links and creates a 2-column navigation block
- **form-newsletter.js**: Creates a form block that references `/forms/newsletter-signup`

## Block Variants

This import infrastructure works with the following block variants:

- `fragment-social` (base: fragment) - Social sharing buttons
- `columns-blog-nav` (base: columns) - Blog post navigation
- `form-newsletter` (base: form) - Newsletter signup form

Each variant has its own `.js`, `.css`, and `metadata.json` files in the `/blocks` directory.

## Extending

To add support for new page types or blocks:

1. Add a new entry to `page-templates.json` with appropriate selectors
2. Create a new parser in `parsers/` if needed
3. Import and register the parser in `import.js`
4. Create corresponding block variant in `/blocks` directory

## Generated

This import infrastructure was generated during the migration of:
- https://ketointhecity.com/blog/keto-recipe-peanut-butter-cup-chia-pudding

Date: 2025-11-20
