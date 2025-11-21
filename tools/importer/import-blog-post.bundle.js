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

  // tools/importer/import-blog-post.js
  var import_blog_post_exports = {};
  __export(import_blog_post_exports, {
    default: () => import_blog_post_default
  });

  // tools/importer/transformers/ketointhecity-remove-blog-nav.js
  function transform(hookName, element, payload) {
    const { document } = payload;
    console.log(`[TRANSFORMER] Running ${hookName} hook`);
    if (hookName === "beforeTransform") {
      const blogPagination = document.querySelectorAll(".BlogItem-pagination");
      console.log(`[TRANSFORMER] Found ${blogPagination.length} .BlogItem-pagination element(s)`);
      blogPagination.forEach((nav) => {
        console.log(`[TRANSFORMER] Removing element:`, nav.className);
        nav.remove();
      });
      const remainingPagination = document.querySelectorAll(".BlogItem-pagination");
      console.log(`[TRANSFORMER] After removal, ${remainingPagination.length} .BlogItem-pagination element(s) remain`);
      const blogMeta = document.querySelectorAll(".BlogItem-meta");
      console.log(`[TRANSFORMER] Found ${blogMeta.length} .BlogItem-meta element(s)`);
      blogMeta.forEach((meta) => {
        console.log(`[TRANSFORMER] Removing element:`, meta.className);
        meta.remove();
      });
      const remainingMeta = document.querySelectorAll(".BlogItem-meta");
      console.log(`[TRANSFORMER] After removal, ${remainingMeta.length} .BlogItem-meta element(s) remain`);
      const blogShare = document.querySelectorAll(".BlogItem-share");
      console.log(`[TRANSFORMER] Found ${blogShare.length} .BlogItem-share element(s)`);
      blogShare.forEach((share) => {
        console.log(`[TRANSFORMER] Removing element:`, share.className);
        share.remove();
      });
      const remainingShare = document.querySelectorAll(".BlogItem-share");
      console.log(`[TRANSFORMER] After removal, ${remainingShare.length} .BlogItem-share element(s) remain`);
    }
  }

  // tools/importer/parsers/form-newsletter.js
  function parseFormNewsletter(element) {
    if (!element) {
      return null;
    }
    const title = element.querySelector(".newsletter-form-header-title");
    const description = element.querySelector(".newsletter-form-header-description");
    const cells = [
      ["Form (Newsletter)"],
      ["/forms/newsletter-signup"]
    ];
    if (title || description) {
      console.log("Newsletter form context:");
      if (title) console.log("  Title:", title.textContent.trim());
      if (description) console.log("  Description:", description.textContent.trim());
    }
    return cells;
  }

  // tools/importer/import-blog-post.js
  var parsers = {
    "form-newsletter": parseFormNewsletter
  };
  var PAGE_TEMPLATE = {
    name: "blog-post",
    description: "Blog post pages from ketointhecity.com",
    urls: [
      "https://ketointhecity.com/blog/keto-recipe-peanut-butter-cup-chia-pudding"
    ],
    blocks: [
      {
        name: "form-newsletter",
        instances: [".newsletter-block"],
        section: "orange"
      }
    ]
  };
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_blog_post_default = {
    /**
     * Main transformation function
     * See references/helix-importer-guidelines.md for transform() pattern
     */
    transform: (payload) => {
      const { document, url, params } = payload;
      transform("beforeTransform", document.body, payload);
      const main = document.body;
      WebImporter.DOMUtils.remove(main, [
        "header",
        "footer",
        ".Header",
        ".Footer",
        ".Mobile",
        ".Mobile-bar",
        ".Mobile-overlay",
        "nav",
        ".sqs-announcement-bar-dropzone",
        "script",
        "style",
        "noscript"
      ]);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      const newMain = document.createElement("main");
      const blogArticle = document.querySelector("article.BlogItem");
      if (blogArticle) {
        const title = blogArticle.querySelector(".BlogItem-title");
        if (title) {
          newMain.append(title);
        }
        const content = blogArticle.querySelector(".sqs-layout");
        if (content) {
          pageBlocks.forEach((block) => {
            const blockElement = content.querySelector(block.selector);
            if (blockElement) {
              blockElement.remove();
            }
          });
          newMain.append(content);
        }
        const meta = blogArticle.querySelector(".Blog-meta");
        if (meta) {
          newMain.append(meta);
        }
      }
      newMain.append(document.createElement("hr"));
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            const cells = parser(block.element, { document, url, params });
            if (cells) {
              const table = WebImporter.DOMUtils.createTable(cells, document);
              newMain.append(table);
              if (block.section) {
                const sectionMetadata = WebImporter.DOMUtils.createTable([
                  ["Section Metadata"],
                  ["Style", block.section]
                ], document);
                newMain.append(sectionMetadata);
              }
              newMain.append(document.createElement("hr"));
            }
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      WebImporter.rules.createMetadata(newMain, document);
      WebImporter.rules.transformBackgroundImages(newMain, document);
      WebImporter.rules.adjustImageUrls(newMain, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: newMain,
        path,
        report: {
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => ({ name: b.name, selector: b.selector })),
          url: params.originalURL
        }
      }];
    }
  };
  return __toCommonJS(import_blog_post_exports);
})();
