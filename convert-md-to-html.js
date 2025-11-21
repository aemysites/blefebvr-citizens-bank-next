#!/usr/bin/env node

/**
 * Batch convert all markdown files to HTML
 * This script processes all .md files in content/blog/
 */

const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

const contentDir = path.join(__dirname, 'content', 'blog');

// Get all .md files
const mdFiles = fs.readdirSync(contentDir)
  .filter(file => file.endsWith('.md'))
  .map(file => path.join(contentDir, file));

console.log(`Found ${mdFiles.length} markdown files to convert`);

let converted = 0;
let skipped = 0;
let failed = 0;

mdFiles.forEach(mdFile => {
  const htmlFile = mdFile.replace(/\.md$/, '.html');

  // Skip if HTML already exists
  if (fs.existsSync(htmlFile)) {
    console.log(`✓ Skipping ${path.basename(mdFile)} (HTML already exists)`);
    skipped++;
    return;
  }

  try {
    console.log(`Converting ${path.basename(mdFile)}...`);

    // Read markdown file
    const markdown = fs.readFileSync(mdFile, 'utf8');

    // Convert to HTML
    const htmlContent = md.render(markdown);

    // Wrap in Document Authoring structure
    const wrappedHtml = `<body><main>${htmlContent}</main></body>`;

    // Write HTML file
    fs.writeFileSync(htmlFile, wrappedHtml, 'utf8');

    converted++;
    console.log(`✓ Converted ${path.basename(mdFile)}`);
  } catch (error) {
    failed++;
    console.error(`✗ Failed to convert ${path.basename(mdFile)}:`, error.message);
  }
});

console.log(`\nConversion complete:`);
console.log(`  Converted: ${converted}`);
console.log(`  Skipped: ${skipped}`);
console.log(`  Failed: ${failed}`);
console.log(`  Total: ${mdFiles.length}`);
