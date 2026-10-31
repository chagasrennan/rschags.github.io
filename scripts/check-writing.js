const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const {JSDOM} = require("jsdom");
const {
  loadPublications,
  renderArticle,
  ROOT,
  contentFile
} = require("./build-writing");
const {launchBrowser, serve} = require("./writing-browser");

const ROOT_DIR = process.argv.includes("--production")
  ? path.join(ROOT, "build")
  : path.join(ROOT, "public");
const routeFile = route => path.join(ROOT_DIR, route, "index.html");

function checkLinks(document, route) {
  for (const anchor of document.querySelectorAll(
    "a[href], link[rel=stylesheet], script[src]"
  )) {
    const href = anchor.getAttribute("href") || anchor.getAttribute("src");
    const url = new URL(href, "https://rchags.dev" + route);
    if (url.origin !== "https://rchags.dev") continue;
    let file = path.join(ROOT_DIR, decodeURIComponent(url.pathname));
    assert(fs.existsSync(file), `${route}: missing link target ${href}`);
    if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    assert(fs.existsSync(file), `${route}: missing index ${href}`);
    if (
      url.hash &&
      file.endsWith(".html") &&
      url.pathname.startsWith("/writing/")
    ) {
      const target =
        url.pathname === route
          ? document
          : new JSDOM(fs.readFileSync(file, "utf8")).window.document;
      assert(
        target.getElementById(decodeURIComponent(url.hash.slice(1))),
        `${route}: missing anchor ${href}`
      );
      if (target !== document) target.defaultView.close();
    }
  }
}

async function main() {
  const publications = loadPublications();
  const example = {
    id: "example",
    type: "post",
    date: "2026-10-30",
    translations: {
      en: {
        title: "Markdown example",
        summary: "Check the Markdown authoring path.",
        path: "/writing/example/",
        source: "README.md"
      }
    }
  };
  const markdown = new JSDOM(
    await renderArticle(example, "en", [example], false)
  );
  assert(
    markdown.window.document.querySelector(".prose h2"),
    "Markdown headings were not rendered"
  );
  assert(
    markdown.window.document.querySelector(".prose pre code"),
    "Markdown code blocks were not rendered"
  );
  markdown.window.close();
  const whitepaper = publications.find(item => item.type === "whitepaper");
  if (whitepaper) {
    // Exercise DOI rendering without assigning a placeholder to a real publication.
    const doi = "10.5281/zenodo.123456789";
    for (const lang of Object.keys(whitepaper.translations)) {
      const dom = new JSDOM(
        await renderArticle({...whitepaper, doi}, lang, publications, true)
      );
      const {document} = dom.window;
      assert.equal(
        document.querySelector(".publication-doi a").href,
        `https://doi.org/${doi}`
      );
      assert.equal(
        document.querySelector('meta[name="citation_doi"]').content,
        doi
      );
      assert.equal(
        JSON.parse(
          document.querySelector('script[type="application/ld+json"]')
            .textContent
        ).identifier.value,
        doi
      );
      dom.window.close();
    }
  }
  const pages = [{route: "/writing/", lang: "en"}];
  for (const publication of publications)
    for (const [lang, item] of Object.entries(publication.translations)) {
      pages.push({route: item.path, lang, publication, item});
    }
  for (const {route, lang, publication, item} of pages) {
    const dom = new JSDOM(fs.readFileSync(routeFile(route), "utf8"));
    const {document} = dom.window;
    assert.equal(document.documentElement.lang, lang);
    assert.equal(
      document.querySelector("link[rel=canonical]").href,
      "https://rchags.dev" + route
    );
    assert(document.querySelector("meta[name=description]").content);
    assert(document.querySelector("main"));
    assert.equal(document.querySelectorAll("h1").length, 1);
    checkLinks(document, route);
    if (item) {
      const image = item.socialImage || publication.socialImage;
      if (image) {
        const url = `https://rchags.dev/writing/assets/${image.source}`;
        assert.equal(
          document.querySelectorAll('meta[property="og:image"]').length,
          1
        );
        assert.equal(
          document.querySelector('meta[property="og:image"]').content,
          url
        );
        assert.equal(
          document.querySelector('meta[name="twitter:image"]').content,
          url
        );
        assert.equal(
          document.querySelector('meta[name="twitter:card"]').content,
          "summary_large_image"
        );
        assert.equal(
          document.querySelector('meta[property="og:image:alt"]').content,
          image.alt
        );
        assert.equal(
          document.querySelector('meta[property="og:image:width"]').content,
          String(image.width)
        );
        assert.equal(
          document.querySelector('meta[property="og:image:height"]').content,
          String(image.height)
        );
        assert.equal(
          document.querySelector('link[rel="icon"]').getAttribute("href"),
          "/favicon.ico"
        );
        const publishedImage = fs.readFileSync(
          path.join(ROOT_DIR, "writing/assets", image.source)
        );
        assert(
          publishedImage.equals(fs.readFileSync(contentFile(image.source))),
          `${route}: social image differs from source`
        );
        if (image.source.endsWith(".png")) {
          assert.equal(
            publishedImage.subarray(0, 8).toString("hex"),
            "89504e470d0a1a0a"
          );
          assert.equal(publishedImage.readUInt32BE(16), image.width);
          assert.equal(publishedImage.readUInt32BE(20), image.height);
        }
      }
      for (const [otherLang, other] of Object.entries(
        publication.translations
      )) {
        assert.equal(
          document.querySelector(`link[hreflang="${otherLang}"]`).href,
          "https://rchags.dev" + other.path
        );
      }
      if (item.source.endsWith(".html")) {
        const original = new JSDOM(
          fs.readFileSync(contentFile(item.source), "utf8")
        );
        const dataScript = doc =>
          [...doc.querySelectorAll("script")].find(el =>
            el.textContent.startsWith("window.DATA=")
          )?.textContent;
        assert.equal(
          dataScript(document),
          dataScript(original.window.document),
          `${route}: embedded research data changed`
        );
        assert.equal(
          document.querySelectorAll("[data-fig]").length,
          original.window.document.querySelectorAll("[data-fig]").length
        );
        original.window.close();
      }
      if (item.pdf) {
        const pdf = path.join(
          ROOT_DIR,
          "writing/assets",
          path.basename(item.pdf)
        );
        assert.equal(fs.readFileSync(pdf).subarray(0, 5).toString(), "%PDF-");
      }
    }
    dom.window.close();
  }
  console.log(
    `Static checks passed: ${pages.length} pages, local links, language metadata, data integrity, and PDFs.`
  );
  if (!process.argv.includes("--browser")) return;

  const server = await serve(ROOT_DIR);
  let browser;
  try {
    browser = await launchBrowser();
    const context = await browser.newContext({
      colorScheme: "light",
      viewport: {width: 1280, height: 900}
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const {route, item} of pages) {
      const response = await page.goto(server.url + route);
      assert.equal(response.status(), 200);
      if (item?.source.endsWith(".html")) {
        await page.waitForFunction(() =>
          [...document.querySelectorAll("[data-fig] .chart")].every(
            el => el.children.length
          )
        );
        assert(
          (await page.locator("[data-fig] svg").count()) > 0,
          `${route}: no rendered charts`
        );
        const selector = page.locator('select[data-ctl="geo"]').first();
        const chart = page.locator('[data-fig="sankey"] .chart');
        const before = await chart.innerHTML();
        await selector.selectOption("SP");
        assert.notEqual(
          await chart.innerHTML(),
          before,
          `${route}: geography filter did not update chart`
        );
        const scenario = page.locator('select[data-ctl="scen"]').first();
        const beforeScenario = await chart.innerHTML();
        await scenario.selectOption("minimum_5000");
        assert.notEqual(
          await chart.innerHTML(),
          beforeScenario,
          `${route}: scenario filter did not update chart`
        );
        const theme = page.locator("#theme-toggle");
        await theme.click();
        assert.equal(
          await page.locator("html").getAttribute("data-theme"),
          "dark"
        );
        if (item.pdf) {
          const downloadEvent = page.waitForEvent("download");
          await page.locator("a[download]").click();
          const download = await downloadEvent;
          assert.equal(download.suggestedFilename(), path.basename(item.pdf));
          assert.equal(await download.failure(), null);
        }
        await theme.click();
      }
      for (const width of [390, 1280]) {
        await page.setViewportSize({width, height: 900});
        await page.waitForTimeout(180); // The source charts debounce their resize handler.
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1
          ),
          `${route}: horizontal overflow at ${width}px`
        );
      }
    }
    await page.goto(server.url + "/writing/");
    await page.locator("#writing-theme-toggle").click();
    await page
      .getByRole("link", {name: "Where did the votes go?", exact: true})
      .click();
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      "dark",
      "Theme did not persist between index and article"
    );
    await page
      .getByRole("link", {
        name: "Language: English. Switch to Portuguese.",
        exact: true
      })
      .click();
    assert.equal(await page.locator("html").getAttribute("lang"), "pt");
    assert.equal(
      new URL(page.url()).pathname,
      "/writing/brazil-2026-vote-transfers/pt/"
    );
    if (process.argv.includes("--production")) {
      await page.goto(server.url + "/");
      const writing = page.locator("#writing");
      await writing.scrollIntoViewIfNeeded();
      assert.equal(
        await writing.locator(".writing-preview").count(),
        Math.min(3, publications.length)
      );
      assert.equal(
        (await page.locator(".dark-mode").count()) > 0,
        true,
        "Article theme did not carry back to portfolio"
      );
      await writing.locator(".writing-preview-title a").first().click();
      assert.equal(
        new URL(page.url()).pathname,
        publications[0].translations.en.path
      );
      await page.goBack();
      await page.getByRole("link", {name: "View all writing"}).click();
      assert.equal(new URL(page.url()).pathname, "/writing/");
    }
    assert.deepEqual(errors, []);
    await page.goto(server.url + "/writing/");
    await page.screenshot({
      path:
        process.env.WRITING_SCREENSHOT ||
        "/private/tmp/rchags-writing-preview.png",
      fullPage: true
    });
    await context.close();
    console.log(
      "Browser checks passed: desktop/mobile, rendered charts, filters, themes, language navigation, and PDF downloads."
    );
  } finally {
    if (browser) await browser.close();
    await server.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
