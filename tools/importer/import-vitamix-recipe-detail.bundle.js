var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-vitamix-recipe-detail.js
  var import_vitamix_recipe_detail_exports = {};
  __export(import_vitamix_recipe_detail_exports, {
    default: () => import_vitamix_recipe_detail_default
  });
  function cleanupDocument(document) {
    document.querySelectorAll("header, nav, .header, .navigation, .nav-container").forEach((el) => el.remove());
    document.querySelectorAll("footer, .footer").forEach((el) => el.remove());
    document.querySelectorAll('[class*="cookie"], [class*="consent"], #onetrust-consent-sdk').forEach((el) => el.remove());
    document.querySelectorAll('.ognm-cardlist-left-aligned-caption__flex, [class*="cardlist-left-aligned"]').forEach((el) => el.remove());
    document.querySelectorAll('.ognm-cardlist-product-knockout-grid__flex, [class*="product-knockout"]').forEach((el) => el.remove());
    document.querySelectorAll('[class*="reviews"], [class*="rating"], .bazaarvoice, [class*="bv-"]').forEach((el) => el.remove());
    document.querySelectorAll('[class*="related-recipe"], [class*="try-related"]').forEach((el) => el.remove());
    document.querySelectorAll('form[action*="search"], .search-form, [class*="search"]').forEach((el) => el.remove());
    document.querySelectorAll('[class*="save-button"], [class*="print-button"], [class*="share"]').forEach((el) => el.remove());
    document.querySelectorAll('.nav-tabs, [class*="recipe-nav"], [role="tablist"]').forEach((el) => el.remove());
    document.querySelectorAll('[class*="cook-mode"]').forEach((el) => el.remove());
    document.querySelectorAll('[class*="what-else"], [class*="popular-searches"]').forEach((el) => el.remove());
    document.querySelectorAll('[class*="signup"], [class*="newsletter"], [class*="email-capture"]').forEach((el) => el.remove());
    document.querySelectorAll("script, noscript, style, iframe").forEach((el) => el.remove());
    document.querySelectorAll('[class*="promo"], [class*="banner"]').forEach((el) => el.remove());
    document.querySelectorAll('[class*="breadcrumb"]').forEach((el) => el.remove());
    document.querySelectorAll('[class*="container-size"], [class*="refine-recipe"]').forEach((el) => el.remove());
  }
  function extractHero(document) {
    var _a, _b;
    const hero = {};
    const titleEl = document.querySelector("article h2, h1, .recipe-title");
    hero.title = ((_a = titleEl == null ? void 0 : titleEl.textContent) == null ? void 0 : _a.trim()) || "";
    const descEl = document.querySelector("article p, .recipe-description");
    hero.description = ((_b = descEl == null ? void 0 : descEl.textContent) == null ? void 0 : _b.trim()) || "";
    const imgEl = document.querySelector("article img[alt], .recipe-image img");
    hero.image = (imgEl == null ? void 0 : imgEl.src) || "";
    hero.imageAlt = (imgEl == null ? void 0 : imgEl.alt) || hero.title;
    hero.meta = {};
    document.querySelectorAll("article ul li, .recipe-meta li").forEach((item) => {
      var _a2, _b2, _c, _d;
      const label = (_b2 = (_a2 = item.querySelector("div:first-child, .label")) == null ? void 0 : _a2.textContent) == null ? void 0 : _b2.trim();
      const value = (_d = (_c = item.querySelector("div:last-child, .value")) == null ? void 0 : _c.textContent) == null ? void 0 : _d.trim();
      if (label && value && label !== value) {
        if (label.includes("Time")) hero.meta.totalTime = value;
        if (label.includes("Yield")) hero.meta.yield = value;
        if (label.includes("Difficulty")) hero.meta.difficulty = value;
      }
    });
    hero.dietary = [];
    document.querySelectorAll('a[href*="refineby"]').forEach((link) => {
      const text = link.textContent.trim().replace(/,\s*$/, "");
      if (text && !hero.dietary.includes(text)) hero.dietary.push(text);
    });
    const h4Elements = document.querySelectorAll("h4");
    let submittedBy = "Vitamix";
    h4Elements.forEach((h4) => {
      if (h4.textContent.includes("Submitted")) {
        const nextEl = h4.nextElementSibling;
        if (nextEl) submittedBy = nextEl.textContent.trim();
      }
    });
    hero.submittedBy = submittedBy;
    return hero;
  }
  function extractIngredients(document) {
    const ingredients = [];
    const sections = [];
    let currentSection = null;
    let ingredientContainer = document.querySelector(".js-recipe-section__toggle-section");
    let ingredientItems = (ingredientContainer == null ? void 0 : ingredientContainer.querySelectorAll("ul li")) || [];
    if (ingredientItems.length === 0) {
      ingredientContainer = document.querySelector(".elmt-caption__desc");
      ingredientItems = (ingredientContainer == null ? void 0 : ingredientContainer.querySelectorAll("ul li")) || [];
    }
    if (ingredientItems.length === 0) {
      ingredientItems = document.querySelectorAll('[class*="ingredient"] li, .ognm-banner-recipe__ingredients li');
    }
    ingredientItems.forEach((item) => {
      const text = item.textContent.trim().replace(/\s+/g, " ");
      if (!text || text.length < 2) return;
      if (text.endsWith(":") || item.querySelector("strong, b")) {
        currentSection = text.replace(/:$/, "");
        sections.push({ name: currentSection, items: [] });
      } else if (sections.length > 0) {
        sections[sections.length - 1].items.push(text);
      } else {
        ingredients.push(text);
      }
    });
    return { ingredients, sections };
  }
  function extractDirections(document) {
    const directions = [];
    let directionContainer = document.querySelector(".direction-elements");
    let directionItems = (directionContainer == null ? void 0 : directionContainer.querySelectorAll("li")) || [];
    if (directionItems.length === 0) {
      directionContainer = document.querySelector(".ognm-banner-recipe__carousel__list");
      directionItems = (directionContainer == null ? void 0 : directionContainer.querySelectorAll("li")) || [];
    }
    if (directionItems.length === 0) {
      directionItems = document.querySelectorAll('[class*="direction"] ol li, .ognm-banner-recipe__directions li');
    }
    if (directionItems.length === 0) {
      directionItems = document.querySelectorAll('[class*="step"], .recipe-step');
    }
    directionItems.forEach((item) => {
      const text = item.textContent.trim();
      if (text && text.length > 5) directions.push(text);
    });
    return directions;
  }
  function extractNutrition(document) {
    var _a;
    const nutrition = [];
    const nutritionSection = document.querySelector(".ognm-banner-recipe__nutrition");
    if (nutritionSection) {
      const servingEl = nutritionSection.querySelector(".ognm-banner-recipe__nutrition__table__title");
      const servingText = (_a = servingEl == null ? void 0 : servingEl.textContent) == null ? void 0 : _a.trim();
      if (servingText) {
        nutrition.push({ label: "Serving Size", value: servingText });
      }
      nutritionSection.querySelectorAll(".ognm-banner-recipe__nutrition__row").forEach((row) => {
        var _a2, _b, _c, _d;
        const texts = row.querySelectorAll(".ognm-banner-recipe__nutrition__text");
        if (texts.length >= 2) {
          const label = (_b = (_a2 = texts[0]) == null ? void 0 : _a2.textContent) == null ? void 0 : _b.trim();
          const value = (_d = (_c = texts[1]) == null ? void 0 : _c.textContent) == null ? void 0 : _d.trim();
          if (label && value) {
            nutrition.push({ label, value });
          }
        }
      });
    }
    if (nutrition.length === 0) {
      const genericSection = document.querySelector('[class*="nutrition"]');
      if (genericSection) {
        genericSection.querySelectorAll("div > div").forEach((item) => {
          var _a2, _b, _c, _d;
          const children = item.querySelectorAll("div, span");
          if (children.length >= 2) {
            const label = (_b = (_a2 = children[0]) == null ? void 0 : _a2.textContent) == null ? void 0 : _b.trim();
            const value = (_d = (_c = children[1]) == null ? void 0 : _c.textContent) == null ? void 0 : _d.trim();
            if (label && value && label !== value && !label.includes("serving")) {
              nutrition.push({ label, value });
            }
          }
        });
      }
    }
    return nutrition;
  }
  function extractMetadata(document, url) {
    const meta = {};
    const titleEl = document.querySelector('meta[property="og:title"]');
    meta.Title = (titleEl == null ? void 0 : titleEl.content) || document.title || "";
    const descEl = document.querySelector('meta[property="og:description"]') || document.querySelector('meta[name="description"]');
    meta.Description = (descEl == null ? void 0 : descEl.content) || "";
    const imageEl = document.querySelector('meta[property="og:image"]');
    if (imageEl == null ? void 0 : imageEl.content) {
      meta.Image = imageEl.content;
    }
    return meta;
  }
  function createBlockTable(document, blockName) {
    const table = document.createElement("table");
    const headerRow = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = blockName;
    headerRow.appendChild(th);
    table.appendChild(headerRow);
    return table;
  }
  function createHeroRecipeBlock(document, hero) {
    const table = createBlockTable(document, "Hero-Recipe");
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    if (hero.image) {
      const img = document.createElement("img");
      img.src = hero.image;
      img.alt = hero.imageAlt;
      cell.appendChild(img);
      cell.appendChild(document.createElement("br"));
    }
    if (hero.title) {
      const h1 = document.createElement("h1");
      h1.textContent = hero.title;
      cell.appendChild(h1);
    }
    if (hero.description) {
      const p = document.createElement("p");
      p.textContent = hero.description;
      cell.appendChild(p);
    }
    if (hero.meta.totalTime || hero.meta.yield || hero.meta.difficulty) {
      const metaP = document.createElement("p");
      const parts = [];
      if (hero.meta.totalTime) parts.push(`<strong>Total Time:</strong> ${hero.meta.totalTime}`);
      if (hero.meta.yield) parts.push(`<strong>Yield:</strong> ${hero.meta.yield}`);
      if (hero.meta.difficulty) parts.push(`<strong>Difficulty:</strong> ${hero.meta.difficulty}`);
      metaP.innerHTML = parts.join(" | ");
      cell.appendChild(metaP);
    }
    if (hero.dietary && hero.dietary.length > 0) {
      const dietaryP = document.createElement("p");
      dietaryP.textContent = hero.dietary.join(", ");
      cell.appendChild(dietaryP);
    }
    if (hero.submittedBy) {
      const submitP = document.createElement("p");
      submitP.innerHTML = `<em>Submitted by: ${hero.submittedBy}</em>`;
      cell.appendChild(submitP);
    }
    row.appendChild(cell);
    table.appendChild(row);
    return table;
  }
  function createNutritionBlock(document, nutrition) {
    const table = createBlockTable(document, "Table-Nutrition (no-header)");
    nutrition.forEach((item) => {
      const row = document.createElement("tr");
      const labelTd = document.createElement("td");
      labelTd.textContent = item.label;
      const valueTd = document.createElement("td");
      valueTd.textContent = item.value;
      row.appendChild(labelTd);
      row.appendChild(valueTd);
      table.appendChild(row);
    });
    return table;
  }
  function createMetadataBlock(document, meta) {
    const table = createBlockTable(document, "Metadata");
    Object.entries(meta).forEach(([key, value]) => {
      if (value) {
        const row = document.createElement("tr");
        const keyTd = document.createElement("td");
        keyTd.textContent = key;
        const valueTd = document.createElement("td");
        if (key === "Image" && value) {
          const img = document.createElement("img");
          img.src = value;
          valueTd.appendChild(img);
        } else {
          valueTd.textContent = value;
        }
        row.appendChild(keyTd);
        row.appendChild(valueTd);
        table.appendChild(row);
      }
    });
    return table;
  }
  function buildContentWithBlocks(document, hero, ingredientData, directions, nutrition) {
    const container = document.createElement("div");
    const heroBlock = createHeroRecipeBlock(document, hero);
    container.appendChild(heroBlock);
    container.appendChild(document.createElement("hr"));
    const ingredientsH2 = document.createElement("h2");
    ingredientsH2.textContent = "Ingredients";
    container.appendChild(ingredientsH2);
    if (ingredientData.sections.length > 0) {
      ingredientData.sections.forEach((section) => {
        if (section.name) {
          const sectionH3 = document.createElement("h3");
          sectionH3.textContent = section.name;
          container.appendChild(sectionH3);
        }
        const ul = document.createElement("ul");
        section.items.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          ul.appendChild(li);
        });
        container.appendChild(ul);
      });
    } else if (ingredientData.ingredients.length > 0) {
      const ul = document.createElement("ul");
      ingredientData.ingredients.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      });
      container.appendChild(ul);
    }
    const directionsH2 = document.createElement("h2");
    directionsH2.textContent = "Directions";
    container.appendChild(directionsH2);
    if (directions.length > 0) {
      const ol = document.createElement("ol");
      directions.forEach((step) => {
        const li = document.createElement("li");
        li.textContent = step;
        ol.appendChild(li);
      });
      container.appendChild(ol);
    }
    const nutritionH3 = document.createElement("h3");
    nutritionH3.textContent = "Nutrition";
    container.appendChild(nutritionH3);
    if (nutrition.length > 0) {
      const nutritionBlock = createNutritionBlock(document, nutrition);
      container.appendChild(nutritionBlock);
    }
    return container;
  }
  var import_vitamix_recipe_detail_default = {
    /**
     * Main transformation function for Vitamix Recipe Detail pages
     * Generates content with blocks: Hero-Recipe, Table-Nutrition
     */
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      const originalURL = (params == null ? void 0 : params.originalURL) || url;
      console.log(`Importing: ${originalURL}`);
      const meta = extractMetadata(document, originalURL);
      const hero = extractHero(document);
      const ingredientData = extractIngredients(document);
      const directions = extractDirections(document);
      const nutrition = extractNutrition(document);
      console.log(`Extracted: title="${hero.title}", ingredients=${ingredientData.sections.length + ingredientData.ingredients.length}, directions=${directions.length}, nutrition=${nutrition.length}`);
      cleanupDocument(document);
      const content = buildContentWithBlocks(document, hero, ingredientData, directions, nutrition);
      content.appendChild(document.createElement("hr"));
      const metadataTable = createMetadataBlock(document, meta);
      content.appendChild(metadataTable);
      main.innerHTML = "";
      main.appendChild(content);
      if (typeof WebImporter !== "undefined") {
        WebImporter.rules.transformBackgroundImages(main, document);
        WebImporter.rules.adjustImageUrls(main, url, originalURL);
      }
      let path;
      if (typeof WebImporter !== "undefined" && WebImporter.FileUtils) {
        path = WebImporter.FileUtils.sanitizePath(
          new URL(originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
        );
      } else {
        const urlObj = new URL(originalURL);
        path = urlObj.pathname.replace(/\/$/, "").replace(/\.html$/, "");
      }
      console.log(`Generated path: ${path}`);
      return [{
        element: main,
        path,
        report: {
          title: meta.Title || hero.title,
          url: originalURL,
          ingredientsCount: ingredientData.sections.length + ingredientData.ingredients.length,
          directionsCount: directions.length,
          nutritionCount: nutrition.length
        }
      }];
    }
  };
  return __toCommonJS(import_vitamix_recipe_detail_exports);
})();
