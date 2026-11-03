const fs = require("fs");
const path = require("path");
const {launchBrowser, serve} = require("./writing-browser");

async function main() {
  const publicDirectory = path.resolve(__dirname, "../public");
  const output = path.join(publicDirectory, "resume/rennan-chagas.pdf");
  const server = await serve(publicDirectory);
  let browser;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage({
      viewport: {width: 1100, height: 1200},
      colorScheme: "light"
    });
    await page.goto(`${server.url}/resume/`, {waitUntil: "networkidle"});
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(image => image.decode()));
    });
    const pdf = await page.pdf({
      format: "A4",
      preferCSSPageSize: true,
      printBackground: true,
      displayHeaderFooter: false
    });
    const pageCount = (pdf.toString("latin1").match(/\/Type\s*\/Page\b/g) || [])
      .length;
    if (pageCount !== 2) {
      throw new Error(`Expected a two-page résumé, received ${pageCount} pages.`);
    }
    fs.writeFileSync(output, pdf);
    console.log("Exported public/resume/rennan-chagas.pdf (2 A4 pages).");
  } finally {
    if (browser) await browser.close();
    await server.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
