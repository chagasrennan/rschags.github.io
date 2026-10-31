const fs = require("fs");
const path = require("path");
const {build, contentFile, ROOT} = require("./build-writing");
const {launchBrowser, serve} = require("./writing-browser");

async function main() {
  const publications = await build({includePDFs: false});
  const server = await serve(path.join(ROOT, "public"));
  let browser;
  try {
    browser = await launchBrowser();
    for (const publication of publications) {
      for (const [lang, item] of Object.entries(publication.translations)) {
        if (!item.pdf) continue;
        const page = await browser.newPage({
          viewport: {width: 760, height: 1000},
          colorScheme: "light"
        });
        const errors = [];
        page.on("pageerror", error => errors.push(error.message));
        await page.addInitScript(() => localStorage.setItem("isDark", "false"));
        await page.emulateMedia({media: "print"});
        await page.goto(server.url + item.path, {waitUntil: "networkidle"});
        await page.evaluate(async () => {
          await document.fonts.ready;
          document.querySelectorAll("details").forEach(el => {
            el.open = true;
          });
          document.querySelectorAll("[data-fig]").forEach(el => {
            el.style.breakInside = "avoid";
          });
        });
        if (item.source.endsWith(".html")) {
          await page.waitForFunction(() =>
            [...document.querySelectorAll("[data-fig] .chart")].every(
              el => el.children.length > 0
            )
          );
          if ((await page.locator("[data-fig] svg").count()) === 0)
            throw new Error(`Charts missing from ${item.source}`);
        }
        if (errors.length)
          throw new Error(`${item.source}: ${errors.join("; ")}`);
        fs.mkdirSync(path.dirname(contentFile(item.pdf)), {recursive: true});
        await page.pdf({
          path: contentFile(item.pdf),
          format: "A4",
          printBackground: true,
          preferCSSPageSize: true,
          displayHeaderFooter: true,
          headerTemplate: "<span></span>",
          footerTemplate: `<div style="font:9px sans-serif;color:#666;width:100%;padding:0 17mm;display:flex;justify-content:space-between"><span>Rennan Chagas · ${
            lang === "pt" ? "Entre os turnos" : "Between the Rounds"
          } · v${
            publication.version || "1.0"
          }</span><span class="pageNumber"></span></div>`,
          margin: {top: "17mm", right: "17mm", bottom: "17mm", left: "17mm"}
        });
        console.log(`Exported ${item.pdf}`);
        await page.close();
      }
    }
  } finally {
    if (browser) await browser.close();
    await server.close();
  }
  await build();
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
