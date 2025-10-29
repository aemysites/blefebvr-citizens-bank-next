## Large HTML Workaround
- For large pages, use Playwright's `browser_snapshot` instead of raw HTML to avoid model context limits
- Extract specific data using `browser_evaluate` rather than loading entire HTML into context

## Import Script Selectors
- ALWAYS verify actual DOM structure with `browser_evaluate` before writing selectors
- Don't assume semantic HTML (e.g., `<picture>` vs `<img>`)
- Test selectors on live page first - class names may differ from expected patterns
- Clone entire content containers (using `.cloneNode(true)`) to preserve all HTML structure (lists, links, formatting) instead of selectively extracting elements
- Use `document.createElement('hr')` for section separators, NOT `<p>---</p>`
- Sections group blocks with same styling - don't create a section for every block