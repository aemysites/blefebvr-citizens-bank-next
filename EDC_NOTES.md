# EDC Site Migration Notes

## Brand Colors
- Announcement banner: `rgb(26, 101, 178)` with white text
- Blue sections: `#0050b3` (var `--blue-background`)
- Primary blue: `#2557eb` (buttons/links)
- Light background: `#f5f5f5`

## Section Metadata Patterns
- `(announcement)` - Top banner, blue bg, white text, centered
- `(blue-background)` - Full-width blue sections with white text
- `(hero)` - Hero with background image (image must exist in DOM)

## Critical Rules
1. **NEVER hardcode external URLs** - always use picture/img elements in DOM
2. **Block CSS** - goes in `blocks/{block-name}/{block-name}.css`, NOT styles.css
3. **Hero requires image** - must have picture/img element in HTML structure
4. **Nav structure** - Create nav.md (not nav.html) with: image → nested links → tools

## Block Patterns
- **Cards**: Two variants - standard and `(no images)`
- **Hero**: Full-width with image, text overlay, gradient for readability

## Styling Conventions
- Full-width sections: `max-width: none`, `margin: 0`
- Content containers: `max-width: 1200px`, centered
- Text on dark/blue backgrounds: white with text-shadow
