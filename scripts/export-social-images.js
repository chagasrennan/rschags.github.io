const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const {ROOT, contentFile} = require("./build-writing");
const {launchBrowser} = require("./writing-browser");

const escapeHTML = value =>
  String(value).replace(
    /[&<>"']/g,
    char =>
      ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[
        char
      ])
  );

async function main() {
  const catalog = contentFile("publications.json");
  const publications = JSON.parse(fs.readFileSync(catalog, "utf8"));
  const font = fs
    .readFileSync(path.join(ROOT, "src/assets/fonts/Montserrat-Regular.ttf"))
    .toString("base64");
  const browser = await launchBrowser();
  try {
    for (const publication of publications) {
      for (const [lang, item] of Object.entries(publication.translations)) {
        const label =
          publication.type === "whitepaper"
            ? "White paper"
            : lang === "pt"
            ? "Artigo"
            : "Blog post";
        const page = await browser.newPage({
          viewport: {width: 1200, height: 630},
          deviceScaleFactor: 1
        });
        await page.setContent(`<!doctype html><html lang="${lang}"><head>
          <meta charset="utf-8"><style>
          @font-face{font-family:Montserrat;src:url(data:font/ttf;base64,${font}) format('truetype')}
          *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#f6f3ed;color:#231b2e;font-family:Montserrat,sans-serif;overflow:hidden}
          main{position:relative;width:100%;height:100%;padding:64px 76px;border-top:10px solid #55198b;display:flex;flex-direction:column;align-items:flex-start}
          .eyebrow{margin:0;font-size:19px;letter-spacing:3px;text-transform:uppercase;color:#6e537f}
          h1{font-size:84px;font-weight:400;line-height:1.12;letter-spacing:-3px;margin:auto 0;max-width:1000px}
          footer{display:flex;justify-content:space-between;align-items:center;width:100%;font-size:23px;border-top:1px solid #d4c7dd;padding-top:25px}
          footer span:last-child{font-size:19px;color:#6e537f}
          .accent{position:absolute;width:180px;height:180px;border:1px solid #d4c7dd;border-radius:50%;right:-95px;top:210px}
          .accent:after{content:'';position:absolute;inset:24px;border:1px solid #d4c7dd;border-radius:50%}
          </style></head><body><main>
          <p class="eyebrow">${escapeHTML(label)} · ${
          lang === "pt" ? "Português" : "English"
        }</p>
          <h1>${escapeHTML(item.title)}</h1>
          <footer><span>Rennan Chagas</span><span>rchags.dev</span></footer>
          <div class="accent" aria-hidden="true"></div>
          </main></body></html>`);
        await page.evaluate(() => document.fonts.ready);
        const fits = await page.locator("h1").evaluate(el => {
          const box = el.getBoundingClientRect();
          return (
            box.bottom <
              document.querySelector("footer").getBoundingClientRect().top &&
            box.right <= 1124
          );
        });
        if (!fits)
          throw new Error(
            `Social cover title overflows: ${publication.id}/${lang}`
          );
        const png = await page.screenshot({type: "png"});
        const hash = crypto
          .createHash("sha256")
          .update(png)
          .digest("hex")
          .slice(0, 12);
        const source = `${path.posix.dirname(item.source)}/social-${
          publication.type
        }-${lang}-${hash}.png`;
        const destination = contentFile(source);
        fs.mkdirSync(path.dirname(destination), {recursive: true});
        fs.writeFileSync(destination, png);
        item.socialImage = {
          source,
          alt: `${item.title} — Rennan Chagas`,
          width: 1200,
          height: 630
        };
        console.log(`Exported ${source}`);
        await page.close();
      }
    }
    fs.writeFileSync(catalog, JSON.stringify(publications, null, 2) + "\n");
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
