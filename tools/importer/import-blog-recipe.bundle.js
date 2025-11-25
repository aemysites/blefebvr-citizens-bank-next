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

  // tools/importer/import-blog-recipe.js
  var import_blog_recipe_exports = {};
  __export(import_blog_recipe_exports, {
    default: () => import_blog_recipe_default
  });

  // tools/importer/transformers/ketointhecity-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".sqs-announcement-bar-dropzone",
        ".sqs-announcement-bar"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".Mobile",
        ".Mobile-overlay",
        ".Mobile-bar"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".Loader",
        ".Parallax-host-outer",
        ".Parallax-host"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "header.Header",
        ".Header",
        ".Header-inner"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer.Footer",
        ".Footer"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".Blog-meta",
        ".BlogItem-meta",
        ".BlogItem-share",
        ".BlogItem-comments",
        ".Share",
        ".Share-buttons"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".BlogItem-pagination",
        "nav.BlogItem-pagination"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".SocialLinks",
        ".socialaccountlinks-v2-block"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".newsletter-block",
        ".newsletter-form-wrapper"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".sqs-block-spacer",
        ".spacer-block"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        'link[rel="preconnect"]',
        'link[rel="dns-prefetch"]'
      ]);
    }
  }

  // tools/importer/import-blog-recipe.js
  function extractMetadata(document) {
    const metadata = {};
    const h1 = document.querySelector("h1.BlogItem-title, h1");
    if (h1) {
      metadata.title = h1.textContent.trim();
    } else {
      const metaTitle = document.querySelector('meta[property="og:title"]');
      if (metaTitle) {
        metadata.title = metaTitle.content.split(" \u2014 ")[0].trim();
      }
    }
    const metaDesc = document.querySelector('meta[property="og:description"], meta[name="description"]');
    if (metaDesc) {
      metadata.description = metaDesc.content;
    }
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      metadata.image = ogImage.content;
    }
    const author = document.querySelector(".Blog-meta-item--author");
    if (author) {
      metadata.author = author.textContent.trim();
    }
    const date = document.querySelector(".Blog-meta-item--date");
    if (date) {
      metadata.date = date.textContent.trim();
    }
    const tags = document.querySelectorAll(".Blog-meta-item--tags a");
    if (tags.length > 0) {
      metadata.tags = Array.from(tags).map((t) => t.textContent.trim()).join(", ");
    }
    metadata.template = "blog-article";
    return metadata;
  }
  function createMetadataBlock(document, metadata) {
    const cells = [["Metadata"]];
    Object.entries(metadata).forEach(([key, value]) => {
      if (value) {
        cells.push([key, value]);
      }
    });
    return WebImporter.DOMUtils.createTable(cells, document);
  }
  var import_blog_recipe_default = {
    /**
     * Apply transformations to the document.
     * @param {Object} params - Transformation parameters
     * @param {HTMLDocument} params.document - The document to transform
     * @param {string} params.url - The URL of the page being imported
     * @returns {Array} - Array of import results
     */
    transform: ({ document, url }) => {
      transform("beforeTransform", document.body, { document, url });
      const main = document.querySelector("article.BlogItem, main.Main--blog-item, .Main-content");
      if (!main) {
        console.warn("No main content found for:", url);
        return [];
      }
      const metadata = extractMetadata(document);
      transform("afterTransform", main, { document, url });
      const titleH1 = main.querySelector("h1.BlogItem-title");
      if (titleH1) {
        titleH1.remove();
      }
      const content = document.createElement("div");
      if (metadata.title) {
        const h1 = document.createElement("h1");
        h1.textContent = metadata.title;
        content.appendChild(h1);
      }
      const hr1 = document.createElement("hr");
      content.appendChild(hr1);
      const articleContent = main.querySelector(".sqs-layout, .sqs-block-content");
      if (articleContent) {
        const contentClone = articleContent.cloneNode(true);
        const blocksToUnwrap = contentClone.querySelectorAll(".sqs-block-content, .sqs-html-content");
        blocksToUnwrap.forEach((block) => {
          const parent = block.parentNode;
          while (block.firstChild) {
            parent.insertBefore(block.firstChild, block);
          }
          block.remove();
        });
        while (contentClone.firstChild) {
          content.appendChild(contentClone.firstChild);
        }
      }
      const hr2 = document.createElement("hr");
      content.appendChild(hr2);
      const metadataBlock = createMetadataBlock(document, metadata);
      content.appendChild(metadataBlock);
      const urlObj = new URL(url);
      let path = urlObj.pathname;
      if (path.endsWith("/")) {
        path = path.slice(0, -1);
      }
      return [{
        element: content,
        path
      }];
    }
  };
  return __toCommonJS(import_blog_recipe_exports);
})();
