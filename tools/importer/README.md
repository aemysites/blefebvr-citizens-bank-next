# Citizens Bank Checking Page Importer

This import script transforms Citizens Bank checking pages into EDS (Edge Delivery Services) format.

## Structure

The script handles the following sections from the Citizens Bank checking overview page:

### 1. Hero Section
- **Block**: `Hero-Checking`
- **Selector**: `.dcom-c-hero-commercial`
- **Structure**: Image + Heading + Description + CTA
- **Section Style**: `sage`

### 2. Cards Section (3 Main Checking Accounts)
- **Block**: `Cards-Accounts`
- **Selector**: `.dcom-c-featureGrid--image`
- **Content**: Quest Checking, One Deposit Checking, Private Client Checking
- **Structure**: 2-column table (Image | Content)

### 3. Columns Section (2 Additional Accounts)
- **Block**: `Columns-Accounts`
- **Selector**: `.dcom-c-textBlock--full-width`
- **Content**: EverValue Checking, Student Checking
- **Structure**: 2-column layout (Left Account | Right Account)

### 4. FAQ Accordion
- **Block**: `Accordion-FAQ`
- **Selector**: `.dcom-c-accordion`
- **Structure**: 2-column table (Question | Answer)

## Usage

### Using Helix Importer UI

1. Start the Helix Importer:
   ```bash
   npx @adobe/helix-importer-ui
   ```

2. Open the importer UI in your browser (typically http://localhost:3000)

3. Configure the importer:
   - Import JS: Point to `tools/importer/import.js`
   - URL: `https://www.citizensbank.com/checking/overview.aspx`

4. Click "Import" to generate the markdown

### Using Import Command

```bash
npx @adobe/helix-importer \
  --url https://www.citizensbank.com/checking/overview.aspx \
  --import tools/importer/import.js \
  --output content/checking
```

## Output

The script will generate a markdown file with:
- Hero-Checking block with sage background
- Cards-Accounts block for the 3 main checking accounts
- Columns-Accounts block for the 2 additional accounts
- Accordion-FAQ block for frequently asked questions
- Proper section metadata for styling

## Custom Blocks

The following custom block variants are used (already exist in the `blocks/` directory):
- `hero-checking`
- `cards-accounts`
- `columns-accounts`
- `accordion-faq`
