# Citizens Bank Page Importers

These import scripts transform Citizens Bank pages into EDS (Edge Delivery Services) format.

## Import Scripts

- **`import.js`** - For checking pages
- **`import-creditcards.js`** - For credit cards pages

## Supported Pages

- **Checking**: `https://www.citizensbank.com/checking/overview.aspx` → Use `import.js`
- **Credit Cards**: `https://www.citizensbank.com/credit-cards/overview.aspx` → Use `import-creditcards.js`

## Structure

### Checking Page (import.js)

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

### Credit Cards Page (import-creditcards.js)

#### 1. Hero Section
- **Block**: `Hero-Creditcards`
- **Selector**: `.dcom-c-hero-commercial`
- **Structure**: Image + Heading + Description + CTA
- **Section Style**: `sage`

#### 2. Columns Section (Summit Reserve Card)
- **Block**: `Columns-Creditcards`
- **Selector**: `.dcom-c-featureSingle`
- **Content**: Summit Reserve World Elite Mastercard
- **Structure**: 2-column layout (Image | Content)
- **Section Style**: `light`

#### 3. Cards Section (3 Main Credit Cards)
- **Block**: `Cards-Creditcards`
- **Selector**: `.dcom-c-featureGrid--image`
- **Content**: Amp, Spring, Summit cards
- **Structure**: 2-column table (Image | Content)
- **Section Style**: `light`

#### 4. Icon Cards Section (Conveniences)
- **Block**: `Cards-Creditcards`
- **Selector**: `.dcom-c-featureGrid--icon`
- **Content**: 6 convenience features
- **Structure**: 2-column table (Icon | Content)
- **Section Style**: `grey`

## Usage

### Using Helix Importer UI

1. Start the Helix Importer:
   ```bash
   npx @adobe/helix-importer-ui
   ```

2. Open the importer UI in your browser (typically http://localhost:3000)

3. Configure the importer:
   - **For checking page:**
     - Import JS: `tools/importer/import.js`
     - URL: `https://www.citizensbank.com/checking/overview.aspx`
   - **For credit cards page:**
     - Import JS: `tools/importer/import-creditcards.js`
     - URL: `https://www.citizensbank.com/credit-cards/overview.aspx`

4. Click "Import" to generate the markdown

### Using Import Command

For checking page:
```bash
npx @adobe/helix-importer \
  --url https://www.citizensbank.com/checking/overview.aspx \
  --import tools/importer/import.js \
  --output content/checking
```

For credit cards page:
```bash
npx @adobe/helix-importer \
  --url https://www.citizensbank.com/credit-cards/overview.aspx \
  --import tools/importer/import-creditcards.js \
  --output content/credit-cards
```

## Output

### Checking Page
The script will generate a markdown file with:
- Hero-Checking block with sage background
- Cards-Accounts block for the 3 main checking accounts
- Columns-Accounts block for the 2 additional accounts
- Accordion-FAQ block for frequently asked questions
- Proper section metadata for styling

### Credit Cards Page
The script will generate a markdown file with:
- Hero-Creditcards block with sage background
- Columns-Creditcards block for Summit Reserve card
- Cards-Creditcards block for the 3 main credit cards
- Cards-Creditcards block for conveniences (grey background)
- Proper section metadata for styling

## Custom Blocks

The following custom block variants are used (already exist in the `blocks/` directory):

**Checking:**
- `hero-checking`
- `cards-accounts`
- `columns-accounts`
- `accordion-faq`

**Credit Cards:**
- `hero-creditcards`
- `columns-creditcards`
- `cards-creditcards`
